import Constants from "expo-constants";
import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, FlatList, Alert } from "react-native";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import axios from "axios";

// ✅ Firebase 연결
const db = getFirestore();
const auth = getAuth();

// ✅ OpenAI API 키 가져오기 (Expo 환경 변수 활용)
const OPENAI_API_KEY = Constants.expoConfig?.extra?.openaiApiKey || "";

// ✅ OpenAI API 응답 타입 정의
interface OpenAIResponse {
  choices: { message: { content: string } }[];
}

export default function ChatbotPopup({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<{ id: string; text: string; sender: "user" | "bot" }[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ 메시지 전송 및 OpenAI 응답 처리
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
      generateBotResponse(inputText);
    } catch (error) {
      console.error("메시지 저장 실패:", error);
      Alert.alert("오류 발생", "메시지를 저장할 수 없습니다.");
    }
  };

  // ✅ OpenAI API 호출
  const generateBotResponse = async (userInput: string) => {
    try {
      const response = await axios.post<OpenAIResponse>(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "system", content: "운동 전문가로서 질문에 답해주세요." }, { role: "user", content: userInput }],
        },
        {
          headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
        }
      );

      // ✅ 응답 데이터를 명확한 타입으로 처리
      const botReply = response.data.choices[0].message.content;
      setMessages((prev) => [...prev, { id: Date.now().toString(), text: botReply, sender: "bot" }]);
    } catch (error) {
      console.error("OpenAI 응답 실패:", error);
      setMessages((prev) => [...prev, { id: Date.now().toString(), text: "❌ 오류 발생. 다시 시도해주세요.", sender: "bot" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.chatContainer}>
          <Text style={styles.title}>🏋️ 운동 챗봇</Text>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.messageBubble, item.sender === "user" ? styles.userBubble : styles.botBubble]}>
                <Text style={styles.messageText}>{item.text}</Text>
              </View>
            )}
          />

          {/* 입력창 및 전송 버튼 */}
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

          {/* 닫기 버튼 */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ✅ 스타일 정의
const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  chatContainer: { width: "90%", backgroundColor: "#fff", padding: 20, borderRadius: 10, elevation: 10 },
  title: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  inputContainer: { flexDirection: "row", marginTop: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 5, padding: 10 },
  sendButton: { marginLeft: 10, padding: 10, backgroundColor: "#007AFF", borderRadius: 5 },
  sendButtonText: { color: "#fff", fontSize: 16 },
  closeButton: { marginTop: 10, alignSelf: "center" },
  closeButtonText: { color: "red", fontSize: 16 },
  messageBubble: { padding: 10, borderRadius: 10, marginVertical: 5, maxWidth: "80%" },
  userBubble: { alignSelf: "flex-end", backgroundColor: "#007AFF" },
  botBubble: { alignSelf: "flex-start", backgroundColor: "#ddd" },
  messageText: { color: "#fff", fontSize: 16 },
});
