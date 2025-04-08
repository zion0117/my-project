import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { getAuth } from "firebase/auth";
import { collection, query, where, orderBy, limit, getDocs, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { CustomText } from "../../components/CustomText";

const ARGuide = () => {
  const [recommendedExercises, setRecommendedExercises] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [webUrl, setWebUrl] = useState<string>("");

  const user = getAuth().currentUser;

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // ✅ Firestore에서 운동 추천 데이터 가져오기
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

        // ✅ HTML에 넘겨줄 URL 생성 (token 제거됨)
        const exerciseQuery = encodeURIComponent(JSON.stringify(exercises));
        const url = `https://posecorrector.netlify.app/index.html?exercises=${exerciseQuery}`;
        setWebUrl(url);
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ WebView로부터 운동 결과 메시지 받기 → Firebase 저장
  const handleWebMessage = async (event: any) => {
    try {
      const result = JSON.parse(event.nativeEvent.data);
      if (!user) throw new Error("인증된 사용자가 없습니다.");

      await addDoc(collection(db, "exercise_results"), {
        userId: user.uid,
        ...result,
        savedAt: new Date(),
      });

      Alert.alert("✅ 결과 저장 완료", "운동 결과가 저장되었습니다.");
      console.log("🔥 저장된 결과:", result);
    } catch (err) {
      console.error("❌ 저장 실패:", err);
      Alert.alert("❌ 저장 실패", "운동 결과 저장에 실패했습니다.");
    }
  };

  const getExerciseList = () => {
    if (!recommendedExercises) return "추천된 운동이 없습니다.";
    return Object.entries(recommendedExercises)
      .map(([part, exercise]) => `• ${part}: ${exercise}`)
      .join("\n");
  };

  if (loading || !webUrl) {
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
        onMessage={handleWebMessage} // ✅ WebView 메시지 수신
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
