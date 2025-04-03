import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import GoogleSignInButton from "./GoogleSignInButton";
import ChatbotPopup from "./ChatbotPopup"; // ✅ 챗봇 팝업 import
import { Ionicons } from "@expo/vector-icons"; // ✅ 아이콘 추가

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const auth = getAuth();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(true);
  const [isChatbotVisible, setIsChatbotVisible] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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

  const pages: { title: string; path: string; label: string }[] = [
    { title: "소셜 네트워킹", path: "/Social", label: "그룹 만들기" },
    { title: "근처 활동 추천", path: "/LocationRecommendation", label: "어디서 운동하지??" },
    { title: "운동추천 및 자세교정", path: "/ExerciseRecommendation", label: "운동 추천 받기" },
    { title: "건강 정보 라이브러리", path: "/HealthLibrary", label: "오늘의 건강정보" },
    { title: "알림 및 리마인더", path: "/Reminders", label: "약 복용 알림 설정" },
    { title: "음성 건강 기록", path: "/VoiceLog", label: "음성으로 기록 추가" },
    { title: "실시간 데이터 시각화", path: "/Dashboard", label: "대시보드 보기" },
    
    { title: "음성 알림 시스템", path: "/VoiceReminders", label: "알림 설정" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* 로그인 모달 */}
      <Modal animationType="slide" transparent={true} visible={isModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Google 로그인</Text>
            <GoogleSignInButton />
            <TouchableOpacity style={styles.skipButton} onPress={handleSkipLogin}>
              <Text style={styles.skipButtonText}>로그인하지 않기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 챗봇 팝업 */}
      <ChatbotPopup visible={isChatbotVisible} onClose={() => setIsChatbotVisible(false)} />

      {/* 상세 탭 */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>시니어 헬스 커뮤니티</Text>
          {user && (
            <TouchableOpacity onPress={handleLogout}>
              {loading ? <ActivityIndicator size="small" color="red" /> : <Text style={styles.logoutButton}>로그아웃</Text>}
            </TouchableOpacity>
          )}
        </View>

        {pages.map((item, index) => (
          <View style={styles.section} key={index}>
            <Text style={styles.sectionTitle}>{item.title}</Text>
            <TouchableOpacity style={styles.button} onPress={() => router.push(item.path as any)}>
              <Text style={styles.buttonText}>{item.label}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* ✅ 챗봇 버튼 안내 텍스트 */}
      <Text style={styles.chatbotText}>❓ 질문이 있으면 클릭해 주세요!</Text>

      {/* ✅ 플로팅 챗봇 버튼 */}
      <TouchableOpacity style={styles.chatbotButton} onPress={() => setIsChatbotVisible(true)}>
        <Ionicons name="chatbubble-ellipses" size={32} color="#005A9E" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f2f5" },
  scrollContainer: { padding: 16 },
  header: { alignItems: "center", marginBottom: 24 },
  title: { fontSize: 28, fontWeight: "bold", color: "#1877f2" },
  logoutButton: { color: "red", fontSize: 16, marginTop: 10, textDecorationLine: "underline" },
  section: { backgroundColor: "#ffffff", padding: 16, borderRadius: 8, marginBottom: 16, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12, color: "#1c1e21" },
  button: { backgroundColor: "#1877f2", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 6, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalContent: { backgroundColor: "white", padding: 20, width: "80%", borderRadius: 10, alignItems: "center" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  skipButton: { marginTop: 10, padding: 10 },
  skipButtonText: { color: "#606770", fontSize: 16, textDecorationLine: "underline" },

  // ✅ 챗봇 안내 텍스트 스타일
  chatbotText: {
    position: "absolute",
    bottom: 90,
    right: 30,
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 8,
    borderRadius: 10,
  },

  // ✅ 챗봇 플로팅 버튼 스타일
  chatbotButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#AAD4FF", // 💬 연한 파란색
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default HomeScreen;
