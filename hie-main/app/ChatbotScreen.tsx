import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import ChatbotPopup from "./ChatbotPopup"; // 챗봇 팝업 import
import { CustomText as Text } from "../components/CustomText";

export default function ChatbotScreen() {
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.openButton}
        activeOpacity={0.85}
        onPress={() => setIsChatbotVisible(true)}
      >
        <Text style={styles.buttonText}>💬 챗봇 열기</Text>
      </TouchableOpacity>
      <ChatbotPopup visible={isChatbotVisible} onClose={() => setIsChatbotVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FB",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  openButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 18,
    paddingHorizontal: 44,
    borderRadius: 24,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.17,
    shadowRadius: 18,
    elevation: 5,
    marginBottom: 18,
  },
  buttonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "GmarketSansMedium",
    letterSpacing: 0.5,
  },
});
