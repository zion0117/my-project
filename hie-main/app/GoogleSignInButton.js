import React, { useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { GoogleAuthProvider, signInWithCredential, getAuth } from 'firebase/auth';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

const GoogleSignInButton = () => {
  const router = useRouter();
  const auth = getAuth();

  const androidClientId = Constants.expoConfig?.extra?.googleAuth?.androidClientId;
  const iosClientId = Constants.expoConfig?.extra?.googleAuth?.iosClientId;
  const clientId = Platform.OS === 'android' ? androidClientId : iosClientId;

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId,
    scopes: ['openid', 'profile', 'email'],
  });

  useEffect(() => {
    console.log("📲 사용 중인 clientId:", clientId);
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then(async (userCredential) => {
          const user = userCredential.user;
          console.log("✅ Firebase 로그인 성공:", {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
          });

          // ✅ Firebase ID 토큰 가져오기
          const idToken = await user.getIdToken();

          // ✅ WebView에서 사용할 페이지 주소로 이동 (token 포함)
          const webUrl = `https://your-site.web.app/index.html?token=${idToken}`;
          router.push({
            pathname: '/ar-guide', // WebView 보여주는 페이지 (ARGuide.tsx 등)
            params: { url: webUrl },
          });
        })
        .catch((error) => {
          console.error("❌ Firebase 로그인 실패:", error);
        });
    } else if (response?.type === 'error') {
      console.error("❌ OAuth 로그인 실패:", response.error);
    }
  }, [response]);

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        console.log("🚀 로그인 버튼 클릭됨");
        promptAsync();
      }}
    >
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
