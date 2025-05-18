// ModernizedDashboard.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { getAuth } from "firebase/auth";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import HomeButton from "../../components/HomeButton";
import * as Font from "expo-font";

const getFeedback = (score: number) => {
  if (score >= 90) return "✅ 자세 정렬과 근육 활성도가 매우 우수합니다. 견갑골 안정성과 코어 조절이 잘 유지되었습니다.";
  if (score >= 70) return "🙂 정렬은 양호하지만, 코어 활성화 유지가 일관되지 않습니다. 호흡과 복횡근 수축을 함께 훈련해보세요.";
  return "❗ 자세 흔들림과 정렬 이탈이 반복되고 있습니다. 골반 위치와 요추 곡선을 중점적으로 재훈련하세요.";
};

const getSummary = (score: number, reps: number, duration: number) => {
  if (score < 50) return "정렬 정확도와 안정성 모두 부족하여 운동 효과가 제한됩니다. 기초적인 자세 정렬 훈련이 선행되어야 합니다.";
  if (reps < 3) return "반복 횟수가 적어 근지구력 발달이 부족합니다. 3~5회 이상을 목표로 꾸준히 반복해보세요.";
  if (duration < 10) return "운동 유지 시간이 짧습니다. 정렬 유지를 위한 중간 강도의 유지 훈련이 필요합니다.";
  if (score >= 90 && reps >= 5 && duration >= 30) return "정렬, 반복, 시간 유지 모두 훌륭합니다. 체계적인 훈련이 잘 유지되고 있습니다. 현재 루틴을 지속하세요!";
  return "정렬 수준은 적절하며 반복과 유지 시간이 개선되고 있습니다. 다음 단계로 진입할 준비가 되어 있습니다 💪";
};

const getTotalComment = (score: number, reps: number, duration: number) => {
  const comments = [];

  if (score >= 90) comments.push("정렬 정확도 매우 높음");
  else if (score >= 70) comments.push("정렬 안정성 중간 수준");
  else comments.push("정렬 불안정, 자세 재교육 필요");

  if (reps >= 5) comments.push("반복 지속력 우수");
  else if (reps >= 3) comments.push("반복력 개선 중");
  else comments.push("근지구력 훈련 필요");

  if (duration >= 30) comments.push("유지 시간 충분함");
  else if (duration >= 15) comments.push("유지 시간 보통");
  else comments.push("유지 시간 부족함");

  return comments.join(" / ");
};

const Dashboard = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        GmarketSans: require("../../assets/fonts/GmarketSansTTFMedium.ttf"),
      });
      setFontsLoaded(true);
    };

    const fetchResults = async () => {
      const user = getAuth().currentUser;
      if (!user) return;

      try {
        const q = query(
          collection(db, "exercise_results"),
          where("userId", "==", user.uid),
          orderBy("timestamp", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => {
          const d = doc.data();
          const actual = d.data ? d.data : d;
          return {
            ...actual,
            timestamp: actual.timestamp?.toDate
              ? actual.timestamp.toDate()
              : new Date(actual.timestamp),
          };
        });

        // score 평균으로 변환
        const averaged = data.map((item) => {
          if (Array.isArray(item.score)) {
            const validScores = item.score.filter((s: any) => typeof s === "number");
            const avg = validScores.length > 0 ? Math.round(validScores.reduce((a: number, b: number) => a + b, 0) / validScores.length) : 0;
            return { ...item, score: avg };
          }
          return item;
        });

        setResults(averaged);
      } catch (err) {
        console.error("운동 결과 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFonts();
    fetchResults();
  }, []);

  if (!fontsLoaded) return null;

  if (loading) {
    return (
      <View style={styles.center}>
        <HomeButton />
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#007AFF" />
      </View>
    );
  }

  if (results.length === 0) {
    return (
      <View style={styles.center}>
        <HomeButton />
        <Text style={styles.noData}>아직 저장된 운동 결과가 없어요!</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f0f4f8" }}>
      <HomeButton />
      <FlatList
        data={results}
        keyExtractor={(item, index) => `${item.exercise}-${index}`}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.date}>
              🗓 {item.timestamp instanceof Date ? item.timestamp.toLocaleDateString("ko-KR") : "날짜 없음"}
            </Text>
            <Text style={styles.title}>{item.exercise}</Text>
            <Text style={styles.text}>✅ 점수: {item.score}점</Text>
            <Text style={styles.text}>🔁 반복: {item.reps || 0}회</Text>
            <Text style={styles.text}>⏱ 시간: {item.duration || 0}초</Text>
            <Text style={styles.feedback}>📣 {getFeedback(item.score)}</Text>
            <Text style={styles.summary}>📝 {getSummary(item.score, item.reps || 0, item.duration || 0)}</Text>
            <Text style={styles.total}>🧾 총평: {getTotalComment(item.score, item.reps || 0, item.duration || 0)}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  noData: { fontSize: 18, color: "#666", fontFamily: "GmarketSans" },
  listContainer: { padding: 16 },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e6ecf0",
  },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 4, fontFamily: "GmarketSans" },
  date: { fontSize: 14, color: "#888", marginBottom: 6, fontFamily: "GmarketSans" },
  text: { fontSize: 16, marginVertical: 2, fontFamily: "GmarketSans" },
  feedback: { fontSize: 16, color: "#007AFF", marginTop: 8, fontWeight: "500", fontFamily: "GmarketSans" },
  summary: { fontSize: 15, marginTop: 6, color: "#333", fontStyle: "italic", fontFamily: "GmarketSans" },
  total: { fontSize: 14, color: "#444", marginTop: 4, fontWeight: "600", fontFamily: "GmarketSans" },
});

export default Dashboard;
