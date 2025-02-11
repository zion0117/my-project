import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, Button, View } from 'react-native';
import axios from 'axios';

const API_URL = "http://172.30.1.87:5000/analyze";  

export default function ChatbotScreen() {
    const [inputText, setInputText] = useState("");
    const [response, setResponse] = useState("");

    // 감정 분석 API 요청 함수
    const analyzeSentiment = async () => {
        try {
            const res = await axios.post(API_URL, { text: inputText });
            setResponse(res.data.tip);  // 받은 건강 팁 표시
        } catch (error) {
            setResponse("서버와 연결할 수 없습니다. 다시 시도해주세요.");
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>감정 분석 챗봇</Text>
            
            <TextInput
                style={{
                    width: 300,
                    height: 40,
                    borderColor: 'gray',
                    borderWidth: 1,
                    paddingHorizontal: 10,
                    marginBottom: 10
                }}
                placeholder="감정을 입력하세요..."
                value={inputText}
                onChangeText={setInputText}
            />
            
            <Button title="분석하기" onPress={analyzeSentiment} />

            {response ? (
                <View style={{ marginTop: 20, padding: 10, backgroundColor: "#f0f0f0", borderRadius: 5 }}>
                    <Text style={{ fontSize: 16 }}>{response}</Text>
                </View>
            ) : null}
        </SafeAreaView>
    );
}

