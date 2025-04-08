import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { getAuth } from "firebase/auth";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

const getFeedback = (score: number) => {
  if (score >= 90) return "✅ 자세 아주 좋음!";
  if (score >= 70) return "🙂 괜찮아요. 조금만 더!";
  return "❗ 자세 개선이 필요해요!";
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
        const data = snapshot.docs.map(doc => doc.data());
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
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#007AFF" />;
  }

  if (results.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.noData}>아직 저장된 운동 결과가 없어요!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={results}
      keyExtractor={(item, index) => `${item.exercise}-${index}`}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.date}>
            🗓 {new Date(item.timestamp).toLocaleDateString("ko-KR")}
          </Text>
          <Text style={styles.title}>{item.exercise}</Text>
          <Text style={styles.text}>
            ✅ 점수: {item.score}점 | 🔁 반복: {item.reps || 0}회 | ⏱ 시간: {item.duration || 0}초
          </Text>
          <Text style={styles.feedback}>📣 {getFeedback(item.score)}</Text>
        </View>
      )}
    />
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
});

export default Dashboard;
