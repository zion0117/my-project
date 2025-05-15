import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  TextInput,
  FlatList,
  Dimensions,
} from "react-native";
import { CustomText as Text } from "../components/CustomText";
import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import GoogleSignInButton from "./GoogleSignInButton";
import ChatbotPopup from "./ChatbotPopup";

const numColumns = 2;
const screenWidth = Dimensions.get("window").width;
const cardWidth = screenWidth / numColumns - 24;

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const auth = getAuth();
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

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
    { title: "소셜 네트워킹", subtitle: "사람들과 연결되세요", path: "/Social", icon: "people", color: "#FFA07A" },
    { title: "근처 활동 추천", subtitle: "당신 주변의 활동들", path: "/LocationRecommendation", icon: "location", color: "#20B2AA" },
    { title: "운동 추천", subtitle: "건강을 위한 운동", path: "/ExerciseRecommendation", icon: "barbell", color: "#9370DB" },
    { title: "건강 뉴스", subtitle: "최신 건강 소식", path: "/HealthLibrary", icon: "newspaper", color: "#6495ED" },
    { title: "복용 알림", subtitle: "약 복용 시간 관리", path: "/Reminders", icon: "alarm", color: "#FF8C00" },
    { title: "데이터 시각화", subtitle: "운동 결과 보기", path: "/Dashboard", icon: "analytics", color: "#4CAF50" },
    // { title: "음성 알림", subtitle: "음성으로 알림 받기", path: "/VoiceReminders", icon: "notifications", color: "#DC143C" },
  ];

  const filteredPages = pages.filter((item) =>
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );

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

      {/* 챗봇 팝업 */}
      <ChatbotPopup visible={isChatbotVisible} onClose={() => setIsChatbotVisible(false)} />

      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Text style={[styles.title, { fontFamily: "GmarketSansMedium" }]}>시니어 헬스</Text>
        {user && (
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => router.push("/MyProfile")}> 
              <Ionicons name="person-circle-outline" size={35
              } color="#007AFF" />
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

      {/* 검색창 */}
      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="원하는 기능을 검색해보세요"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* 기능 카드 그리드 */}
      <FlatList
        data={filteredPages}
        numColumns={numColumns}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.gridContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { borderColor: "#005A9E", backgroundColor: "#FFFFFF", width: cardWidth }]}
            onPress={() => router.push(item.path)}
          >
            <Ionicons name={item.icon as any} size={30} color={item.color} style={{ marginBottom: 10 }} />
            <Text style={[styles.cardTitle, { color: item.color }]}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
          </TouchableOpacity>
        )}
      />

      {/* 챗봇 버튼 */}
      <TouchableOpacity style={styles.chatbotButton} onPress={() => setIsChatbotVisible(true)}>
        <Ionicons name="chatbubble-ellipses-outline" size={28} color="#005A9E" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // 전체 배경 스타일
  container: { flex: 1, backgroundColor: "#EAF4FF" }, // 연한 파란색 배경

  // 상단 헤더 스타일
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 90,
    paddingBottom: 16,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#222", fontFamily: "GmarketSansMedium" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  logoutText: { fontSize: 14, color: "gray", marginLeft: 10 },

  // 검색창 스타일
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#aaa",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "GmarketSansMedium",
    color: "#333",
  },

  // 기능 카드 그리드 컨테이너
  gridContainer: { paddingHorizontal: 12, paddingBottom: 100 },

  // 개별 카드 스타일
  card: {
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    margin: 6,
    backgroundColor: "#FFFFFF", // 카드 배경: 흰색
    borderWidth: 0,
    borderColor: "#005A9E",     // 카드 테두리: 파란색
    shadowColor: "#aaa",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardTitle: { fontSize: 18, fontWeight: "600", fontFamily: "GmarketSansMedium" },
  cardSubtitle: { fontSize: 14, color: "#555", marginTop: 4, textAlign: "center", fontFamily: "GmarketSansMedium" },

  // 챗봇 버튼 스타일
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

  // 로그인 모달 스타일
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
