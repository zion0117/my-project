import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function VoiceReminders() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>음성 알림 시스템 페이지</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#f0f2f5" },
  text: { fontSize: 24, fontWeight: 'bold', color: "#333" }
});
