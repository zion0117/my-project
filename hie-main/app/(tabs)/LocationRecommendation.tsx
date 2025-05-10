import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from "react-native";
import * as Location from "expo-location";
import Constants from "expo-constants";
import axios from "axios";

interface Gym {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.googlePlacesApiKey || "";

const LocationRecommendation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLocationAndGyms();
  }, []);

  const getLocationAndGyms = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("권한 오류", "위치 권한이 필요합니다.");
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      const { latitude, longitude } = currentLocation.coords;

      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
        {
          params: {
            location: `${latitude},${longitude}`,
            radius: 3000,
            keyword: "헬스장",
            language: "ko",
            key: GOOGLE_PLACES_API_KEY
          }
        }
      );

      console.log("💬 Google Places 응답:", response.data);

      if (response.data.results) {
        const gymList = response.data.results.map((gym: any) => ({
          id: gym.place_id,
          name: gym.name,
          address: gym.vicinity,
          latitude: gym.geometry.location.lat,
          longitude: gym.geometry.location.lng
        }));
        setGyms(gymList);
      } else {
        Alert.alert("검색 결과 없음", "근처 헬스장을 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("❌ 시설 검색 오류:", error);
      Alert.alert("오류 발생", "운동시설을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 내 위치 기반 헬스장 추천</Text>
      {gyms.length > 0 ? (
        <FlatList
          data={gyms}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.gymItem}>
              <Text style={styles.gymName}>🏋️ {item.name}</Text>
              <Text style={styles.gymAddress}>{item.address}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noResult}>근처에 헬스장을 찾을 수 없습니다.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  gymItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  gymName: { fontSize: 16, fontWeight: "500" },
  gymAddress: { fontSize: 14, color: "#555" },
  noResult: { textAlign: "center", color: "#888", fontSize: 16, marginTop: 20 }
});

export default LocationRecommendation;
