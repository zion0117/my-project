import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { db, auth } from "./firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";

// ✅ 취약 신체 부위별 운동 추천 목록 (타입 명확히 지정)
const exercises: Record<string, string[]> = {
  허리: ["플랭크", "브릿지", "백 익스텐션"],
  무릎: ["스쿼트", "런지", "레그 익스텐션"],
  어깨: ["숄더 프레스", "레터럴 레이즈", "리버스 플라이"],
};

// ✅ AI 운동 추천 함수 (랜덤 선택)
const recommendExercise = (bodyPart: keyof typeof exercises): string => {
  const exerciseList = exercises[bodyPart];
  const randomIndex = Math.floor(Math.random() * exerciseList.length);
  return exerciseList[randomIndex] || "운동 추천 불가";
};

export default function ExerciseRecommendation() {
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [recommendedExercise, setRecommendedExercise] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ 운동 추천 및 Firebase 저장
  const handleRecommendation = async (bodyPart: keyof typeof exercises) => {
    setLoading(true);
    setSelectedBodyPart(bodyPart);

    const exercise = recommendExercise(bodyPart); // 항상 string 반환 보장
    setRecommendedExercise(exercise); // ✅ 문자열만 저장하도록 수정

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("로그인이 필요합니다.");

      await addDoc(collection(db, "exercise_recommendations"), {
        userId: user.uid,
        bodyPart,
        recommendedExercise: exercise,
        timestamp: Timestamp.now(),
      });

      Alert.alert("운동 추천 완료", `${bodyPart}에 좋은 운동: ${exercise}`);
    } catch (error) {
      console.error("운동 데이터 저장 실패:", error);
      Alert.alert("운동 데이터 저장 실패",);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🦾 취약한 신체 부위를 선택하세요</Text>

      {Object.keys(exercises).map((bodyPart) => (
        <TouchableOpacity
          key={bodyPart}
          style={styles.button}
          onPress={() => handleRecommendation(bodyPart as keyof typeof exercises)}
        >
          <Text style={styles.buttonText}>{bodyPart}</Text>
        </TouchableOpacity>
      ))}

      {loading && <ActivityIndicator size="large" color="#007AFF" />}
      {recommendedExercise && (
        <Text style={styles.resultText}>추천 운동: {recommendedExercise} 🏋️</Text>
      )}

      {/* ✅ "자세 교정하러 가기" 버튼 추가 */}
      {recommendedExercise && (
        <TouchableOpacity style={styles.arButton} onPress={() => router.push("/ARGuide")}>
          <Text style={styles.buttonText}>📷 자세 교정하러 가기</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ✅ 스타일 정의
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  arButton: {
    backgroundColor: "#FF5722",
    padding: 15,
    marginTop: 20,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  resultText: { fontSize: 18, fontWeight: "bold", color: "#333", marginTop: 20 },
});
