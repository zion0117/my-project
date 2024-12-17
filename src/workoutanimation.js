import React, { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

function WorkoutCharacter({ fbxFilePath }) {
  const fbxRef = useRef();

  useEffect(() => {
    const loader = new FBXLoader();
    loader.load(fbxFilePath, (object) => {
      object.scale.set(0.1, 0.1, 0.1); // 크기 조정
      fbxRef.current.add(object);
    });

    // 애니메이션이나 추가적인 설정이 필요한 경우 로드 후 실행할 코드
  }, [fbxFilePath]);

  return <group ref={fbxRef} />;
}

function WorkoutAnimation({ exerciseId }) {
  const animationMap = {
    1: "/assets/animations/Air Squat.fbx",   // 푸쉬업 애니메이션
    2: "/assets/animations/Air Squat.fbx",    // 스쿼트 애니메이션
    3: "/assets/animations/Air Squat.fbx",    // 플랭크 애니메이션
    4: "/assets/animations/Air Squat.fbx",    // 런지 애니메이션
    5: "/assets/animations/Air Squat.fbx",     // 점프 애니메이션
  };

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Canvas camera={{ position: [0, 1, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 10, 5]} intensity={1} />
        <WorkoutCharacter fbxFilePath={animationMap[exerciseId]} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default WorkoutAnimation;
