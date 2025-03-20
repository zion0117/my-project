// import { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
// import { useRouter } from 'expo-router';
// import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

// // ✅ Firebase에서 필요한 모듈 가져오기
// import { db, auth } from './firebaseConfig'; // Firebase 설정 파일 import
// import { collection, addDoc, Timestamp } from 'firebase/firestore';

// export default function ARGuide() {
//   const [permission, requestPermission] = useCameraPermissions(); // 카메라 권한
//   const [facing, setFacing] = useState<CameraType>('front'); // 기본 전면 카메라
//   const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
//   const [isCameraActive, setIsCameraActive] = useState(false);
//   const router = useRouter();

//   // ✅ 취약 신체 부위별 운동 추천
//   const exercises: Record<string, string> = {
//     허리: '코어 강화 운동 (플랭크, 브릿지)',
//     무릎: '하체 근력 운동 (스쿼트, 런지)',
//     어깨: '어깨 안정 운동 (로우, 숄더 프레스)',
//   };

//   // ✅ 신체 부위 선택 후 Firebase에 저장
//   const handleBodyPartSelection = async (bodyPart: string) => {
//     setSelectedBodyPart(bodyPart);
//     const recommendedExercise = exercises[bodyPart];

//     try {
//       const user = auth.currentUser;
//       if (!user) throw new Error('로그인이 필요합니다.');

//       await addDoc(collection(db, 'exercise_recommendations'), {
//         userId: user.uid,
//         bodyPart,
//         recommendedExercise,
//         timestamp: Timestamp.now(),
//       });

//       Alert.alert('운동 추천 완료', `${bodyPart}에 맞는 운동: ${recommendedExercise}`, [
//         { text: '확인', onPress: () => setIsCameraActive(true) },
//       ]);
//     } catch (error) {
//       Alert.alert('운동 데이터 저장 실패');
//     }
//   };

//   if (!permission) return <View />;
//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.message}>📸 카메라 사용 권한이 필요합니다.</Text>
//         <TouchableOpacity onPress={requestPermission} style={styles.button}>
//           <Text style={styles.buttonText}>권한 허용하기</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   // ✅ 신체 부위 선택 화면
//   if (!isCameraActive) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.title}>🤔 취약한 신체 부위를 선택하세요</Text>
//         {Object.keys(exercises).map((bodyPart) => (
//           <TouchableOpacity key={bodyPart} style={styles.button} onPress={() => handleBodyPartSelection(bodyPart)}>
//             <Text style={styles.buttonText}>{bodyPart}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     );
//   }

//   // ✅ 카메라 화면 (전면/후면 전환 가능)
//   return (
//     <View style={styles.container}>
//       <CameraView style={styles.camera} facing={facing}>
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity style={styles.button} onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}>
//             <Text style={styles.text}>🔄 카메라 전환</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.button} onPress={() => router.push('/Arcamera')}>
//             <Text style={styles.text}>🏋️ 자세 분석하기</Text>
//           </TouchableOpacity>
//         </View>
//       </CameraView>
//     </View>
//   );
// }

// // ✅ 스타일 정의
// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
//   title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
//   message: { textAlign: 'center', paddingBottom: 10, fontSize: 16 },
//   camera: { flex: 1, width: '100%' },
//   buttonContainer: { flexDirection: 'row', position: 'absolute', bottom: 20, alignSelf: 'center' },
//   button: { backgroundColor: '#007AFF', padding: 15, marginVertical: 5, borderRadius: 8, width: '80%', alignItems: 'center' },
//   buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
//   text: { fontSize: 18, fontWeight: 'bold', color: 'white' },
// });
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [facing, setFacing] = useState<CameraType>('front');//전방카메라로 수정
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
