import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// 운동명과 라우트 매핑
const nameToRouteMap = {
  "플랭크": "plank",
  "스쿼트": "squat",
  "숄더 프레스": "shoulder-press",
  "컬": "curl",
  "랫풀다운": "latpulldown",
  "크런치": "crunch",
  "힙 브릿지": "hip-bridge",
  "카프레이즈": "calf-raise",
};

// 운동명과 아이콘 매핑
const exerciseIcons = {
  "플랭크": "body-outline",
  "스쿼트": "walk-outline",
  "숄더 프레스": "barbell-outline",
  "컬": "barbell-outline",
  "랫풀다운": "fitness-outline",
  "크런치": "ellipse-outline",
  "힙 브릿지": "female-outline",
  "카프레이즈": "footsteps-outline",
};

// 운동명과 컬러 매핑
const exerciseColors = {
  "플랭크": "#FF7E5F",
  "스쿼트": "#00C9FF",
  "숄더 프레스": "#654EA3",
  "컬": "#2193B0",
  "랫풀다운": "#3A7BD5",
  "크런치": "#C2E59C",
  "힙 브릿지": "#FF5ACD",
  "카프레이즈": "#7B4397",
};

export default function ARGuide() {
  const router = useRouter();
  const { recommended } = useLocalSearchParams();

  let parsed = {};
  try {
    parsed = JSON.parse(recommended);
  } catch (e) {
    console.warn("운동 추천 파싱 실패", e);
  }

  // 모든 운동명 반복
  return (
    <View style={styles.container}>
      <Text style={styles.title}>💪 추천된 운동</Text>
      <Text style={styles.subtitle}>운동을 선택하면 AR 가이드로 이동합니다</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {Object.entries(parsed).map(([part, name]) => {
          const route = nameToRouteMap[name];
          const icon = exerciseIcons[name] || "barbell-outline";
          const color = exerciseColors[name] || "#007AFF";
          if (!route) return null;

          return (
            <TouchableOpacity
              key={part}
              style={[styles.card, { borderLeftColor: color }]}
              activeOpacity={0.85}
              onPress={() => router.push(`/${route}`)} // ← 여기서 navigate!
            >
              <View style={[styles.iconCircle, { backgroundColor: color }]}>
                <Ionicons name={icon} size={32} color="#fff" />
              </View>
              <View style={styles.textArea}>
                <Text style={styles.exerciseName}>{name}</Text>
                <Text style={styles.bodyPart}>{part} 부위</Text>
              </View>
              <Ionicons name="chevron-forward" size={28} color="#bbb" />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FB",
    paddingTop: 48,
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 15,
    color: "#6b6b6b",
    textAlign: "center",
    marginBottom: 24,
  },
  scrollContainer: {
    paddingHorizontal: 18,
    paddingBottom: 32,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    borderLeftWidth: 7,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
  },
  textArea: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 2,
  },
  bodyPart: {
    fontSize: 15,
    color: "#888",
  },
});
