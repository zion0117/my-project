import React, { useState, useEffect, useRef } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection'; // TensorFlow.js 포즈 검출 모델
import * as tf from '@tensorflow/tfjs'; // TensorFlow.js
import '@tensorflow/tfjs-backend-webgl'; // WebGL 백엔드 사용 (WebGPU 사용 시 변경 가능)

function Workout() {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [score, setScore] = useState(0);  // 총 점수
  const [maxScore, setMaxScore] = useState(0);  // 총 최대 점수
  const [exerciseComplete, setExerciseComplete] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [evaluatedFeedback, setEvaluatedFeedback] = useState([]); // 피드백을 추적할 상태
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const webcamCanvasRef = useRef(null);
  const guideVideoRef = useRef(null);
  const [detector, setDetector] = useState(null);

  // TensorFlow.js가 준비되었는지 확인하고 백엔드 초기화
  useEffect(() => {
    const initializeTensorFlow = async () => {
      await tf.ready(); // TensorFlow가 준비될 때까지 기다림
      await tf.setBackend('webgl'); // WebGPU 백엔드 사용 시 'webgpu'로 설정 가능
      console.log('TensorFlow.js WebGL backend is ready!');

      const poseDetector = await poseDetection.createDetector(poseDetection.SupportedModels.BlazePose, {
        runtime: 'tfjs',
        modelType: 'lite',
      });
      setDetector(poseDetector); // 모델 초기화 후 설정
    };

    initializeTensorFlow();
  }, []);

  // 웹캠 초기화
  useEffect(() => {
    const initWebcam = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    };
    initWebcam();
  }, []);

  // 각도 계산 함수
  const calculateAngle = (point1, point2, point3) => {
    const angle = Math.atan2(point3.y - point2.y, point3.x - point2.x) - Math.atan2(point1.y - point2.y, point1.x - point2.x);
    return Math.abs((angle * 180) / Math.PI);
  };

  // 운동 데이터 평가 함수
  const evaluateExercise = (userLandmarks, guideLandmarks) => {
    let frameScore = 0;
    let feedbackText = '';
    let maxFrameScore = 0;

    if (userLandmarks && guideLandmarks) {
      guideLandmarks.forEach((guidePoint, index) => {
        const userPoint = userLandmarks[index];
        if (userPoint) {
          const distance = Math.sqrt(
            Math.pow(guidePoint.x - userPoint.x, 2) +
            Math.pow(guidePoint.y - userPoint.y, 2)
          );
          if (distance < 0.1) {
            frameScore += 10;
            maxFrameScore += 10;  // 최대 점수 업데이트
          } else {
            // 피드백을 추가하기 전에 이미 피드백이 기록되었는지 확인
            if (!evaluatedFeedback.includes('자세를 조금 더 조정해보세요!')) {
              feedbackText += '자세를 조금 더 조정해보세요!\n';
              setEvaluatedFeedback((prev) => [...prev, '자세를 조금 더 조정해보세요!']);
            }
          }
        }
      });
    }

    // 자세별 피드백 (근육별로 분석)
    if (userLandmarks) {
      // 팔꿈치 각도 (wrist -> elbow -> shoulder)
      const elbowAngle = calculateAngle(userLandmarks[5], userLandmarks[7], userLandmarks[9]);
      if (elbowAngle < 150 && !evaluatedFeedback.includes('팔꿈치를 더 구부려 주세요.')) {
        feedbackText += '팔꿈치를 더 구부려 주세요.\n';
        setEvaluatedFeedback((prev) => [...prev, '팔꿈치를 더 구부려 주세요.']);
      } else {
        frameScore += 10;
        maxFrameScore += 10;
      }

      // 무릎 각도 (hip -> knee -> ankle)
      const kneeAngle = calculateAngle(userLandmarks[12], userLandmarks[14], userLandmarks[16]);
      if (kneeAngle < 150 && !evaluatedFeedback.includes('무릎을 더 구부려 주세요.')) {
        feedbackText += '무릎을 더 구부려 주세요.\n';
        setEvaluatedFeedback((prev) => [...prev, '무릎을 더 구부려 주세요.']);
      } else {
        frameScore += 10;
        maxFrameScore += 10;
      }

      // 어깨 각도 (elbow -> shoulder -> hip)
      const shoulderAngle = calculateAngle(userLandmarks[5], userLandmarks[6], userLandmarks[11]);
      if (shoulderAngle > 150 && !evaluatedFeedback.includes('어깨를 더 내리세요.')) {
        feedbackText += '어깨를 더 내리세요.\n';
        setEvaluatedFeedback((prev) => [...prev, '어깨를 더 내리세요.']);
      } else {
        frameScore += 10;
        maxFrameScore += 10;
      }

      // 고관절 각도 (knee -> hip -> shoulder)
      const hipAngle = calculateAngle(userLandmarks[12], userLandmarks[11], userLandmarks[23]);
      if (hipAngle < 90 && !evaluatedFeedback.includes('고관절을 더 열어 주세요.')) {
        feedbackText += '고관절을 더 열어 주세요.\n';
        setEvaluatedFeedback((prev) => [...prev, '고관절을 더 열어 주세요.']);
      } else {
        frameScore += 10;
        maxFrameScore += 10;
      }

      // 발목 각도 (knee -> ankle -> foot)
      const ankleAngle = calculateAngle(userLandmarks[14], userLandmarks[16], userLandmarks[18]);
      if (ankleAngle < 160 && !evaluatedFeedback.includes('발목을 더 굽혀 주세요.')) {
        feedbackText += '발목을 더 굽혀 주세요.\n';
        setEvaluatedFeedback((prev) => [...prev, '발목을 더 굽혀 주세요.']);
      } else {
        frameScore += 10;
        maxFrameScore += 10;
      }
    }

    // 점수 평균화 (100점 만점)
    const normalizedScore = (frameScore / maxFrameScore) * 100;

    setScore((prevScore) => prevScore + normalizedScore);
    setMaxScore((prevMaxScore) => prevMaxScore + 100); // 각 부위마다 100점이 추가됨
    setFeedback(feedbackText);
  };

  // 랜드마크를 캔버스에 그리기
  const drawLandmarks = (canvas, landmarks, color = 'red') => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (landmarks) {
      ctx.fillStyle = color;
      landmarks.forEach((landmark) => {
        const x = landmark.x * canvas.width;
        const y = landmark.y * canvas.height;

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
      });
    }
  };

  // 운동 평가와 웹캠 처리
  useEffect(() => {
    const processWebcam = async () => {
      if (videoRef.current && webcamCanvasRef.current && detector) {
        const poses = await detector.estimatePoses(videoRef.current);
        if (poses && poses[0] && poses[0].keypoints) {
          const userLandmarks = poses[0].keypoints.map((kp) => ({
            x: kp.x / videoRef.current.videoWidth,
            y: kp.y / videoRef.current.videoHeight,
          }));

          if (guideVideoRef.current) {
            // 가이드 영상에서 랜드마크 추출 로직 추가 필요
            const guideCanvas = document.createElement('canvas');
            guideCanvas.width = guideVideoRef.current.videoWidth;
            guideCanvas.height = guideVideoRef.current.videoHeight;
            const guideCtx = guideCanvas.getContext('2d');

            guideCtx.drawImage(guideVideoRef.current, 0, 0, guideCanvas.width, guideCanvas.height);
            const guideImageData = guideCtx.getImageData(0, 0, guideCanvas.width, guideCanvas.height);

            // 이곳에서 guideLandmarks 추출 로직을 추가해야 합니다. 현재 예시는 빈 배열을 사용합니다.
            const guideLandmarks = [];  // 추출된 가이드 랜드마크 데이터를 넣어야 합니다.

            // 사용자의 랜드마크와 가이드 랜드마크 비교
            evaluateExercise(userLandmarks, guideLandmarks);

            // 랜드마크 그리기
            drawLandmarks(webcamCanvasRef.current, userLandmarks, 'blue');
          }
        }
      }
    };

    const interval = setInterval(() => {
      processWebcam();
    }, 100);

    return () => clearInterval(interval);
  }, [currentFrame, detector]);

  useEffect(() => {
    if (guideVideoRef.current) {
      guideVideoRef.current.currentTime = currentFrame;
    }
  }, [currentFrame]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
      <h1>운동 자세 분석</h1>
      <h2>현재 프레임: {currentFrame + 1}</h2>
      <h3>점수: {Math.round(score)}</h3> {/* 총 점수 출력 */}
      <h3>피드백: {feedback}</h3>
      {exerciseComplete ? (
        <h3>운동 완료! 축하합니다!</h3>
      ) : (
        <h3>운동을 계속 진행하세요</h3>
      )}
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        {/* 가이드 영상 */}
        <video
          ref={guideVideoRef}
          src="/highknee.mp4"
          autoPlay
          loop
          muted
          width="640"
          height="480"
          style={{ border: '2px solid black', borderRadius: '8px' }}
        ></video>

        {/* 웹캠 캔버스 */}
        <div style={{ position: 'relative' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            width="640"
            height="480"
            style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
          ></video>
          <canvas
            ref={webcamCanvasRef}
            width="640"
            height="480"
            style={{ position: 'absolute', top: 0, left: 0, zIndex: 2 }}
          ></canvas>
        </div>
      </div>
    </div>
  );
}

export default Workout;