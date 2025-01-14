import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import { muscleTable, exerciseTables } from './workoutData';

function Workout() {
  const { state } = useLocation(); 
  const myMuscles = state?.muscles || [];
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState(null);
  const [count, setCount] = useState(0);
  const [myExercises, setMyExercises] = useState([]);
  const [exercise, setExercise] = useState(0);
  const [detector, setDetector] = useState(null);

  const webcamRef = useRef(null); 
  const webcamCanvasRef = useRef(null); 
  const navigate = useNavigate();

  //myMuscles->myExercises
  useEffect(() => {
    let preMyExercises = myMuscles.flatMap((muscle) => muscleTable[muscle])
    .sort(() => Math.random() - 0.5);
    const restExercises = Object.values(muscleTable)
    .flat()
    .filter((exercise) => !preMyExercises.includes(exercise))
    .sort(() => Math.random() - 0.5);
    preMyExercises = [...preMyExercises, ...restExercises.slice(0, 10 - preMyExercises.length)]
    .slice(0, 10);
    setMyExercises(preMyExercises);
  }, [myMuscles]);

  // TensorFlow 초기화
  useEffect(() => {
    tf.ready().then(() => {
      poseDetection.createDetector(poseDetection.SupportedModels.BlazePose, {
        runtime: 'tfjs',
        modelType: 'lite',
      }).then(setDetector);
    });
  }, []);

  // webcam 초기화
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (webcamRef.current) webcamRef.current.srcObject = stream;
    });
  }, []);

  // landmarks 그리기
  const drawLandmarks = (canvas, landmarks, color = 'red') => {
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height);
    landmarks.forEach(({ x, y }) => {
      context.beginPath()
      context.arc(x * canvas.width, y * canvas.height, 5, 0, 2 * Math.PI)
      context.fillStyle = color
      context.fill();
    });
  };

  const evaluateExercise = (landmarks, exercise) => {
  //landmarks->angle->count, score, feedback 
    const exerciseTable = exerciseTables[exercise]|| exerciseTables.default;
    const { joint1, joint2, joint3 } = exerciseTable.keypoints;
    const p1 = landmarks[joint1] || { x: 0, y: 0 }; 
    const p2 = landmarks[joint2] || { x: 0, y: 0 };
    const p3 = landmarks[joint3] || { x: 0, y: 0 };
    const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
    const angle = Math.abs((radians * 180) / Math.PI);
    const finalAngle = angle > 180 ? 360 - angle : angle;

    // DOWN 상태태
    if (finalAngle <= 90) {
      if (phase !== "DOWN") {
        setPhase("DOWN");
        if (phase === "UP") {
          setCount((prev) => prev + 1); // UP → DOWN 전환 시 카운트 증가
          setScore((prev) => prev + 10); // 카운트당 점수 추가
        }
      }
    }
    // UP 상태
    else if (finalAngle >= 170) {
      if (phase !== "UP") {
        setPhase("UP");
      }
    }
  }

  // 웹캠 처리 
    const processWebcam = async () => {
      if (detector && webcamRef.current?.readyState === 4 && myExercises[exercise]) {
        const poses = await detector.estimatePoses(webcamRef.current);
        if (poses.length > 0) {
          const landmarks = poses[0].keypoints.map((kp) => ({
            x: kp.x / webcamRef.current.videoWidth,
            y: kp.y / webcamRef.current.videoHeight,
          }));
          drawLandmarks(webcamCanvasRef.current, landmarks);
          evaluateExercise(landmarks, myExercises[exercise]);
        }
      };
    const interval = setInterval(processWebcam, 100);
    return () => clearInterval(interval);
  }

  // 현재 운동 이름으로 비디오 경로 생성
  const guideVideoPath = `/assets/${myExercises[exercise]}.mp4`;

  // 다음 운동으로 이동
  const nextExercise = () => {
    if (exercise < myExercises.length - 1) {
      setExercise((prev) => prev + 1);
      setCount(0); 
    } else {
      navigate('/feedback');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
      <h1>운동 자세 분석</h1>
      <h3>점수: {score}</h3>
      <h3>횟수: {count}</h3>
      <button onClick={nextExercise}>다음 운동</button>
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <video src={guideVideoPath} autoPlay loop muted width="300" height="300" style={{ border: '2px solid black', borderRadius: '8px' }}></video>
      </div>
      <div style={{ position: 'relative' }}>
        <video ref={webcamRef} autoPlay playsInline muted width="640" height="480" style={{ border: '1px solid black' }}></video>
        <canvas ref={webcamCanvasRef} width="640" height="480" style={{ position: 'absolute', top: 0, left: 0 }}></canvas>
      </div>
    </div>
  );
}

export default Workout;