// 선택된 근육에 따른 운동 -> 랜덤으로 운동 10개 선택
const muscleExercises = {
  가슴: ['푸쉬업', '체스트 프레스', '딥스'],
  어깨: ['숄더 프레스', '사이드 레터럴 레이즈', '프론트 레이즈'],
  복부: ['크런치', '플랭크', '레그 레이즈'],
  팔근육: ['바이셉 컬', '트라이셉 딥', '해머 컬'],
  허벅지: ['Sit-to-Stand', '런지', '레그 프레스'],
  팔목: ['팔목 스트레칭', '손목 컬'],
  발목: ['발목 돌리기', '발목 플렉스'],
  허리: ['백 익스텐션', '코브라 스트레칭', '슈퍼맨 자세'],
  종아리: ['카프 레이즈', '스탠딩 카프 스트레칭', '시티드 카프 레이즈'],
};

// 운동별 데이터
const feedback = {
  sitToStand: {
    name: "Sit-to-Stand", 
    guideVideo: "/assets/highknee.mp4", //가이드 영상->출력
    keypoints: { joint1: 11, joint2: 13, joint3: 15 }, //관절(엉덩이, 무릎, 발목)->angle
    phases: { //단계->카운트
      DOWN: (angle) => angle <= 90, 
      UP: (angle) => angle >= 180, 
    },
    feedback: { //피드백->출력+점수
      DOWN: {
        condition: (angle) => angle < 110 && angle >= 90, 
        message: "무릎을 더 굽히세요!",
      },
      UP: {
        condition: (angle) => angle > 160 && angle <= 180,
        message: "완전히 일어서세요!",
      },
    },
  },
};