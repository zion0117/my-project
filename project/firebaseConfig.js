// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCunTgFPqco0PCicIigWBK-vDuehu9SS9Y",
  authDomain: "exercise-4ab95.firebaseapp.com",
  projectId: "exercise-4ab95",
  storageBucket: "exercise-4ab95.firebasestorage.app",
  messagingSenderId: "401838801256",
  appId: "1:401838801256:web:3bc7db322a990000d2d6dd",
  measurementId: "G-1LFT0W143W"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
export default app; // 🚀 default export 추가
