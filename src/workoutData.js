// 근육별 운동
const muscleTable = {
  가슴: ['푸쉬업', '체스트 프레스', '딥스'],
  어깨: ['숄더 프레스', '사이드 레터럴 레이즈', '프론트 레이즈'],
  복부: ['크런치', '플랭크', '레그 레이즈'],
  팔근육: ['바이셉 컬', '트라이셉 딥', '해머 컬'],
  허벅지: ['sitToStand', '런지', '레그 프레스'],
  팔목: ['팔목 스트레칭', '손목 컬'],
  발목: ['발목 돌리기', '발목 플렉스'],
  허리: ['백 익스텐션', '코브라 스트레칭', '슈퍼맨 자세'],
  종아리: ['카프 레이즈', '스탠딩 카프 스트레칭', '시티드 카프 레이즈'],
};

// 운동별 데이터
const exerciseTables = {
  sitToStand: {
    keypoints: { joint1: 11, joint2: 13, joint3: 15 }, 
    stages: { 
      DOWN: {
        condition: (angle) => angle <= 90,
        feedback: (angle) => angle < 110 && angle >= 90 ? "무릎을 더 굽히세요!" : "",
      },
      UP: {
        condition: (angle) => angle >= 180,
        feedback: (angle) => angle > 160 && angle <= 180 ? "완전히 일어서세요!" : "",
      },
    },
  },

  //오류 방지용 더미데이터터
  default: {
    keypoints: { joint1: 0, joint2: 0, joint3: 0 },
    stages: {
      DOWN: { condition: () => false, feedback: () => '' },
      UP: { condition: () => false, feedback: () => '' },
    },
  },
};

export { muscleTable, exerciseTables };