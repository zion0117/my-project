// 파일명: Squat.tsx
import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";
const { height, width } = Dimensions.get("window");

export default function Squat() {
  const router = useRouter();

  const handleMessage = async (event) => {
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
      if (!timestamp || isNaN(parsedTimestamp.getTime())) return;
      await addDoc(collection(db, "exercise_results"), {
        userId: user.uid,
        exercise,
        score,
        reps,
        duration,
        timestamp: parsedTimestamp,
        savedAt: Timestamp.now(),
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
            source={{ uri: "https://posecorrector.netlify.app/squat.html" }}
            onMessage={handleMessage}
            javaScriptEnabled
            originWhitelist={["*"]}
            style={styles.webview}
            startInLoadingState
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  centerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  webviewContainer: {
    width: width * 0.92,
    height: height * 0.68,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#e6ecf0",
    elevation: 5,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.11,
    shadowRadius: 12,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e6ecf0",
  },
});
