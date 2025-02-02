import { SafeAreaView, Text, Button, Alert } from 'react-native';
import * as Speech from 'expo-speech';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

// 알림 설정
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function CommunityScreen() {
  // 권한 요청
  useEffect(() => {
    const requestPermissions = async () => {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
    };
    requestPermissions();
  }, []);

  // 음성 알림 함수
  const speak = (text) => {
    Speech.speak(text, {
      language: 'ko-KR', // 한국어 설정
      rate: 0.9,         // 음성 속도
    });
  };

  // 알림 예약 함수
  const scheduleNotification = async (time, message) => {
    const trigger = new Date(Date.now() + time * 1000); // 초 단위로 입력

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🏥 건강 알림",
        body: message,
        sound: 'default',
      },
      trigger,
    });
  };

  // 테스트 알림 설정
  const setTestReminder = async () => {
    await scheduleNotification(10, '테스트 알림: 물 한 잔 마실 시간이에요!');
    Alert.alert('알림 설정', '10초 후에 테스트 알림이 울립니다');
  };

  // 실제 리마인더 설정 예시 (아침 9시)
  const setMorningReminder = async () => {
    const now = new Date();
    const targetTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      9,  // 시간 (9시)
      0   // 분
    );

    if (now > targetTime) {
      targetTime.setDate(targetTime.getDate() + 1);
    }

    const timeUntilTrigger = targetTime.getTime() - now.getTime();

    await scheduleNotification(timeUntilTrigger / 1000, '아침 약 먹을 시간입니다!');
    speak('매일 아침 9시에 약 복용 알림이 설정되었습니다');
  };

  return (
    <SafeAreaView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>알림 및 리마인더</Text>

      <Button
        title="테스트 알림 설정 (10초 후)"
        onPress={setTestReminder}
        color="#2196F3"
      />

      <Button
        title="아침 약 알림 설정 (매일 9시)"
        onPress={setMorningReminder}
        color="#4CAF50"
        style={{ marginTop: 20 }}
      />

      <Button
        title="지금 음성 테스트"
        onPress={() => speak('지금 물 한 잔 마실 시간이에요!')}
        color="#FF5722"
        style={{ marginTop: 20 }}
      />
    </SafeAreaView>
  );
}
