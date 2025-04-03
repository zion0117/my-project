// import { initializeApp, getApps, getApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import Constants from "expo-constants";

// // ✅ 환경 변수에서 Firebase 설정 가져오기

// const firebaseConfig = {
//   apiKey: Constants.expoConfig?.extra?.firebase?.apiKey,
//   authDomain: Constants.expoConfig?.extra?.firebase?.authDomain,
//   projectId: Constants.expoConfig?.extra?.firebase?.projectId,
//   storageBucket: Constants.expoConfig?.extra?.firebase?.storageBucket,
//   messagingSenderId: Constants.expoConfig?.extra?.firebase?.messagingSenderId,
//   appId: Constants.expoConfig?.extra?.firebase?.appId,
//   measurementId: Constants.expoConfig?.extra?.firebase?.measurementId
// };

// // ✅ Firebase 초기화 (중복 방지)
// let app;
// if (getApps().length === 0) {
//   app = initializeApp(firebaseConfig);
// } else {
//   app = getApp();
// }

// // ✅ Firebase 인증 및 Firestore 초기화
// const auth = getAuth(app);
// const db = getFirestore(app);

// export { app, auth, db };
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBE8ctT7TL_5IdfOG32F9w3aazAYXajDaM",
  authDomain: "exercisedb-442105.firebaseapp.com",
  projectId: "exercisedb-442105",
  storageBucket: "exercisedb-442105.firebasestorage.app",
  messagingSenderId: "193222581186",
  appId: "1:193222581186:web:1df215487a3c4b0579545b",
  measurementId: "G-GHNG55W70H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); 