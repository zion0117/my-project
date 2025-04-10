import React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import { useRouter } from "expo-router";

const PlankWebView = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{
          uri: "https://posecorrector.netlify.app/plank.html", // ✅ 여기에 배포된 plank.html 주소를 넣어줘
        }}
        originWhitelist={["*"]}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === "navigate" && data.target === "Dashboard") {
              router.push("/Dashboard");
            }
          } catch (e) {
            console.warn("📩 WebView 메시지 파싱 오류:", e);
          }
        }}
      />
    </View>
  );
};

export default PlankWebView;
