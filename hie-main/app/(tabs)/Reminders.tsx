// 개발 빌드용 코드

import React, { useState } from "react";
import { View, Text, Button, Alert, Platform, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";

// 알림 처리 설정 (알림을 받았을 때 앱에서 어떻게 반응할지)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function MedicineReminder() {
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleSetReminder = async () => {
    // 1️⃣ 알림 권한 요청
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("알림 권한이 필요합니다.");
      return;
    }

    // 2️⃣ 알림 시간 설정
    const now = new Date();
    const scheduledTime = new Date(now);
    scheduledTime.setHours(time.getHours());
    scheduledTime.setMinutes(time.getMinutes());
    scheduledTime.setSeconds(0);

    // 현재 시간보다 이전이면 다음 날로 예약
    if (scheduledTime <= now) {
      scheduledTime.setDate(now.getDate() + 1);
    }

    // 3️⃣ 알림 예약
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "💊 약 복용 시간입니다!",
        body: "지금 약을 드셔야 해요!",
        sound: "default",
      },
      trigger: scheduledTime,
    });

    Alert.alert("✅ 알림 예약 완료", `${scheduledTime.toLocaleTimeString()}에 울립니다.`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>약 복용 알림 설정</Text>
      <Button title="시간 선택" onPress={() => setShowPicker(true)} />
      <Text style={styles.timeText}>선택된 시간: {time.toLocaleTimeString()}</Text>

      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, selectedTime) => {
            setShowPicker(false);
            if (selectedTime) setTime(selectedTime);
          }}
        />
      )}

      <Button title="💊 알림 예약하기" onPress={handleSetReminder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  timeText: { fontSize: 18, textAlign: "center", marginVertical: 10 },
});

//expo go test ver
/*
import React, { useState } from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import * as Notifications from "expo-notifications";

export default function MedicineReminderLite() {
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(0);

  const scheduleTestNotification = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("알림 권한 필요");
      return;
    }

    const now = new Date();
    const alarmTime = new Date();
    alarmTime.setHours(hour);
    alarmTime.setMinutes(minute);
    alarmTime.setSeconds(0);

    if (alarmTime <= now) {
      alarmTime.setDate(now.getDate() + 1);
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "💊 약 복용 시간입니다!",
        body: "설정한 시간에 울리는지 확인해보세요.",
        sound: "default",
      },
      trigger: alarmTime,
    });

    Alert.alert("✅ 예약됨", `${alarmTime.toLocaleTimeString()}에 알림 예정`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>임시 알림 테스트 (Expo Go 가능)</Text>
      <Text style={styles.time}>{`선택 시간: ${hour}시 ${minute}분`}</Text>

      <Button title="시간 +1시간" onPress={() => setHour((prev) => (prev + 1) % 24)} />
      <Button title="분 +10분" onPress={() => setMinute((prev) => (prev + 10) % 60)} />

      <View style={{ marginTop: 20 }}>
        <Button title="알림 예약하기" onPress={scheduleTestNotification} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 20, textAlign: "center", marginBottom: 20 },
  time: { fontSize: 18, textAlign: "center", marginBottom: 10 },
});
*/