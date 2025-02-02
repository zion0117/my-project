import React from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'; // ✅ 네비게이션 기능 추가

const IndexScreen = () => {
  const router = useRouter(); // ✅ useRouter 사용

  return (
    <SafeAreaView style={styles.container}>
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

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2e3d49',
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  sectionContent: {
    fontSize: 16,
    color: '#666',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default IndexScreen;
