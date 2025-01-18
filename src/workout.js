import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import { muscleTable, exerciseTables } from './workoutData.js';

function Workout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const myMuscles = state?.muscles || [];

  // 상태 관리
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(0);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [exerciseList, setExerciseList] = useState([]);

  // 참조
  const detectorRef = useRef(null);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const previousStateRef = useRef(null);
  const transitionCountRef = useRef(0);

  const edges = [
    [5, 6], [5, 11], [6, 12], [11, 12], [11, 13], [13, 15],
    [12, 14], [14, 16], [5, 7], [7, 9], [6, 8], [8, 10],
  ];

  // TensorFlow 모델 로드드
  useEffect(() => {
    const loadModel = async () => {
      await tf.setBackend('webgl');
      await tf.ready();
      detectorRef.current = await poseDetection.createDetector(poseDetection.SupportedModels.BlazePose, {
        runtime: 'tfjs',
        modelType: 'lite',
      });
    };
    loadModel();
  }, []);

  // 웹캠 초기화
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (webcamRef.current) webcamRef.current.srcObject = stream;
    });
  }, []);

  // 운동 목록 생성
  useEffect(() => {
    const generateExerciseList = () => {
      const MyExerciseList = myMuscles.flatMap((muscle) => muscleTable[muscle] || []);
      return MyExerciseList.slice(0, 10).sort(() => Math.random() - 0.5);
    };
    setExerciseList(generateExerciseList());
  }, [myMuscles]);

  // 운동 평가
  const evaluateExercise = (landmarks) => {
    const currentExercise = exerciseList[exerciseIndex];
    const exerciseData = exerciseTables[currentExercise] || exerciseTables.default;
    const { joint1, joint2, joint3 } = exerciseData.keypoints;

    const getLandmark = (index) => landmarks[index] || { x: 0, y: 0 };
    const p1 = getLandmark(joint1);
    const p2 = getLandmark(joint2);
    const p3 = getLandmark(joint3);
    
    const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
    const angle = Math.abs((radians * 180) / Math.PI);
    const finalAngle = angle > 180 ? 360 - angle : angle;

    const currentState = finalAngle <= 90 ? "DOWN" : finalAngle >= 170 ? "UP" : "NONE";

    if (currentState !== previousStateRef.current) {
      if (
        (currentState === "DOWN" && previousStateRef.current === "UP") ||
        (currentState === "UP" && previousStateRef.current === "DOWN")
      ) {
        transitionCountRef.current += 1;
      }

      if (transitionCountRef.current === 2) {
        setCount((prev) => prev + 1);
        setScore((prev) => prev + 10);
        transitionCountRef.current = 0;
      }

      previousStateRef.current = currentState;
    }
  };

  // 웹캠 처리
  const processWebcam = async () => {
    if (!detectorRef.current || !webcamRef.current || webcamRef.current.readyState !== HTMLMediaElement.HAVE_ENOUGH_DATA) return;
    const detector = detectorRef.current;
    const poses = await detector.estimatePoses(webcamRef.current);

    if (!poses.length) return;
    const landmarks = poses[0].keypoints.map((kp) => ({
      x: kp.x / webcamRef.current.videoWidth,
      y: kp.y / webcamRef.current.videoHeight,
    }));

    evaluateExercise(landmarks);
  };
  
  // 타이머로 웹캠 주기적 처리
  useEffect(() => {
    const interval = setInterval(processWebcam, 200);
    return () => clearInterval(interval);
  }, [exerciseList, exerciseIndex]);

  // 다음 운동
  const nextExercise = () => {
    if (exerciseIndex < exerciseList.length - 1) {
      setExerciseIndex((prev) => prev + 1);
      setCount(0);
    } else {
      navigate('/feedback');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* 상단 영역 */}
      <div style={{
        height: '33%',
        backgroundColor: '#f0f0f0',
        textAlign: 'center',
        padding: '20px',
        zIndex: 1,
        position: 'relative',
      }}>
        <h1>운동 자세 분석</h1>
        <h3>운동 이름: {exerciseList[exerciseIndex] ?? '알 수 없음'}</h3>
        <h3>점수: {score}</h3>
        <h3>횟수: {count}</h3>
        <button onClick={nextExercise}>다음 운동</button>
      </div>

      {/* 하단 영역 */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* 가이드 비디오 */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
          <video
            src={`/assets/${exerciseList[exerciseIndex]}.mp4`}
            autoPlay
            loop
            muted
            style={{ width: '100%', height: 'auto', borderRadius: '10px', border: '2px solid black' }}
          />
        </div>

        {/* 웹캠과 캔버스 */}
        <div style={{ flex: 1, position: 'relative', padding: '10px' }}>
          <video
            ref={webcamRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '10px',
              border: '2px solid black',
            }}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Workout;

  // 랜드마크 및 뼈대 그리기
  /* const drawLandmarksAndSkeleton = (canvas, landmarks, color = 'red') => {
    if (!canvas || !landmarks) return;
    const ctx = canvas.getContext('2d');

    landmarks.forEach(({ x, y }) => {
      ctx.beginPath();
      ctx.arc(x * canvas.width, y * canvas.height, 5, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    });

    edges.forEach(([start, end]) => {
      const p1 = landmarks[start];
      const p2 = landmarks[end];
      if (p1 && p2) {
        ctx.beginPath();
        ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
        ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
    ctx.clearRect();
  };
  */

 //피드백, 다른 운동 추가하기