import React, { useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { GoogleAuthProvider, signInWithCredential, getAuth } from 'firebase/auth';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();
console.log("📣 GoogleSignInButton 컴포넌트 로드됨");

const GoogleSignInButton = () => {
  const router = useRouter();
  const auth = getAuth();

  // ✅ 하드코딩된 redirectUri (Expo Proxy 사용)
  const redirectUri = "https://auth.expo.io/@suyeon11/hi";

  // ✅ 환경변수에서 클라이언트 ID
  const androidClientId = Constants.expoConfig?.extra?.googleAuth?.androidClientId;
  const webClientId = Constants.expoConfig?.extra?.googleAuth?.webClientId;
  const iosClientId = Constants.expoConfig?.extra?.googleAuth?.iosClientId;

  // ✅ Google 로그인 요청 초기화
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId,
    iosClientId,
    webClientId,
    redirectUri,       // 👈 하드코딩된 redirectUri
    useProxy: true,    // 👈 Proxy 모드 명시
  });

  // ✅ 컴포넌트 마운트 확인 로그
  useEffect(() => {
    console.log("✅ useEffect: 컴포넌트 마운트됨");
    console.log("🧭 redirectUri:", redirectUri);
  }, []);

  // ✅ request가 준비된 후 로그인 URL 확인
  useEffect(() => {
    if (request?.url) {
      console.log("🔐 Google login URL:", request.url);
    }
  }, [request]);

  // ✅ 로그인 성공 시 처리
  useEffect(() => {
    if (response) {
      console.log("📦 Google 응답 도착:", response);
    }

    if (response?.type === 'success') {
      console.log("🎉 로그인 성공! Firebase 인증 중...");
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          console.log("✅ Firebase 로그인 성공");
          router.replace('/home');
        })
        .catch((error) => {
          console.error('❌ Firebase 로그인 실패:', error);
        });
    } else if (response?.type === 'error') {
      console.error("❌ Google 로그인 실패:", response.error);
    }
  }, [response]);

  // ✅ 버튼 클릭 처리
  const handleLogin = async () => {
    console.log("🚀 로그인 버튼 클릭됨");
    await promptAsync();
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleLogin}>
      <Text style={styles.buttonText}>Google 로그인</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4285F4',
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
});

export default GoogleSignInButton;
