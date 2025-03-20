import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Linking } from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import MapView, { Marker } from "react-native-maps";
import Constants from "expo-constants";

// ✅ Google Places API 키 (환경 변수에서 가져오기)
const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.googlePlacesApiKey || "";

interface Gym {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export default function LocationRecommendation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  // ✅ 현재 위치 가져오기
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("위치 접근 권한이 필요합니다!");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      fetchNearbyGyms(currentLocation.coords.latitude, currentLocation.coords.longitude);
    } catch (error) {
      console.error("위치 가져오기 실패:", error);
    }
  };

  // ✅ 근처 운동 시설 검색 (Google Places API 활용)
  const fetchNearbyGyms = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=3000&type=gym&key=${GOOGLE_PLACES_API_KEY}`
      );

      if (response.data.results) {
        const gymList = response.data.results.map((gym: any) => ({
          id: gym.place_id,
          name: gym.name,
          address: gym.vicinity,
          latitude: gym.geometry.location.lat,
          longitude: gym.geometry.location.lng,
        }));

        setGyms(gymList);
      }
    } catch (error) {
      console.error("운동 시설 검색 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 내 주변 운동 시설</Text>

      {/* ✅ 로딩 인디케이터 */}
      {loading && <ActivityIndicator size="large" color="#007AFF" />}

      {/* ✅ 지도 표시 */}
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {/* ✅ 현재 위치 마커 */}
          <Marker coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }} title="현재 위치" />

          {/* ✅ 운동 시설 마커 */}
          {gyms.map((gym) => (
            <Marker key={gym.id} coordinate={{ latitude: gym.latitude, longitude: gym.longitude }} title={gym.name} />
          ))}
        </MapView>
      )}

      {/* ✅ 운동 시설 리스트 */}
      <FlatList
        data={gyms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.gymItem}>
            <Text style={styles.gymName}>{item.name}</Text>
            <Text style={styles.gymAddress}>{item.address}</Text>
            <TouchableOpacity
              style={styles.navigateButton}
              onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`)}
            >
              <Text style={styles.navigateButtonText}>길찾기</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

// ✅ 스타일 정의
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  map: { width: "100%", height: 250, marginBottom: 10 },
  gymItem: { backgroundColor: "#F5F5F5", padding: 12, borderRadius: 8, marginVertical: 8 },
  gymName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  gymAddress: { fontSize: 14, color: "#666", marginBottom: 5 },
  navigateButton: { backgroundColor: "#007AFF", padding: 8, borderRadius: 5, alignItems: "center" },
  navigateButtonText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
});

