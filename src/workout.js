import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import { muscleTable, exerciseTables } from './workoutData.js';
import myMuscles from './App.js' 

function Workout() {
  const [myExercises, setMyExercises] = useState([]);
  const [exercise, setExercise] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState(null);

  const webcamRef = useRef(null); 
  const webcamCanvasRef = useRef(null); 
  const [detector, setDetector] = useState(null); 
  const navigate = useNavigate();

  //myMuscles->myExercises
  useEffect(() => {
    let myExercises = myMuscles.flatMap((muscle) => muscleTable[muscle])
    .sort(() => Math.random() - 0.5);
    const restExercises = Object.values(muscleTable)
    .flat()
    .filter((exercise) => !myExercises.includes(exercise))
    .sort(() => Math.random() - 0.5);
    myExercises = [...myExercises, ...restExercises.slice(0, 10 - myExercises.length)]
    .slice(0, 10);
    setMyExercises(myExercises);
  }, [myExercises]);

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
      if (videoRef.current) videoRef.current.srcObject = stream;
    });
  }, []);

  // landmarks 그리기
  const drawLandmarks = (canvas, landmarks, color = 'red') => {
    const context = canvas.getContext('2d')
    .clearRect(0, 0, canvas.width, canvas.height);
    landmarks.forEach(({ x, y }) => {
      context.beginPath()
      .arc(x * canvas.width, y * canvas.height, 5, 0, 2 * Math.PI)
      .fillStyle = color
      .fill();
    });
  };

  const calculateAngle = (landmarks, exercise) => {
  //landmarks->angle
    const exerciseTable = exerciseTables[exercise];
    const [p1, p2, p3] = [landmarks[exerciseTable.keypoints.joint1], landmarks[exerciseTable.keypoints.joint2], landmarks[exerciseTable.keypoints.joint3]];
    const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
    const preAngle = Math.abs((radians * 180) / Math.PI);
    return angle > 180 ? 360 - preAngle : preAngle;

  //angle->count, score, feedback 
  const evaluateExercise = (angle, exercise) => {
    const angle = calculateAngle(landmarks, exercise);
    const { stages, feedbacks } = exerciseTables[exercise];
    if (stages.DOWN.condition(angle)) {
      if (phase !== "DOWN") {
        setPhase("DOWN");
        if (stages.DOWN.feedback(angle)) {
          setFeedback(stages.DOWN.feedback(angle)); 
        }
      }
    } else if (stages.UP.condition(angle)) {
      if (phase !== "UP") {
        setPhase("UP");
        if (stages.UP.feedback(angle)) {
          setFeedback(stages.UP.feedback(angle)); 
          setScore((prev) => prev - 1); 
        } else {
          setScore((prev) => prev + 20); 
          setCount((prev) => prev + 1); 
        }
      }
    }
  };

  // 웹캠 처리 
  useEffect(() => {
    const processWebcam = async () => {
      if (detector && videoRef.current?.readyState === 4) {
        const poses = await detector.estimatePoses(videoRef.current);
          const landmarks = poses[0].keypoints.map((kp) => ({
            x: kp.x / videoRef.current.videoWidth,
            y: kp.y / videoRef.current.videoHeight,
          }));
          drawLandmarks(webcamCanvasRef.current, landmarks);
          evaluateExercise(landmarks, myExercises[exercise]);
        }
      };
    const interval = setInterval(processWebcam, 100);
    return () => clearInterval(interval);
  }, [detector, exercise, myExercises]);

  // 현재 운동 이름으로 비디오 경로 생성
  const guideVideoPath = `/assets/${myExercises[exercise]}.mp4`;

  // 다음 운동으로 이동
  const nextExercise = () => {
    if (cexercise < myExercises.length - 1) {
      setExercise((prev) => prev + 1);
    } else {
      navigate('/feedback');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
      <h1>운동 자세 분석</h1>
      <h3>점수: {score}</h3>
      <h3>피드백: {feedback}</h3>
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