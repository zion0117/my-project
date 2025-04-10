import React from "react";
import { View, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebaseConfig"; // 🔁 너의 Firebase 설정 경로에 맞게 조정

export default function PlankWebView() {
  const router = useRouter();

  const handleMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      // ✅ 대시보드로 이동 요청 처리
      if (data.type === "navigate" && data.target === "Dashboard") {
        router.push("/Dashboard");
        return;
      }

      // ✅ Firebase 유저 확인
      const user = getAuth().currentUser;
      if (!user) {
        Alert.alert("저장 실패", "로그인이 필요합니다.");
        return;
      }

      const { exercise, score, reps, duration, timestamp } = data;

      // ✅ timestamp는 ISO 문자열이어야 함
      const parsedTimestamp = new Date(timestamp);
      if (!timestamp || isNaN(parsedTimestamp.getTime())) {
        console.warn("❌ 유효하지 않은 timestamp:", timestamp);
        return;
      }

      // 🔍 로그로 확인
      console.log("🕒 받은 timestamp (string):", timestamp);
      console.log("📅 변환된 Date 객체:", parsedTimestamp);

      // ✅ Firestore에 저장
      await addDoc(collection(db, "exercise_results"), {
        userId: user.uid,
        exercise,
        score,
        reps,
        duration,
        timestamp: parsedTimestamp,      // 🔥 변환된 JS Date 객체
        savedAt: Timestamp.now(),        // 🔥 저장 시각은 서버 기준
      });

      console.log("✅ 운동 결과 저장 성공:", {
        exercise,
        score,
        reps,
        duration,
        timestamp,
      });
    } catch (err) {
      console.error("🔥 저장 실패:", err);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: "https://posecorrector.netlify.app/plank.html" }}
        onMessage={handleMessage}
        javaScriptEnabled
        originWhitelist={["*"]}
      />
    </View>
  );
}
