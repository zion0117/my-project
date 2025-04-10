// components/HomeButton.tsx
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const HomeButton = () => {
  const router = useRouter();

  return (
    <TouchableOpacity style={styles.button} onPress={() => router.push("/")}>
      <Ionicons name="home" size={26} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 24,
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});

export default HomeButton;
