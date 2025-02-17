import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, StyleSheet, Modal, TextInput, Button } from 'react-native';
import { useRouter } from 'expo-router';

const IndexScreen = () => {
  const router = useRouter();

  // 로그인/회원가입 팝업 상태 관리
  const [isModalVisible, setIsModalVisible] = useState(true); // 기본적으로 팝업을 보이게 설정
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // 로그인 처리 로직
    setIsModalVisible(false); // 로그인 후 팝업 닫기
  };

  const handleSignUp = () => {
    // 회원가입 처리 로직
    setIsModalVisible(false); // 회원가입 후 팝업 닫기
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 로그인/회원가입 팝업 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>로그인 / 회원가입</Text>

            {/* 이메일 입력 */}
            <TextInput
              style={styles.input}
              placeholder="이메일"
              value={email}
              onChangeText={setEmail}
            />

            {/* 비밀번호 입력 */}
            <TextInput
              style={styles.input}
              placeholder="비밀번호"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {/* 버튼들 */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>로그인</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
              <Text style={styles.buttonText}>회원가입</Text>
            </TouchableOpacity>

            {/* 팝업 닫기 버튼 */}
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Text style={styles.closeButton}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 제목 */}
        <View style={styles.header}>
          <Text style={styles.title}>시니어 헬스 커뮤니티</Text>
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

        {/* 소셜 네트워킹 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>소셜 네트워킹</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/friends')}>
            <Text style={styles.buttonText}>친구 목록</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/group-exercise')}>
            <Text style={styles.buttonText}>그룹 운동 도전</Text>
          </TouchableOpacity>
        </View>

        {/* 건강 정보 라이브러리 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>건강 정보 라이브러리</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/exercise-guide')}>
            <Text style={styles.buttonText}>운동 가이드</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/video-tutorial')}>
            <Text style={styles.buttonText}>영상 튜토리얼</Text>
          </TouchableOpacity>
        </View>

        {/* 알림 및 리마인더 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>알림 및 리마인더</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/notifications')}>
            <Text style={styles.buttonText}>운동 알림</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/medication-reminder')}>
            <Text style={styles.buttonText}>약 복용 알림</Text>
          </TouchableOpacity>
        </View>

        {/* AI 건강 가이드 (챗봇) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI 건강 가이드</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/chatbot')}>
            <Text style={styles.buttonText}>챗봇과 대화</Text>
          </TouchableOpacity>
        </View>

        {/* 음성 인식 건강 기록 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>음성 건강 기록</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/voice-record')}>
            <Text style={styles.buttonText}>음성으로 기록하기</Text>
          </TouchableOpacity>
        </View>

        {/* AR 운동 자세 가이드 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AR 운동 자세 가이드</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/ar-guide')}>
            <Text style={styles.buttonText}>운동 자세 확인</Text>
          </TouchableOpacity>
        </View>

          {/* 생활 운동 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>생활 운동</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/find-park')}>
            <Text style={styles.buttonText}>주변 공원 추천</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/visual-chart')}>
            <Text style={styles.buttonText}>걸음수 기록하기</Text>
          </TouchableOpacity>
        </View>

          {/* 정보 게시판 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>정보 게시판</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/ar-guide')}>
            <Text style={styles.buttonText}>건강 관련 정보</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1877f2',
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1c1e21',
  },
  sectionContent: {
    fontSize: 16,
    color: '#606770',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#1877f2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 투명 배경
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    width: '80%',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#ddd',
  },
  closeButton: {
    color: '#1877f2',
    fontSize: 16,
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});

export default IndexScreen;
