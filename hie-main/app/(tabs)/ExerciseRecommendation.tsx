import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { getAuth } from "firebase/auth";
import { CustomText as Text } from "../../components/CustomText";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// 부위별 아이콘 매핑
const partIconMap = {
  허리: "body-outline",
  무릎: "walk-outline",
  어깨: "accessibility-outline",
  팔: "barbell-outline",
  등: "fitness-outline",
  복부: "ellipse-outline",
  엉덩이: "female-outline",
  종아리: "footsteps-outline",
};

const exercises = {
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
  const [selectedParts, setSelectedParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const router = useRouter();

  const toggleBodyPart = (part) => {
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
    const result = {};
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
      <Text style={styles.title}>
        💪 운동하고 싶은 부위를{"\n"}선택하세요 (최대 8개)
      </Text>
      <View style={styles.grid}>
        {Object.keys(exercises).map((part) => (
          <TouchableOpacity
            key={part}
            onPress={() => toggleBodyPart(part)}
            style={[
              styles.partButton,
              selectedParts.includes(part) && styles.selectedButton,
            ]}
            activeOpacity={0.85}
          >
            <Ionicons
              name={partIconMap[part]}
              size={24}
              color={selectedParts.includes(part) ? "#fff" : "#007AFF"}
              style={{ marginBottom: 4 }}
            />
            <Text
              style={[
                styles.partText,
                selectedParts.includes(part) && styles.selectedText,
              ]}
            >
              {part}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 36 }} />
      ) : (
        <>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.85}>
            <Text style={styles.submitText}>🏋️‍♀️ 운동 추천 받기</Text>
          </TouchableOpacity>

          {selectedParts.length > 0 && (
            <View style={styles.recommendationBox}>
              <Text style={styles.recommendTitle}>추천 운동</Text>
              {Object.entries(recommendations).map(([part, exercise]) => (
                <Text key={part} style={styles.exerciseText}>
                  <Ionicons name="checkmark-circle" size={17} color="#007AFF" /> {part}: {exercise}
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
    padding: 28,
    backgroundColor: "#F7F8FA",
    alignItems: "center",
    minHeight: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    fontFamily: "GmarketSansBold", // 폰트 없으면 이 줄 삭제!
    color: "#1A237E",
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 36,
    letterSpacing: 0.5,
    textShadowColor: "#B3C6FF",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    // backgroundColor: "#E3E9FF", // 배경 강조 원하면 주석 해제
    // borderRadius: 12,
    // paddingHorizontal: 8,
    // paddingVertical: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 16,
  },
  partButton: {
    backgroundColor: "#fff",
    paddingVertical: 18,
    paddingHorizontal: 22,
    margin: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    shadowColor: "#007AFF",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    alignItems: "center",
    minWidth: 92,
    minHeight: 72,
    justifyContent: "center",
  },
  selectedButton: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  partText: {
    color: "#007AFF",
    fontWeight: "600",
    fontFamily: "GmarketSansMedium",
    fontSize: 16,
    textAlign: "center",
  },
  selectedText: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "GmarketSansMedium",
  },
  submitButton: {
    marginTop: 36,
    backgroundColor: "#FF5722",
    paddingVertical: 16,
    paddingHorizontal: 44,
    borderRadius: 20,
    shadowColor: "#FF5722",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "GmarketSansMedium",
    letterSpacing: 1,
  },
  recommendationBox: {
    width: "97%",
    backgroundColor: "#F0F6FF",
    padding: 28,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    marginTop: 36,
  },
  recommendTitle: {
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "GmarketSansMedium",
    marginBottom: 18,
    color: "#007AFF",
  },
  exerciseText: {
    fontSize: 17,
    fontWeight: "600",
    fontFamily: "GmarketSansMedium",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
});
