import React from "react";
import {
  View,
  Alert,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import { WebView } from "react-native-webview";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";

const { height, width } = Dimensions.get("window");

export default function PlankWebView() {
  const router = useRouter();

  const handleMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === "navigate" && data.target === "Dashboard") {
        router.push("/Dashboard");
        return;
      }

      const user = getAuth().currentUser;
      if (!user) {
        Alert.alert("저장 실패", "로그인이 필요합니다.");
        return;
      }

      const { exercise, score, reps, duration, timestamp } = data;

      const parsedTimestamp = new Date(timestamp);
      if (!timestamp || isNaN(parsedTimestamp.getTime())) {
        console.warn("❌ 유효하지 않은 timestamp:", timestamp);
        return;
      }

      console.log("🕒 받은 timestamp (string):", timestamp);
      console.log("📅 변환된 Date 객체:", parsedTimestamp);

      await addDoc(collection(db, "exercise_results"), {
        userId: user.uid,
        exercise,
        score,
        reps,
        duration,
        timestamp: parsedTimestamp,
        savedAt: Timestamp.now(),
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
    <SafeAreaView style={styles.container}>
      <View style={styles.centerWrapper}>
        <View style={styles.webviewContainer}>
          <WebView
            source={{ uri: "https://posecorrector.netlify.app/plank.html" }}
            onMessage={handleMessage}
            javaScriptEnabled
            originWhitelist={["*"]}
            style={styles.webview}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerWrapper: {
    flex: 1,
    justifyContent: "center", // 세로 가운데 정렬
    alignItems: "center",     // 가로 가운데 정렬
  },
  webviewContainer: {
    width: width * 0.9,
    height: height * 0.6,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  webview: {
    flex: 1,
  },
});
