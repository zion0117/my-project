// app/(tabs)/health-tips.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function HealthTips() {
  const [mood, setMood] = useState('');
  const [tip, setTip] = useState('');
  const [loading, setLoading] = useState(false);

  const getHealthTip = async () => {
    if (!mood.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: mood })
      });
      const data = await response.json();
      if (data.error) {
        setTip('건강 팁을 가져오는 중 오류가 발생했습니다.');
      } else {
        setTip(data.tip);
      }
    } catch (error) {
      console.error(error);
      setTip('건강 팁을 가져오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>감정 기반 건강 팁</Text>
      <TextInput
        style={styles.input}
        placeholder="현재 기분을 입력하세요 (예: 행복, 스트레스)"
        placeholderTextColor="#ccc"
        value={mood}
        onChangeText={setMood}
      />
      <Button title={loading ? "로딩 중..." : "건강 팁 받기"} onPress={getHealthTip} />
      {tip !== '' && <Text style={styles.tip}>{tip}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',  // 검정 배경
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
    color: '#fff',  // 흰색 텍스트
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 12,
    color: '#fff',  // 입력 텍스트 흰색
  },
  tip: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',  // 흰색 텍스트
  }
});
