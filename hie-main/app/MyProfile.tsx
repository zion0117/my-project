import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import { CustomText as Text } from "../components/CustomText";

const MyProfile = () => {
  const router = useRouter();
  const user = getAuth().currentUser;
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
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
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    const db = getFirestore();
    try {
      await setDoc(doc(db, "users", user.uid), {
        gender,
        age,
        location,
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

      {/* ✅ 홈으로 돌아가기 버튼 */}
      <TouchableOpacity style={styles.homeButton} onPress={() => router.replace("/")}>
        <Text style={styles.homeButtonText}>🏠 홈으로</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#F5FAFE",
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#1C7ED6",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#888",
    marginBottom: 6,
  },
  staticText: {
    fontSize: 16,
    color: "#444",
    backgroundColor: "#eaeaea",
    padding: 10,
    borderRadius: 8,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
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
  },
});

export default MyProfile;
