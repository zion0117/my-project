import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { getAuth } from "firebase/auth";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { CustomText } from "../../components/CustomText";

const ARGuide = () => {
  const [recommendedExercises, setRecommendedExercises] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [webUrl, setWebUrl] = useState<string>("");

  const user = getAuth().currentUser;

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const idToken = await user.getIdToken();
        setToken(idToken);

        const q = query(
          collection(db, "exercise_recommendations"),
          where("userId", "==", user.uid),
          orderBy("timestamp", "desc"),
          limit(1)
        );
        const querySnapshot = await getDocs(q);

        let exercises: Record<string, string> = {};
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          exercises = data.recommendedExercises || {};
          setRecommendedExercises(exercises);
        }

        // ✅ 운동 정보와 토큰을 함께 쿼리스트링으로 전달
        const exerciseQuery = encodeURIComponent(JSON.stringify(exercises));
        const url = `https://posecorrector.netlify.app/index.html?token=${idToken}&exercises=${exerciseQuery}`;
        setWebUrl(url);
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getExerciseList = () => {
    if (!recommendedExercises) return "추천된 운동이 없습니다.";
    return Object.entries(recommendedExercises)
      .map(([part, exercise]) => `• ${part}: ${exercise}`)
      .join("\n");
  };

  if (loading || !token || !webUrl) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} color="#007AFF" />;
  }

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>📸 추천 운동 기반 자세 교정</CustomText>
      <CustomText style={styles.subtitle}>{getExerciseList()}</CustomText>

      <WebView
        source={{ uri: webUrl }}
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
