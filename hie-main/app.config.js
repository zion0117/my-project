// app.config.js
import "dotenv/config";

export default {
  expo: {
    name: "hi",
    slug: "hi",
    scheme: "myapp",
    owner: "suyeon11",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      bundleIdentifier: "com.suyeon11.hi",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      package: "com.exercise.android1",
      googleServicesFile: "./google-services.json",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ],
      "expo-font"
    ],
    extra: {
      googleAuth: {
        androidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID,
        iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
        webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
        redirectUri: process.env.GOOGLE_REDIRECT_URI
      },
      firebase: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID
      },
      newsApiKey: process.env.NEWS_API_KEY,
      googlePlacesApiKey: process.env.GOOGLE_PLACES_API_KEY,
      gnewsApiKey: process.env.GNEWS_API_KEY,
      naverClientId: process.env.NAVER_CLIENT_ID,             // ✅ 추가됨
      naverClientSecret: process.env.NAVER_CLIENT_SECRET,     // ✅ 추가됨
      router: {
        origin: false
      },
      eas: {
        projectId: "e82c2d2b-44eb-4a0e-81b5-1eff52d2db5a"
      }
    }
  }
};
