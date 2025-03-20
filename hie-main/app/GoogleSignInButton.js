import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { GoogleAuthProvider, signInWithCredential, getAuth } from 'firebase/auth';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

const GoogleSignInButton = () => {
  const router = useRouter();
  const auth = getAuth();

  // 환경 변수에서 Client ID 가져오기
  const androidClientId = Constants.expoConfig?.extra?.googleAuth?.androidClientId;
  const webClientId = Constants.expoConfig?.extra?.googleAuth?.webClientId;
  const iosClientId = Constants.expoConfig?.extra?.googleAuth?.iosClientId; // ✅ iOS Client ID 추가

  // Google 로그인 설정 (redirectUri 명확하게 지정)
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId,
    iosClientId,
    webClientId,
    redirectUri: "com.suyeon11.myapp:/oauthredirect",
    scopes: ["profile", "email"],
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          router.replace('/home'); // 로그인 후 홈 화면 이동
        })
        .catch((error) => {
          console.error('로그인 실패:', error);
        });
    }
  }, [response]);

  return (
    <TouchableOpacity style={styles.button} onPress={() => promptAsync()}>
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
