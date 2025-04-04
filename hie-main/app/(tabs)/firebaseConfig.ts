import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // ✅ Firestore 추가

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyBE8ctT7TL_5IdfOG32F9w3aazAYXajDaM",
  authDomain: "exercisedb-442105.firebaseapp.com",
  projectId: "exercisedb-442105",
  storageBucket: "exercisedb-442105.firebasestorage.app",
  messagingSenderId: "193222581186",
  appId: "1:193222581186:web:1df215487a3c4b0579545b",
  measurementId: "G-GHNG55W70H"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // ✅ Firestore 인스턴스 생성

// 필요하면 app도 export 가능
export { db,app };

