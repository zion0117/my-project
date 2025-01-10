// 운동 데이터
const muscleExercises = {
  가슴: ['푸쉬업', '체스트 프레스', '딥스'],
  어깨: ['숄더 프레스', '사이드 레터럴 레이즈', '프론트 레이즈'],
  복부: ['크런치', '플랭크', '레그 레이즈'],
  팔근육: ['바이셉 컬', '트라이셉 딥', '해머 컬'],
  허벅지: ['스쿼트', '런지', '레그 프레스'],
  팔목: ['팔목 스트레칭', '손목 컬'],
  발목: ['발목 돌리기', '발목 플렉스'],
  허리: ['백 익스텐션', '코브라 스트레칭', '슈퍼맨 자세'],
  종아리: ['카프 레이즈', '스탠딩 카프 스트레칭', '시티드 카프 레이즈'],
};

// 가이드 영상 맵핑 (외부 파일로 분리 추천)
const guideVideos = {
  푸쉬업: '/assets/highknee.mp4',
  체스트 프레스: '/assets/chestpress.mp4',
  딥스: '/assets/dips.mp4',
  // 나머지 운동도 추가
};

// 랜덤 운동 선택 로직
const selectRandomExercises = (selectedMuscles, count = 10) => {
  const selectedExercises = selectedMuscles.flatMap((muscle) => muscleExercises[muscle] || []);
  return [...selectedExercises].sort(() => 0.5 - Math.random()).slice(0, count);
};

// React 컴포넌트
useEffect(() => {
  if (selectedMuscles.length > 0) {
    setSelectedExercises(selectRandomExercises(selectedMuscles));
  }
}, [selectedMuscles]);
