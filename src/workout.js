import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

  const location = useLocation();
  const { state } = location;
  const selectedMuscles = state?.muscles || []; // 전달받은 근육 그룹이 없으면 빈 배열로 초기화
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [isExerciseComplete, setIsExerciseComplete] = useState(false);

  const navigate = useNavigate();

  // 운동 데이터
const muscleExercises = {
    가슴: [
      { name: '푸쉬업', guideVideo: '/highknee.mp4' },
      { name: '체스트 프레스', guideVideo: '/highknee.mp4' },
      { name: '딥스', guideVideo: '/highknee.mp4' }, // 추가
    ],
    어깨: [
      { name: '숄더 프레스', guideVideo: '/highknee.mp4' },
      { name: '사이드 레터럴 레이즈', guideVideo: '/highknee.mp4' },
      { name: '프론트 레이즈', guideVideo: '/highknee.mp4' }, // 추가
    ],
    복부: [
      { name: '크런치', guideVideo: '/highknee.mp4' },
      { name: '플랭크', guideVideo: '/highknee.mp4' },
      { name: '레그 레이즈', guideVideo: '/highknee.mp4' }, // 추가
    ],
    팔근육: [
      { name: '바이셉 컬', guideVideo: '/highknee.mp4' },
      { name: '트라이셉 딥', guideVideo: '/highknee.mp4' },
      { name: '해머 컬', guideVideo: '/highknee.mp4' }, // 추가
    ],
    허벅지: [
      { name: '스쿼트', guideVideo: '/highknee.mp4' },
      { name: '런지', guideVideo: '/highknee.mp4' },
      { name: '레그 프레스', guideVideo: '/highknee.mp4' }, // 추가
    ],
    팔목: [
      { name: '팔목 스트레칭', guideVideo: '/highknee.mp4' },
      { name: '손목 컬', guideVideo: '/highknee.mp4' }, // 추가
    ],
    발목: [
      { name: '발목 돌리기', guideVideo: '/highknee.mp4' },
      { name: '발목 플렉스', guideVideo: '/highknee.mp4' }, // 추가
    ],
    허리: [
      { name: '백 익스텐션', guideVideo: '/highknee.mp4' },
      { name: '코브라 스트레칭', guideVideo: '/highknee.mp4' },
      { name: '슈퍼맨 자세', guideVideo: '/highknee.mp4' }, // 추가
    ],
    종아리: [
      { name: '카프 레이즈', guideVideo: '/highknee.mp4' },
      { name: '스탠딩 카프 스트레칭', guideVideo: '/highknee.mp4' },
      { name: '시티드 카프 레이즈', guideVideo: '/highknee.mp4' }, // 추가
    ],
    };

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

  // 선택된 근육에 따라 운동 설정
  useEffect(() => {
  if (selectedMuscles.length > 0) {
    const selected = selectedMuscles.flatMap((muscle) => muscleExercises[muscle] || []);
    const shuffledExercises = [...selected].sort(() => 0.5 - Math.random());
    setSelectedExercises(shuffledExercises.slice(0, 10)); // 10개 운동 랜덤 선택
  }
}, [selectedMuscles]);

// 다음 운동으로 이동
const nextExercise = () => {
  if (currentExerciseIndex < selectedExercises.length - 1) {
    setCurrentExerciseIndex(currentExerciseIndex + 1);
  } else {
    setIsExerciseComplete(true);
  }
};


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
      if (elbowAngle < 150) {
        if (!evaluatedFeedback.includes('팔꿈치를 더 구부려 주세요.')) {
          feedbackText += '팔꿈치를 더 구부려 주세요.\n';
          setEvaluatedFeedback((prev) => [...prev, '팔꿈치를 더 구부려 주세요.']);
        }
        // 각도 차이에 비례하여 점수 차감 (각도가 작을수록 점수 차감)
        frameScore -= Math.max(0, (150 - elbowAngle) / 10);  // 각도 차이에 비례하여 점수 차감
      } else {
        // 각도가 150도 이상일 경우 점수 부여
        let score = Math.min(10, (elbowAngle - 150) / 5);  // 각도가 150도를 넘으면 점수 부여
        score = Math.max(0, score);  // 점수는 0 이상이어야 함
        frameScore += score;
        maxFrameScore += 10;
      }

      // 무릎 각도 (hip -> knee -> ankle)
      const kneeAngle = calculateAngle(userLandmarks[12], userLandmarks[14], userLandmarks[16]);
      if (kneeAngle < 150) {
        if (!evaluatedFeedback.includes('무릎을 더 구부려 주세요.')) {
          feedbackText += '무릎을 더 구부려 주세요.\n';
          setEvaluatedFeedback((prev) => [...prev, '무릎을 더 구부려 주세요.']);
        }
        frameScore -= Math.max(0, (150 - kneeAngle) / 10);  // 각도 차이에 비례하여 점수 차감
      } else {
        // 각도가 150도를 넘으면 점수 부여
        let score = Math.min(10, (kneeAngle - 150) / 5); // 각도가 150도를 넘으면 점수 부여
        score = Math.max(0, score);  // 점수는 0 이상이어야 함
        frameScore += score;
        maxFrameScore += 10;
      }

      // 어깨 각도 (elbow -> shoulder -> hip)
      const shoulderAngle = calculateAngle(userLandmarks[5], userLandmarks[6], userLandmarks[11]);
      if (shoulderAngle > 150) {
        if (!evaluatedFeedback.includes('어깨를 더 내리세요.')) {
          feedbackText += '어깨를 더 내리세요.\n';
          setEvaluatedFeedback((prev) => [...prev, '어깨를 더 내리세요.']);
        }
        // 어깨 각도가 크면 점수 차감
        frameScore -= Math.max(0, (shoulderAngle - 150) / 10);
      } else {
        // 어깨 각도가 150도 미만일 때 점수 부여
        let score = Math.min(10, (150 - shoulderAngle) / 5); // 어깨 각도가 150도 미만일 때 점수 부여
        score = Math.max(0, score);  // 점수는 0 이상이어야 함
        frameScore += score;
        maxFrameScore += 10;
      }

      // 고관절 각도 (knee -> hip -> shoulder)
      const hipAngle = calculateAngle(userLandmarks[12], userLandmarks[11], userLandmarks[23]);
      if (hipAngle < 90) {
        if (!evaluatedFeedback.includes('고관절을 더 열어 주세요.')) {
          feedbackText += '고관절을 더 열어 주세요.\n';
          setEvaluatedFeedback((prev) => [...prev, '고관절을 더 열어 주세요.']);
        }
        frameScore -= Math.max(0, (90 - hipAngle) / 10);  // 고관절 각도가 작을수록 점수 차감
      } else {
        // 고관절 각도가 90도를 넘으면 점수 부여
        let score = Math.min(10, (hipAngle - 90) / 5); // 고관절 각도가 90도를 넘으면 점수 부여
        score = Math.max(0, score);  // 점수는 0 이상이어야 함
        frameScore += score;
        maxFrameScore += 10;
      }

      // 발목 각도 (knee -> ankle -> foot)
      const ankleAngle = calculateAngle(userLandmarks[14], userLandmarks[16], userLandmarks[18]);
      if (ankleAngle < 160) {
        if (!evaluatedFeedback.includes('발목을 더 굽혀 주세요.')) {
          feedbackText += '발목을 더 굽혀 주세요.\n';
          setEvaluatedFeedback((prev) => [...prev, '발목을 더 굽혀 주세요.']);
        }
        frameScore -= Math.max(0, (160 - ankleAngle) / 10);  // 발목 각도가 작을수록 점수 차감
      } else {
        // 발목 각도가 160도를 넘으면 점수 부여
        let score = Math.min(10, (ankleAngle - 160) / 5); // 발목 각도가 160도를 넘으면 점수 부여
        score = Math.max(0, score);  // 점수는 0 이상이어야 함
        frameScore += score;
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
      <h2></h2>
      <h3>점수: {Math.round(score)}</h3> {/* 총 점수 출력 */}
      <h3>피드백: {feedback}</h3>
      {exerciseComplete ? (
        <h3>운동 완료! 축하합니다!</h3>
      ) : (
        <h3>운동을 계속 진행하세요</h3>
      )}
      <div>
      {isExerciseComplete ? (
        <div>
          <h1>운동 완료!</h1>
          <button onClick={() => navigate('/feedback')}>피드백확인</button>
        </div>
      ) : selectedExercises.length > 0 ? (
        <div>
          <h2>현재 운동: {selectedExercises[currentExerciseIndex]?.name}</h2>

          <button onClick={nextExercise}>다음 운동</button>
        </div>
      ) : (
        <h2>선택된 운동이 없습니다. 대시보드로 돌아가세요.</h2>
      )}
    </div>
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        {/* 가이드 영상 */}
        <video
          ref={guideVideoRef}
          src="/highknee.mp4"
          autoPlay
          loop
          muted
          width="300"
          height="300"
          style={{ border: '2px solid black', borderRadius: '8px' }}
        ></video>

        {/* 웹캠 캔버스 */}
        <div style={{ position: 'relative' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            width="700"
            height="700"
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
