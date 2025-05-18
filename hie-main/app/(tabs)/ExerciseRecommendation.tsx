import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { getAuth } from "firebase/auth";
import { CustomText as Text } from "../../components/CustomText";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const exercises: Record<string, string[]> = {
  허리: ["플랭크"],
  무릎: ["스쿼트"],
  어깨: ["숄더 프레스"],
  팔: ["컬"],
  등: ["랫풀다운"],
  복부: ["크런치"],
  엉덩이: ["힙 브릿지"],
  종아리: ["카프레이즈"],
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
  container: {
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "GmarketSansMedium",
    marginBottom: 20,
    textAlign: "center",
  },
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
    fontFamily: "GmarketSansMedium",
  },
  selectedText: {
    color: "#fff",
    fontFamily: "GmarketSansMedium",
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
    fontFamily: "GmarketSansMedium",
  },
recommendationBox: {
  width: "90%",
  backgroundColor: "#fff", // ✨ 흰 배경
  padding: 24,
  borderRadius: 16,
  alignItems: "center",
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
  elevation: 5,
},
recommendTitle: {
  fontSize: 20,
  fontWeight: "bold",
  fontFamily: "GmarketSansMedium",
  marginBottom: 14,
  color: "#007AFF",
},
exerciseText: {
  fontSize: 16,
  fontWeight: "600",
  fontFamily: "GmarketSansMedium",
  color: "#333",
  marginBottom: 6,
},

});
