import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import ChatbotPopup from "./ChatbotPopup"; // 챗봇 팝업 import

export default function ChatbotScreen() {
  const [isChatbotVisible, setIsChatbotVisible] = useState(false); // 팝업 상태 관리

  return (
    <View style={styles.container}>
      {/* 챗봇 열기 버튼 */}
      <TouchableOpacity style={styles.openButton} onPress={() => setIsChatbotVisible(true)}>
        <Text style={styles.buttonText}>💬 챗봇 열기</Text>
      </TouchableOpacity>

      {/* 챗봇 팝업 컴포넌트 */}
      <ChatbotPopup visible={isChatbotVisible} onClose={() => setIsChatbotVisible(false)} />
    </View>
  );
}

// ✅ 스타일 정의
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  openButton: { backgroundColor: "#007AFF", padding: 15, borderRadius: 10 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
