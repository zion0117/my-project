import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import { CustomText as Text } from "../components/CustomText";
import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import GoogleSignInButton from "./GoogleSignInButton";
import ChatbotPopup from "./ChatbotPopup";

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const auth = getAuth();
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) setIsModalVisible(false);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    setIsModalVisible(true);
    setLoading(false);
  };

  const handleSkipLogin = () => {
    setIsModalVisible(false);
  };

  const pages = [
    { title: "소셜 네트워킹", path: "/Social", icon: "people", color: "#FFA07A" },
    { title: "근처 활동 추천", path: "/LocationRecommendation", icon: "location", color: "#20B2AA" },
    { title: "운동 추천", path: "/ExerciseRecommendation", icon: "barbell", color: "#9370DB" },
    { title: "건강 뉴스", path: "/HealthLibrary", icon: "newspaper", color: "#6495ED" },
    { title: "복용 알림", path: "/Reminders", icon: "alarm", color: "#FF8C00" },
    { title: "음성 기록", path: "/VoiceLog", icon: "mic", color: "#FF69B4" },
    { title: "데이터 시각화", path: "/Dashboard", icon: "analytics", color: "#4CAF50" },
    { title: "음성 알림", path: "/VoiceReminders", icon: "notifications", color: "#DC143C" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* 로그인 모달 */}
      <Modal animationType="slide" transparent={true} visible={isModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Google 로그인</Text>
            <GoogleSignInButton />
            <TouchableOpacity onPress={handleSkipLogin}>
              <Text style={styles.skipButtonText}>로그인 없이 계속하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ChatbotPopup visible={isChatbotVisible} onClose={() => setIsChatbotVisible(false)} />

      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>🏡 시니어 헬스</Text>
        {user && (
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => router.push("/MyProfile")}>
              <Ionicons name="person-circle-outline" size={28} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              {loading ? (
                <ActivityIndicator size="small" color="gray" />
              ) : (
                <Text style={styles.logoutText}>로그아웃</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {pages.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: item.color + "22" }]}
            onPress={() => router.push(item.path)}
          >
            <Ionicons name={item.icon as any} size={28} color={item.color} style={{ marginRight: 10 }} />
            <Text style={[styles.cardText, { color: item.color }]}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.chatbotLabel}>궁금한 점이 있나요?</Text>
      <TouchableOpacity style={styles.chatbotButton} onPress={() => setIsChatbotVisible(true)}>
        <Ionicons name="chatbubble-ellipses-outline" size={28} color="#005A9E" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FB" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 50, // ✅ 타이틀 위 여백 추가
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    fontFamily: "GmarketSansMedium",
  },

  headerRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  logoutText: { fontSize: 14, color: "gray", marginLeft: 10 },

  scrollContainer: { paddingHorizontal: 16, paddingBottom: 100 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    shadowColor: "#aaa",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "GmarketSansMedium",
  },

  chatbotLabel: {
    position: "absolute",
    bottom: 85,
    right: 20,
    fontSize: 13,
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 6,
    borderRadius: 8,
    color: "#555",
    fontFamily: "GmarketSansMedium",
  },
  chatbotButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#D6EBFF",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    width: "80%",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    fontFamily: "GmarketSansMedium",
  },
  skipButtonText: {
    color: "#888",
    marginTop: 10,
    fontFamily: "GmarketSansMedium",
  },
});

export default HomeScreen;
