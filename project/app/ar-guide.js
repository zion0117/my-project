import React, { useEffect, useRef } from 'react';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';

export default function ARGuideScreen() {
  const glViewRef = useRef(null);

  useEffect(() => {
    const setupAR = async () => {
      const gl = glViewRef.current.getWebGLRenderingContext();
      const renderer = new Renderer({ gl });
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);

      // 3D 모델 로드
      const loader = new THREE.GLTFLoader();
      loader.load('path/to/your/exercise-pose.glb', (gltf) => {
        const model = gltf.scene;
        scene.add(model);
      });

      // 카메라 위치 설정
      camera.position.z = 5;

      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        gl.endFrameEXP();
      };
      animate();
    };

    setupAR();
  }, []);

  return (
    <GLView
      ref={glViewRef}
      style={{ flex: 1 }}
      onContextCreate={async (gl) => {
        // WebGL 컨텍스트 초기화
      }}
    />
  );
}
