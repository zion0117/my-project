import React, { useState, useEffect, useRef } from "react";
import { View, Modal, TouchableOpacity, TextInput, StyleSheet, FlatList, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { CustomText as Text } from "../components/CustomText";
import { Ionicons } from "@expo/vector-icons";
import OpenAI from 'openai';

const db = getFirestore();
const auth = getAuth();

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: 'YOUR_OPENAI_API_KEY', // 실제 API 키로 교체 필요
  dangerouslyAllowBrowser: true // React Native 환경에서 허용
});

export default function ChatbotPopup({ visible, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  // 메시지 추가 시 스크롤 자동 이동
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    
    // 사용자 메시지 추가
    const userMessage = { 
      id: Date.now().toString(), 
      text: inputText, 
      sender: "user" 
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    
    try {
      // Firebase에 메시지 저장
      const user = auth.currentUser;
      if (!user) throw new Error("로그인이 필요합니다.");

      await addDoc(collection(db, "chatbot_logs"), {
        userId: user.uid,
        message: inputText,
        timestamp: Timestamp.now(),
      });

      // 챗봇 응답 처리
      setLoading(true);
      setIsTyping(true);
      handleBotResponse(inputText);
    } catch (error) {
      console.error("메시지 저장 실패:", error);
      Alert.alert("오류 발생", "메시지를 저장할 수 없습니다.");
    }
  };

  const handleBotResponse = async (userInput) => {
    try {
      // OpenAI API 호출
      const stream = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { 
            role: 'system', 
            content: `당신은 전문 운동 트레이너이자 영양사입니다. 
                      사용자의 운동 관련 질문에 전문적인 조언을 제공해주세요. 
                      답변은 한국어로 작성해주세요.` 
          },
          { role: 'user', content: userInput }
        ],
        stream: true,
        max_tokens: 500,
        temperature: 0.7,
      });

      // 챗봇 메시지 초기화
      const botMessageId = Date.now().toString() + '-bot';
      setMessages(prev => [...prev, { 
        id: botMessageId, 
        text: "", 
        sender: "bot" 
      }]);

      // 스트리밍 응답 처리
      let fullResponse = '';
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        fullResponse += content;
        
        // 메시지 실시간 업데이트
        setMessages(prev => prev.map(msg => 
          msg.id === botMessageId ? { ...msg, text: fullResponse } : msg
        ));
      }
    } catch (error) {
      console.error('OpenAI API 오류:', error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        text: "죄송합니다. 문제가 발생했습니다. 다시 시도해주세요.", 
        sender: "bot" 
      }]);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.chatContainer}>
          {/* 닫기 버튼 */}
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <Ionicons name="close" size={26} color="#bbb" />
          </TouchableOpacity>
          
          {/* 타이틀 */}
          <Text style={styles.title}>🏋️ 운동 챗봇</Text>
          
          {/* 메시지 리스트 */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageRow,
                  item.sender === "user" ? styles.rowRight : styles.rowLeft,
                ]}
              >
                {item.sender === "bot" && (
                  <Ionicons name="chatbubble-ellipses" size={22} color="#007AFF" style={{ marginRight: 6 }} />
                )}
                <View
                  style={[
                    styles.messageBubble,
                    item.sender === "user" ? styles.userBubble : styles.botBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      item.sender === "bot" && styles.botMessageText,
                    ]}
                  >
                    {item.text}
                  </Text>
                </View>
                {item.sender === "user" && (
                  <Ionicons name="person-circle" size={22} color="#007AFF" style={{ marginLeft: 6 }} />
                )}
              </View>
            )}
            contentContainerStyle={{ paddingVertical: 8 }}
          />
          
          {/* 입력창 및 상태 표시 */}
          <View style={styles.inputContainer}>
            {isTyping && (
              <View style={styles.typingIndicator}>
                <Text style={styles.typingText}>챗봇이 답변을 작성 중입니다...</Text>
              </View>
            )}
            
            <TextInput
              style={styles.input}
              placeholder="운동 관련 질문을 입력하세요..."
              value={inputText}
              onChangeText={setInputText}
              placeholderTextColor="#bbb"
              editable={!loading}
              returnKeyType="send"
              onSubmitEditing={sendMessage}
              multiline
            />
            
            <TouchableOpacity
              style={styles.sendButton}
              onPress={sendMessage}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Ionicons name={loading ? "time-outline" : "send"} size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.33)",
    justifyContent: "center",
    alignItems: "center",
  },
  chatContainer: {
    width: "88%",
    height: "70%",
    backgroundColor: "#F6F8FB",
    padding: 0,
    borderRadius: 22,
    elevation: 10,
    shadowColor: "#007AFF",
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    overflow: "hidden",
  },
  closeIcon: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 2,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 24,
    marginBottom: 10,
    color: "#007AFF",
    fontFamily: "GmarketSansMedium",
    letterSpacing: 0.1,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginHorizontal: 12,
    marginVertical: 2,
    maxWidth: "95%",
  },
  rowRight: {
    justifyContent: "flex-end",
    alignSelf: "flex-end",
  },
  rowLeft: {
    justifyContent: "flex-start",
    alignSelf: "flex-start",
  },
  messageBubble: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 16,
    maxWidth: "82%",
    minWidth: 32,
  },
  userBubble: {
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#E0E6F3",
  },
  messageText: {
    fontSize: 15,
    fontFamily: "GmarketSansMedium",
    color: "#fff",
    lineHeight: 21,
  },
  botMessageText: {
    color: "#222",
  },
  inputContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#e0e6f3",
  },
  typingIndicator: {
    backgroundColor: "#f0f4ff",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  typingText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  input: {
    fontSize: 15,
    fontFamily: "GmarketSansMedium",
    backgroundColor: "#f3f5fa",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    color: "#222",
    minHeight: 40,
    maxHeight: 120,
  },
  sendButton: {
    position: "absolute",
    right: 20,
    bottom: 18,
    backgroundColor: "#007AFF",
    borderRadius: 22,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
});
