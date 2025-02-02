import React, { useState } from 'react';
import { SafeAreaView, Text, Button, Alert } from 'react-native';
import { Audio } from 'expo-av';

export default function CommunityScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync(); // 마이크 권한 요청
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      setIsRecording(true);

      // 녹음 중지 및 API 호출
      setTimeout(async () => {
        await recording.stopAndUnloadAsync();
        setIsRecording(false);

        const uri = recording.getURI(); // 녹음 파일 URI
        if (uri) {
          const text = await transcribeAudio(uri); // Google API로 전송
          setRecognizedText(text);
          saveExerciseRecord(text);
        }
      }, 5000); // 5초 후 자동 중지 (테스트용)
    } catch (error) {
      console.error('녹음 중 오류 발생:', error);
    }
  };

  const transcribeAudio = async (uri) => {
    const apiKey = 'YOUR_GOOGLE_API_KEY'; // Google API 키
    const apiUrl = `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`;

    const audioBlob = await fetch(uri).then((res) => res.blob());
    const audioBase64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(audioBlob);
    });

    const requestBody = {
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: 'ko-KR', // 한국어 설정
      },
      audio: {
        content: audioBase64,
      },
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      return data.results[0].alternatives[0].transcript;
    } catch (error) {
      console.error('음성 인식 중 오류 발생:', error);
      return '';
    }
  };

  const saveExerciseRecord = (text) => {
    Alert.alert('운동 기록 저장', `"${text}"가 기록되었습니다.`);
  };

  return (
    <SafeAreaView>
      <Text>음성기록하기</Text>
      <Text>인식된 텍스트: {recognizedText}</Text>
      {isRecording ? (
        <Text>녹음 중...</Text>
      ) : (
        <Button title="음성 녹음 시작" onPress={startRecording} />
      )}
    </SafeAreaView>
  );
}
