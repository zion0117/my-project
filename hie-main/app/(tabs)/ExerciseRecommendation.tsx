import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { getAuth } from "firebase/auth";
import { CustomText as Text } from "../../components/CustomText";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebaseConfig"; // 🔁 경로 확인
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const exercises: Record<string, string[]> = {
  허리: ["플랭크", "브릿지", "백 익스텐션"],
  무릎: ["스쿼트", "런지", "레그 익스텐션"],
  어깨: ["숄더 프레스", "레터럴 레이즈", "리버스 플라이"],
  팔: ["컬", "트라이셉스 익스텐션", "푸쉬업"],
  등: ["랫풀다운", "시티드로우", "풀업"],
  복부: ["크런치", "러시안 트위스트", "마운틴 클라이머"],
  엉덩이: ["힙 브릿지", "킥백", "스텝업"],
  종아리: ["카프레이즈", "점프 스쿼트", "스텝 점프"],
};

export default function ExerciseRecommendation() {
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const router = useRouter();

  const toggleBodyPart = (part: string) => {
    if (selectedParts.includes(part)) {
      setSelectedParts(selectedParts.filter((p) => p !== part));
    } else {
      if (selectedParts.length >= 8) {
        Alert.alert("선택 제한", "최대 8개까지 선택할 수 있습니다.");
        return;
      }
      setSelectedParts([...selectedParts, part]);
    }
  };

  const getRecommendations = () => {
    const result: Record<string, string> = {};
    selectedParts.forEach((part) => {
      const list = exercises[part];
      const random = list[Math.floor(Math.random() * list.length)];
      result[part] = random;
    });
    return result;
  };

  const handleSubmit = async () => {
    if (selectedParts.length === 0) {
      Alert.alert("선택 필요", "운동 부위를 최소 1개 이상 선택하세요.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert("오류", "로그인이 필요합니다.");
      return;
    }

    const recommendations = getRecommendations();

    setLoading(true);
    try {
      await addDoc(collection(db, "exercise_recommendations"), {
        userId: user.uid,
        bodyParts: selectedParts,
        recommendedExercises: recommendations,
        timestamp: Timestamp.now(),
      });

      Alert.alert("운동 추천 완료", "추천 결과가 저장되었습니다.");

      // ✅ 추천 운동 정보를 포함해 ARGuide로 이동
      router.push({
        pathname: "/ARGuide",
        params: { recommended: JSON.stringify(recommendations) },
      });
    } catch (err) {
      console.error("저장 오류:", err);
      Alert.alert("저장 실패", "데이터를 저장하는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const recommendations = getRecommendations();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>💪 운동하고 싶은 부위를 선택하세요 (최대 8개)</Text>

      <View style={styles.grid}>
        {Object.keys(exercises).map((part) => (
          <TouchableOpacity
            key={part}
            onPress={() => toggleBodyPart(part)}
            style={[styles.partButton, selectedParts.includes(part) && styles.selectedButton]}
          >
            <Text style={[styles.partText, selectedParts.includes(part) && styles.selectedText]}>
              {part}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 30 }} />
      ) : (
        <>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>🏋️‍♀️ 운동 추천 받기</Text>
          </TouchableOpacity>

          {selectedParts.length > 0 && (
            <View style={styles.recommendationBox}>
              <Text style={styles.recommendTitle}>추천 운동</Text>
              {Object.entries(recommendations).map(([part, exercise]) => (
                <Text key={part} style={styles.exerciseText}>
                  ▶ {part}: {exercise}
                </Text>
              ))}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  partButton: {
    backgroundColor: "#eee",
    paddingVertical: 10,
    paddingHorizontal: 16,
    margin: 6,
    borderRadius: 8,
  },
  selectedButton: {
    backgroundColor: "#007AFF",
  },
  partText: {
    color: "#333",
    fontWeight: "600",
  },
  selectedText: {
    color: "#fff",
  },
  submitButton: {
    marginTop: 30,
    backgroundColor: "#FF5722",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  recommendationBox: {
    marginTop: 30,
    width: "100%",
    backgroundColor: "#f2f2f2",
    padding: 20,
    borderRadius: 12,
  },
  recommendTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  exerciseText: { fontSize: 16, marginBottom: 4 },
});
