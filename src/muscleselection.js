import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

const exercises = [
  { id: 1, name: "푸쉬업", targetMuscles: ["가슴", "어깨", "팔근육"], animationPath: "/assets/animations/pushup.fbx" },
  { id: 2, name: "스쿼트", targetMuscles: ["허벅지", "종아리", "발목"], animationPath: "/assets/animations/squat.fbx" },
  { id: 3, name: "플랭크", targetMuscles: ["복부", "허리"], animationPath: "/assets/animations/plank.fbx" },
  { id: 4, name: "데드리프트", targetMuscles: ["등", "허리", "허벅지"], animationPath: "/assets/animations/deadlift.fbx" },
  { id: 5, name: "팔굽혀펴기", targetMuscles: ["가슴", "팔근육"], animationPath: "/assets/animations/pushup.fbx" },
];
function Muscleselection() {
  const location = useLocation();
  const { muscles } = location.state || {}; // 전달된 근육 데이터 받기
  const exerciseId = 1; // 예시: 선택된 운동 ID
  const fbxRef = useRef();

  // 운동 데이터 매핑 (예시: 운동 ID -> 애니메이션 경로)
  const exerciseData = [
    { id: 1, name: "푸쉬업", animationPath: "/assets/airsquat.fbx" },
    { id: 2, name: "스쿼트", animationPath: "/assets/airsquat.fbx" },
    { id: 3, name: "플랭크", animationPath: "/assets/airsquat.fbx" },
    { id: 4, name: "데드리프트", animationPath: "/assets/airsquat.fbx" },
    { id: 5, name: "팔굽혀펴기", animationPath: "/assets/airsquat.fbx" },
    // 추가 운동
  ];

  // 선택된 운동 ID에 맞는 애니메이션 경로 가져오기
  const exercise = exerciseData.find((exercise) => exercise.id === exerciseId);
  const animationPath = exercise ? exercise.animationPath : null;

  useEffect(() => {
    if (animationPath) {
      const loader = new FBXLoader();
      loader.load(animationPath, (object) => {
        object.scale.set(0.1, 0.1, 0.1); // 크기 조정
        fbxRef.current.add(object);
      });
    }
  }, [animationPath]);

  return (
    <div>
      <h2>운동 페이지</h2>
      <p>선택된 근육: {muscles?.join(", ")}</p>
      <p>추천 운동: {exercise ? exercise.name : "운동이 없습니다"}</p>

      <div style={{ width: "100%", height: "500px" }}>
        <Canvas camera={{ position: [0, 1, 5] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[0, 10, 5]} intensity={1} />
          <group ref={fbxRef} />
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
}

export default Muscleselection;
