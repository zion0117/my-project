import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { getAuth, updateProfile } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import { CustomText as Text } from "../components/CustomText";
import * as ImagePicker from "expo-image-picker";

const MyProfile = () => {
  const router = useRouter();
  const user = getAuth().currentUser;
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [nickname, setNickname] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const db = getFirestore();
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setGender(data.gender || "");
          setAge(data.age || "");
          setLocation(data.location || "");
          setNickname(data.nickname || user.displayName || "");
          setPhotoURL(data.photoURL || user.photoURL || "");
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setPhotoURL(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    const db = getFirestore();
    try {
      await updateProfile(user, { displayName: nickname, photoURL });
      await setDoc(doc(db, "users", user.uid), {
        gender,
        age,
        location,
        nickname,
        photoURL,
      }, { merge: true });

      Alert.alert("✅ 저장 완료", "정보가 저장되었습니다!");
    } catch (error) {
      console.error("저장 오류:", error);
      Alert.alert("❌ 저장 실패", "정보 저장에 실패했습니다.");
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>👤 내 정보</Text>

      {photoURL ? (
        <Image source={{ uri: photoURL }} style={styles.profileImage} />
      ) : null}

      <TouchableOpacity style={styles.photoButton} onPress={handlePickImage}>
        <Text style={styles.photoButtonText}>📷 프로필 사진 설정하기</Text>
      </TouchableOpacity>

      <View style={styles.inputGroup}> 
        <Text style={styles.label}>닉네임</Text>
        <TextInput
          value={nickname}
          onChangeText={setNickname}
          placeholder="예: 홍길동"
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>이메일</Text>
        <Text style={styles.staticText}>{user?.email}</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>성별</Text>
        <TextInput value={gender} onChangeText={setGender} placeholder="예: 남성 / 여성" style={styles.input} />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>나이</Text>
        <TextInput value={age} onChangeText={setAge} keyboardType="numeric" placeholder="예: 23" style={styles.input} />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>지역</Text>
        <TextInput value={location} onChangeText={setLocation} placeholder="예: 서울" style={styles.input} />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
        <Text style={styles.saveButtonText}>{loading ? "저장 중..." : "정보 저장"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.homeButton} onPress={() => router.replace("/")}> 
        <Text style={styles.homeButtonText}>🏠 홈으로</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: "#F0F8FF",
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#1C7ED6",
    fontFamily: "GmarketSansMedium",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 12,
  },
  photoButton: {
    backgroundColor: "#D0EBFF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 20,
  },
  photoButtonText: {
    color: "#1C7ED6",
    fontSize: 14,
    fontFamily: "GmarketSansMedium",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#888",
    marginBottom: 6,
    fontFamily: "GmarketSansMedium",
  },
  staticText: {
    fontSize: 16,
    color: "#444",
    backgroundColor: "#eaeaea",
    padding: 10,
    borderRadius: 8,
    fontFamily: "GmarketSansMedium",
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    fontFamily: "GmarketSansMedium",
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#1C7ED6",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "GmarketSansMedium",
  },
  homeButton: {
    marginTop: 20,
    backgroundColor: "#B2F2BB",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  homeButtonText: {
    color: "#2B8A3E",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "GmarketSansMedium",
  },
});

export default MyProfile;
