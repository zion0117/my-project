import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Workout() {
  const location = useLocation();
  const navigate = useNavigate();

  // 선택된 근육 그룹을 가져오기
  const { state } = location;
  const selectedMuscles = state?.muscles || []; // 전달받은 근육 그룹이 없으면 빈 배열로 초기화

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [isExerciseComplete, setIsExerciseComplete] = useState(false);

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

  // 운동 페이지 UI
  return (
    <div>
      {isExerciseComplete ? (
        <div>
          <h1>운동 완료!</h1>
          <button onClick={() => navigate('/feedback')}>피드백확인</button>
        </div>
      ) : selectedExercises.length > 0 ? (
        <div>
          <h2>현재 운동: {selectedExercises[currentExerciseIndex]?.name}</h2>
          <video src={selectedExercises[currentExerciseIndex]?.guideVideo} controls autoPlay />
          <button onClick={nextExercise}>다음 운동</button>
        </div>
      ) : (
        <h2>선택된 운동이 없습니다. 대시보드로 돌아가세요.</h2>
      )}
    </div>
  );
}

export default Workout;
