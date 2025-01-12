import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

import { muscleExercises, feedback } from './exerciseData';

function Workout() {
  const [score, setScore] = useState(0); // 총 점수
  const [feedback, setFeedback] = useState(''); // 현재 피드백
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0); // 현재 운동 인덱스
  const [selectedExercises, setSelectedExercises] = useState([]); // 랜덤으로 선택된 운동 목록
  const [isExerciseComplete, setIsExerciseComplete] = useState(false); // 모든 운동 완료 여부

  const videoRef = useRef(null); // 웹캠 비디오 엘리먼트 참조
  const webcamCanvasRef = useRef(null); // 캔버스 참조
  const guideVideoRef = useRef(null); // 가이드 비디오 참조
  const [detector, setDetector] = useState(null); // 포즈 검출 모델

  const location = useLocation();
  const { state } = location;
  const selectedMuscles = state?.muscles || []; // 선택된 근육 그룹
  const navigate = useNavigate();

  // 운동 목록 랜덤 선택
  const selectRandomExercises = (muscles, count = 10) => {
    const selected = muscles.flatMap((muscle) => muscleExercises[muscle] || []);
    return selected.length
      ? Array.from({ length: count }, (_, i) => selected[i % selected.length]).sort(() => Math.random() - 0.5)
      : [];
  };

  // TensorFlow.js 모델 초기화
  useEffect(() => {
    tf.ready().then(() => {
      poseDetection.createDetector(poseDetection.SupportedModels.BlazePose, {
        runtime: 'tfjs',
        modelType: 'lite',
      }).then(setDetector);
    });
  }, []);

  // 웹캠 초기화
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) videoRef.current.srcObject = stream;
    });
  }, []);

  // 선택된 근육에 따라 운동 초기화
  useEffect(() => {
    if (selectedMuscles.length > 0) {
      setSelectedExercises(selectRandomExercises(selectedMuscles));
    }
  }, [selectedMuscles]);

  // 랜드마크 그리기
  const drawLandmarks = (canvas, landmarks, color = 'red') => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    landmarks.forEach(({ x, y }) => {
      ctx.beginPath();
      ctx.arc(x * canvas.width, y * canvas.height, 5, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    });
  };

  // 각도 계산
  const calculateAngle = (landmarks, joint1, joint2, joint3) => {
    const [p1, p2, p3] = [landmarks[joint1], landmarks[joint2], landmarks[joint3]];
    const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
    const angle = Math.abs((radians * 180) / Math.PI);
    return angle > 180 ? 360 - angle : angle;
  };

  // 운동 평가
  const evaluateExercise = (userLandmarks, currentExercise) => {
    const exerciseData = feedback[currentExercise];
    if (!exerciseData) return;

    const { keypoints, phases, feedback: feedbackMessages } = exerciseData;
    const angle = calculateAngle(userLandmarks, keypoints.joint1, keypoints.joint2, keypoints.joint3);

    let feedbackMessage = '';
    if (phases.DOWN(angle)) {
      feedbackMessage = feedbackMessages.DOWN?.message || '';
    } else if (phases.UP(angle)) {
      feedbackMessage = feedbackMessages.UP?.message || '';
      setScore((prev) => prev + 10); // 점수 증가
    }
    setFeedback(feedbackMessage); // 피드백 업데이트
  };

  // 웹캠에서 데이터 처리
  useEffect(() => {
    const processWebcam = async () => {
      if (detector && videoRef.current?.readyState === 4) {
        const poses = await detector.estimatePoses(videoRef.current);
        if (poses[0]?.keypoints) {
          const userLandmarks = poses[0].keypoints.map((kp) => ({
            x: kp.x / videoRef.current.videoWidth,
            y: kp.y / videoRef.current.videoHeight,
          }));
          drawLandmarks(webcamCanvasRef.current, userLandmarks);
          evaluateExercise(userLandmarks, selectedExercises[currentExerciseIndex]);
        }
      }
    };
    const interval = setInterval(processWebcam, 100);
    return () => clearInterval(interval);
  }, [detector, currentExerciseIndex, selectedExercises]);

  // 다음 운동으로 이동
  const nextExercise = () => {
    if (currentExerciseIndex < selectedExercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      setIsExerciseComplete(true);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
      <h1>운동 자세 분석</h1>
      <h3>점수: {score}</h3>
      <h3>피드백: {feedback}</h3>
      {isExerciseComplete ? (
        <div>
          <h1>운동 완료!</h1>
          <button onClick={() => navigate('/feedback')}>피드백 확인</button>
        </div>
      ) : (
        <div>
          <h2>현재 운동: {selectedExercises[currentExerciseIndex]}</h2>
          <button onClick={nextExercise}>다음 운동</button>
        </div>
      )}
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <video
          ref={guideVideoRef}
          autoPlay
          loop
          muted
          width="300"
          height="300"
          style={{ border: '2px solid black', borderRadius: '8px' }}
        ></video>
        <div style={{ position: 'relative' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            width="640"
            height="480"
            style={{ position: 'absolute', top: 0, left: 0 }}
          ></video>
          <canvas
            ref={webcamCanvasRef}
            width="640"
            height="480"
            style={{ position: 'absolute', top: 0, left: 0 }}
          ></canvas>
        </div>
      </div>
    </div>
  );
}

export default Workout;
