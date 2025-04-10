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

const getFeedback = (score: number) => {
  if (score >= 90) return "✅ 자세 아주 좋음!";
  if (score >= 70) return "🙂 괜찮아요. 조금만 더!";
  return "❗ 자세 개선이 필요해요!";
};

const getSummary = (score: number, reps: number, duration: number) => {
  if (score < 50) return "자세 교정이 많이 필요해요. 천천히 정확하게 해보세요!";
  if (reps < 3) return "반복 횟수가 적어요. 다음엔 조금 더 유지해보세요!";
  if (duration < 10) return "시간을 더 늘리면 효과가 좋아져요!";
  if (score >= 90 && reps >= 5 && duration >= 30) return "완벽해요! 운동 루틴을 꾸준히 유지하세요!";
  return "자세와 반복 모두 좋아요! 잘하고 있어요 💪";
};

const getTotalComment = (score: number, reps: number, duration: number) => {
  const comments = [];

  if (score >= 90) comments.push("자세 완벽!");
  else if (score >= 70) comments.push("자세 양호");
  else comments.push("자세 개선 필요");

  if (reps >= 5) comments.push("지구력 좋음");
  else if (reps >= 3) comments.push("노력 중");
  else comments.push("더 많은 반복 필요");

  if (duration >= 30) comments.push("충분한 시간 유지");
  else comments.push("시간을 늘려보세요");

  return comments.join(" / ");
};

const Dashboard = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        setResults(data);
      } catch (err) {
        console.error("운동 결과 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1 }}>
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
    <View style={{ flex: 1 }}>
      <HomeButton />
      <FlatList
        data={results}
        keyExtractor={(item, index) => `${item.exercise}-${index}`}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.date}>
              🗓{" "}
              {item.timestamp instanceof Date
                ? item.timestamp.toLocaleDateString("ko-KR")
                : "날짜 없음"}
            </Text>
            <Text style={styles.title}>{item.exercise}</Text>
            <Text style={styles.text}>
              ✅ 점수: {item.score}점 | 🔁 반복: {item.reps || 0}회 | ⏱ 시간: {item.duration || 0}초
            </Text>
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
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  noData: { fontSize: 18, color: "#666" },
  listContainer: { padding: 16 },
  card: {
    backgroundColor: "#f7f9fc",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 4 },
  date: { fontSize: 14, color: "#999" },
  text: { fontSize: 16, marginVertical: 4 },
  feedback: { fontSize: 16, color: "#007AFF", marginTop: 6 },
  summary: {
    fontSize: 15,
    marginTop: 4,
    color: "#333",
    fontStyle: "italic",
  },
  total: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
    fontWeight: "500",
  },
});

export default Dashboard;
