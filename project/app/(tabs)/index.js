import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, StyleSheet, Modal, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from './firebaseConfig';
import { getAuth } from "firebase/auth"; 
import { onAuthStateChanged, signOut } from 'firebase/auth';
import GoogleSignInButton from './GoogleSignInButton'; // Google 로그인 버튼 가져오기


const IndexScreen = () => {
  const router = useRouter();
  const auth = getAuth();
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [user, setUser] = useState(null);

  // 로그인 상태 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) setIsModalVisible(false); // 로그인 상태라면 팝업 닫기
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setIsModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 로그인 모달 */}
      <Modal animationType="slide" transparent={true} visible={isModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Google 로그인</Text>
            <GoogleSignInButton />
          </View>
        </View>
      </Modal>

//상세탭
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>시니어 헬스 커뮤니티</Text>
          {user && <TouchableOpacity onPress={handleLogout}><Text style={styles.logoutButton}>로그아웃</Text></TouchableOpacity>}
        </View>

        {/* 건강 정보 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>오늘의 건강 팁</Text>
          <Text style={styles.sectionContent}>하루 30분 걷기를 실천해보세요! 심혈관 건강에 좋습니다.</Text>
        </View>

        {/* 커뮤니티 게시판 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>커뮤니티 게시판</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/community')}>
            <Text style={styles.buttonText}>게시판 보기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  scrollContainer: { padding: 16 },
  header: { alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1877f2' },
  logoutButton: { color: 'red', fontSize: 16, marginTop: 10, textDecorationLine: 'underline' },
  section: { backgroundColor: '#ffffff', padding: 16, borderRadius: 8, marginBottom: 16, elevation: 3 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#1c1e21' },
  sectionContent: { fontSize: 16, color: '#606770', lineHeight: 24 },
  button: { backgroundColor: '#1877f2', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 6, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { backgroundColor: 'white', padding: 20, width: '80%', borderRadius: 10, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '100%', padding: 10, marginVertical: 10, borderWidth: 1, borderRadius: 6, borderColor: '#ddd' },
});

export default IndexScreen;
