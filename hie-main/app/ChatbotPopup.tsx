import React, { useState } from "react";
import { View, Modal, TouchableOpacity, TextInput, StyleSheet, FlatList, Alert, Dimensions } from "react-native";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { CustomText as Text } from "../components/CustomText";

const db = getFirestore();
const auth = getAuth();

export default function ChatbotPopup({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<{ id: string; text: string; sender: "user" | "bot" }[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    const userMessage = { id: Date.now().toString(), text: inputText, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("로그인이 필요합니다.");

      await addDoc(collection(db, "chatbot_logs"), {
        userId: user.uid,
        message: inputText,
        timestamp: Timestamp.now(),
      });

      setInputText("");
      setLoading(true);
      handleBotResponse(inputText);
    } catch (error) {
      console.error("메시지 저장 실패:", error);
      Alert.alert("오류 발생", "메시지를 저장할 수 없습니다.");
    }
  };

  const handleBotResponse = async (userInput: string) => {
    const lowerInput = userInput.toLowerCase();
    let botReply = "";

    if (lowerInput.includes("허리") && lowerInput.includes("아파")) {
      botReply = `허리 통증이 있을 때 추천되는 운동은 다음과 같습니다:\n\n✅ 고양이-소 자세 (Cat-Cow Stretch)\n✅ 무릎 당기기 (Knee to Chest Stretch)\n✅ 브릿지 운동 (Glute Bridge)\n✅ 누워서 무릎 좌우로 흔들기\n\n또한, 운동 전에는 충분한 스트레칭과, 통증이 심하면 무리하지 않고 휴식을 취하세요.`;
    } else if (lowerInput.includes("영양제") || lowerInput.includes("음식") || lowerInput.includes("먹을") || lowerInput.includes("보충")) {
      botReply = `통증이 있거나 운동 후 회복을 돕기 위한 음식/영양제 추천입니다:\n\n🥦 음식: 연어, 고구마, 바나나, 시금치, 삶은 달걀, 아보카도\n💊 영양제: 오메가3, 마그네슘, 비타민 D, 글루코사민\n\n단, 개인 상태에 따라 섭취 전 전문가 상담을 권장합니다.`;
    } else {
      botReply = "죄송해요! 데모 모드에서는 '허리가 아파' 또는 '음식/영양제 추천' 관련 질문에만 응답해요.";
    }

    setMessages((prev) => [...prev, { id: Date.now().toString(), text: botReply, sender: "bot" }]);
    setLoading(false);
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.chatContainer}>
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>🏋️ 운동 챗봇</Text>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.messageBubble, item.sender === "user" ? styles.userBubble : styles.botBubble]}>
                <Text style={[styles.messageText, item.sender === "bot" && styles.botMessageText]}>{item.text}</Text>
              </View>
            )}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="운동 관련 질문을 입력하세요..."
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={loading}>
              <Text style={styles.sendButtonText}>{loading ? "⏳" : "📩"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  chatContainer: {
    width: "85%",
    height: "70%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 16,
    borderRadius: 14,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: "GmarketSans",
  },
  inputContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontFamily: "GmarketSans",
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "GmarketSans",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  closeButtonText: {
    color: "#555",
    fontSize: 20,
    fontFamily: "GmarketSans",
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "80%",
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
  },
  messageText: {
    fontSize: 16,
    fontFamily: "GmarketSans",
    color: "#fff",
  },
  botMessageText: {
    color: "#000",
  },
});
