import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

const nameToRouteMap: Record<string, string> = {
  "플랭크": "plank",
  "스쿼트": "squat",
  "숄더 프레스": "shoulder-press",
  "컬": "curl",
  "랫풀다운": "latpulldown",
  "크런치": "crunch",
  "힙 브릿지": "hip-bridge",
  "카프레이즈": "calf-raise",
};

export default function ARGuide() {
  const router = useRouter();
  const { recommended } = useLocalSearchParams();

  let parsed: Record<string, string> = {};
  try {
    parsed = JSON.parse(recommended as string);
  } catch (e) {
    console.warn("운동 추천 파싱 실패", e);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🧘‍♀️ 추천된 운동</Text>
      {Object.entries(parsed).map(([part, name]) => {
        const route = nameToRouteMap[name];
        if (!route) return null;

        return (
          <TouchableOpacity
            key={part}
            style={styles.button}
            onPress={() => router.push(`/${route}`)}
          >
            <Text style={styles.buttonText}>{name}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 16,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
