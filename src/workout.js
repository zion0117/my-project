import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import * as mpPose from '@mediapipe/pose';
import * as camUtils from '@mediapipe/camera_utils';

function Workout() {
  const location = useLocation();
  const navigate = useNavigate();

  // 선택된 근육 그룹을 가져오기
  const { state } = location;
  const selectedMuscles = state?.muscles || []; // 전달받은 근육 그룹이 없으면 빈 배열로 초기화

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [isExerciseComplete, setIsExerciseComplete] = useState(false);

  // 웹캠 Ref
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // 운동 데이터
  const muscleExercises = {
    가슴: [
      { name: '푸쉬업', guideVideo: '/highknee.mp4' },
      { name: '체스트 프레스', guideVideo: '/highknee.mp4' },
      { name: '딥스', guideVideo: '/highknee.mp4' },
    ],
    어깨: [
      { name: '숄더 프레스', guideVideo: '/highknee.mp4' },
      { name: '사이드 레터럴 레이즈', guideVideo: '/highknee.mp4' },
      { name: '프론트 레이즈', guideVideo: '/highknee.mp4' },
    ],
    복부: [
      { name: '크런치', guideVideo: '/highknee.mp4' },
      { name: '플랭크', guideVideo: '/highknee.mp4' },
      { name: '레그 레이즈', guideVideo: '/highknee.mp4' },
    ],
    팔근육: [
      { name: '바이셉 컬', guideVideo: '/highknee.mp4' },
      { name: '트라이셉 딥', guideVideo: '/highknee.mp4' },
      { name: '해머 컬', guideVideo: '/highknee.mp4' },
    ],
    허벅지: [
      { name: '스쿼트', guideVideo: '/highknee.mp4' },
      { name: '런지', guideVideo: '/highknee.mp4' },
      { name: '레그 프레스', guideVideo: '/highknee.mp4' },
    ],
    팔목: [
      { name: '팔목 스트레칭', guideVideo: '/highknee.mp4' },
      { name: '손목 컬', guideVideo: '/highknee.mp4' },
    ],
    발목: [
      { name: '발목 돌리기', guideVideo: '/highknee.mp4' },
      { name: '발목 플렉스', guideVideo: '/highknee.mp4' },
    ],
    허리: [
      { name: '백 익스텐션', guideVideo: '/highknee.mp4' },
      { name: '코브라 스트레칭', guideVideo: '/highknee.mp4' },
      { name: '슈퍼맨 자세', guideVideo: '/highknee.mp4' },
    ],
    종아리: [
      { name: '카프 레이즈', guideVideo: '/highknee.mp4' },
      { name: '스탠딩 카프 스트레칭', guideVideo: '/highknee.mp4' },
      { name: '시티드 카프 레이즈', guideVideo: '/highknee.mp4' },
    ],
  };

  // 선택된 근육에 따라 운동 설정
  useEffect(() => {
    if (selectedMuscles.length > 0) {
      const selected = selectedMuscles.flatMap((muscle) => muscleExercises[muscle] || []);
      const shuffledExercises = [...selected].sort(() => 0.5 - Math.random());
      setSelectedExercises(shuffledExercises.slice(0, 10)); // 10개 운동 랜덤 선택
    }
  }, [selectedMuscles]);

  // 웹캠 및 Mediapipe 설정
  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('웹캠 사용 불가:', err);
      }
    };

    startWebcam();

    const pose = new mpPose.Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    const onResults = (results) => {
      const canvasCtx = canvasRef.current.getContext('2d');
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasCtx.drawImage(
        results.image, 0, 0, canvasRef.current.width, canvasRef.current.height
      );
      mpPose.drawLandmarks(canvasCtx, results.poseLandmarks, mpPose.POSE_CONNECTIONS);

      if (results.poseLandmarks) {
        // 간단한 피드백 로직 예제
        const leftKnee = results.poseLandmarks[25];
        const rightKnee = results.poseLandmarks[26];
        if (leftKnee.visibility < 0.5 || rightKnee.visibility < 0.5) {
          setFeedbackMessage('무릎을 카메라에 더 가까이!');
        } else {
          setFeedbackMessage('좋은 자세입니다!');
        }
      }
    };

    pose.onResults(onResults);

    if (videoRef.current) {
      const camera = new camUtils.Camera(videoRef.current, {
        onFrame: async () => {
          await pose.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  // 다음 운동으로 이동
  const nextExercise = () => {
    if (currentExerciseIndex < selectedExercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      setIsExerciseComplete(true);
    }
  };

  return (
    <div>
      {isExerciseComplete ? (
        <div>
          <h1>운동 완료!</h1>
          <button onClick={() => navigate('/feedback')}>피드백확인</button>
        </div>
      ) : selectedExercises.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2>현재 운동: {selectedExercises[currentExerciseIndex]?.name}</h2>
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
            {/* 운동 가이드 영상 */}
            <div>
              <video
                src={selectedExercises[currentExerciseIndex]?.guideVideo}
                controls
                autoPlay
                style={{ width: '400px', height: '300px', border: '1px solid black' }}
              />
              <p>운동 가이드</p>
            </div>
            {/* 웹캠 영상 */}
            <div style={{ position: 'relative' }}>
              <video
                ref={videoRef}
                autoPlay
                muted
                style={{ width: '400px', height: '300px', border: '1px solid black' }}
              />
              <canvas
                ref={canvasRef}
                width="400"
                height="300"
                style={{ position: 'absolute', top: 0, left: 0 }}
              />
              <p>내 자세</p>
            </div>
          </div>
          <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{feedbackMessage}</p>
          <button onClick={nextExercise} style={{ marginTop: '20px' }}>다음 운동</button>
        </div>
      ) : (
        <h2>선택된 운동이 없습니다. 대시보드로 돌아가세요.</h2>
      )}
    </div>
  );
}

export default Workout;
