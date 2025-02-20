import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { auth } from "./firebaseConfig";
import { getAuth } from "firebase/auth";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";

WebBrowser.maybeCompleteAuthSession(); // ✅ 웹 브라우저 로그인 완료 처리

const GoogleSignInButton = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "https://auth.expo.io/@suyeon11/app.json", // ✅ Firebase 콘솔에서 가져온 Expo Client ID
    androidClientId: "193222581186-n71h707adtk4rvjfikqkc0jt1h4mgcva.apps.googleusercontent.com", // ✅ Android Client ID
    webClientId: "YOUR_WEB_CLIENT_ID",   // ✅ Web Client ID
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.authentication;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => promptAsync()}
      disabled={!request}
    >
      <Text style={styles.buttonText}>Google 로그인</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#DB4437",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default GoogleSignInButton;
