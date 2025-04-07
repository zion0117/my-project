import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { WebView } from "react-native-webview";
import { getAuth } from "firebase/auth";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig"; // 🔁 너의 firebase 설정 경로로 맞춰줘
import { CustomText } from "../../components/CustomText";

const ARGuide = () => {
  const [recommendedExercises, setRecommendedExercises] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);
  const user = getAuth().currentUser;

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "exercise_recommendations"),
          where("userId", "==", user.uid),
          orderBy("timestamp", "desc"),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setRecommendedExercises(data.recommendedExercises || {});
        }
      } catch (err) {
        console.error("추천 운동 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const getExerciseList = () => {
    if (!recommendedExercises) return "추천된 운동이 없습니다.";
    return Object.entries(recommendedExercises)
      .map(([part, exercise]) => `• ${part}: ${exercise}`)
      .join("\n");
  };

  const getARGuideURL = () => {
    // 실제로는 이 URL을 동적으로 구성하거나, 부위별로 구분 가능
    return "posecorrector.netlify.app"; // ✅ MediaPipe가 포함된 AR HTML 페이지
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>📸 추천 운동 기반 자세 교정</CustomText>
      <CustomText style={styles.subtitle}>{getExerciseList()}</CustomText>

      <WebView
        source={{ uri: getARGuideURL() }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
    textAlign: "center",
    color: "#222",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 10,
    paddingHorizontal: 16,
    textAlign: "center",
    color: "#666",
  },
  webview: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 12,
    overflow: "hidden",
  },
});

export default ARGuide;
