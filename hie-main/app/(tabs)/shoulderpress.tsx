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
  Text,
} from "react-native";
import { WebView } from "react-native-webview";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";
const { height, width } = Dimensions.get("window");

export default function ShoulderPress() {
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
        userId: user.uid, exercise, score, reps, duration, timestamp: parsedTimestamp, savedAt: Timestamp.now(),
      });
    } catch (err) { console.error("🔥 저장 실패:", err); }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>숄더 프레스 AR 가이드</Text>
      </View>
      <View style={styles.centerWrapper}>
        <View style={styles.webviewContainer}>
          <WebView
            source={{ uri: "https://posecorrector.netlify.app/shoulder-press.html" }}
            onMessage={handleMessage}
            javaScriptEnabled
            originWhitelist={["*"]}
            style={styles.webview}
            startInLoadingState
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6C5CE7" />
                <Text style={styles.loadingText}>AR 가이드를 불러오는 중...</Text>
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
    backgroundColor: "#181C2B",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingTop: 30,
    paddingBottom: 18,
    alignItems: "center",
    backgroundColor: "#23253a",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
  },
  headerTitle: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  centerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  webviewContainer: {
    width: width * 0.93,
    height: height * 0.68,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#23253a",
    elevation: 8,
    shadowColor: "#6C5CE7",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#23253a",
  },
  loadingText: {
    marginTop: 18,
    color: "#b7b9d1",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
