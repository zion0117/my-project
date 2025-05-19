// 개발 빌드용 코드

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  Platform,
  StyleSheet,
  BackHandler,
  FlatList,
  TextInput,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";

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
  const [takenList, setTakenList] = useState<{ id: number; time: string; name: string }[]>([]);
  const [medicineName, setMedicineName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      router.replace("/");
      return true;
    });
    return () => backHandler.remove();
  }, []);

  const handleSetReminder = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("알림 권한이 필요합니다.");
      return;
    }

    const now = new Date();
    const scheduledTime = new Date(now);
    scheduledTime.setHours(time.getHours());
    scheduledTime.setMinutes(time.getMinutes());
    scheduledTime.setSeconds(0);

    if (scheduledTime <= now) {
      scheduledTime.setDate(now.getDate() + 1);
    }

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

  const handleTakeMedicine = () => {
    if (!medicineName.trim()) {
      Alert.alert("복용한 약 이름을 입력해주세요.");
      return;
    }
    const now = new Date();
    setTakenList((prev) => [
      { id: Date.now(), time: now.toLocaleTimeString(), name: medicineName.trim() },
      ...prev,
    ]);
    setMedicineName("");
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

      <View style={{ marginTop: 30 }}>
        <TextInput
          style={styles.input}
          placeholder="복용한 약 이름 입력"
          value={medicineName}
          onChangeText={setMedicineName}
        />
        <Button title="✅ 약 먹었어요!" onPress={handleTakeMedicine} />
        <Text style={styles.historyTitle}>📋 복용 기록</Text>
        <FlatList
          data={takenList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.recordItem}>
              <Text style={styles.recordText}>복용 시간: {item.time}</Text>
              <Text style={styles.recordText}>복용 약: {item.name}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>기록 없음</Text>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  timeText: { fontSize: 18, textAlign: "center", marginVertical: 10 },
  historyTitle: { fontSize: 20, fontWeight: "600", marginTop: 30, marginBottom: 10, textAlign: "center" },
  recordItem: { padding: 10, backgroundColor: "#f0f0f0", marginBottom: 8, borderRadius: 8 },
  recordText: { fontSize: 16 },
  emptyText: { fontSize: 16, color: "#888", textAlign: "center", marginTop: 10 },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
});
