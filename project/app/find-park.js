import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const App = () => {
  const [location, setLocation] = useState(null);
  const [parks, setParks] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  // 사용자의 위치를 가져오는 함수
  const fetchLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let locationData = await Location.getCurrentPositionAsync({});
    setLocation(locationData.coords);
  };

  // 구글 맵 API를 통해 주변 공원 5개를 가져오는 함수
  const fetchNearbyParks = async (latitude: number, longitude: number) => {
    const apiKey = 'AIzaSyCw1L3S9pfSFGzzPJ5P75EUwfJ7Xjvm_ko';
    const radius = 5000; // 5km 반경
    const type = 'park'; // 공원 타입

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setParks(data.results.slice(0, 5)); // 상위 5개 공원만 반환
    } catch (error) {
      console.error('Error fetching parks:', error);
    }
  };

  // 컴포넌트가 마운트 될 때 사용자의 위치를 가져오고 공원을 찾아오는 함수
  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // 위치 추적을 지속적으로 업데이트하기 위해 watchPositionAsync 사용
      const watch = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 10000, distanceInterval: 10 },
        (newLocation) => {
          setLocation(newLocation.coords); // 새로운 위치 업데이트
        }
      );

      // clean up
      return () => {
        watch.remove();
      };
    };

    getLocation();
  }, []);

  // 사용자의 위치가 업데이트되면 주변 공원을 찾아옴
  useEffect(() => {
    if (location) {
      fetchNearbyParks(location.latitude, location.longitude);
    }
  }, [location]);

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }

  if (!location) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* 사용자 위치 마커 */}
        <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} title="You" />
        
        {/* 주변 공원 마커 */}
        {parks.map((park) => (
          <Marker
            key={park.place_id}
            coordinate={{
              latitude: park.geometry.location.lat,
              longitude: park.geometry.location.lng,
            }}
            title={park.name}
          />
        ))}
      </MapView>
    </View>
  );
};

export default App;

