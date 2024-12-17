import React, { useState } from 'react';

const Feedback = ({ completedExercise, duration, sets, reps }) => {
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState('');

  const handleSubmitFeedback = () => {
    console.log('Feedback Submitted:', { rating, comment });
    alert('피드백 감사합니다! 다음 운동도 화이팅!');
  };

  return (
    <div style={styles.container}>
      <h1>운동 완료!</h1>
      <h2>💪 {completedExercise} 운동이 종료되었습니다.</h2>
      <p>⏱ 소요 시간: {duration}분</p>
      <p>🔄 세트 수: {sets} / 반복 횟수: {reps}</p>

      <h3>운동에 대한 평가를 남겨주세요:</h3>
      <div>
        <label>⭐ 점수: </label>
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value="">선택</option>
          <option value="1">1 - 너무 힘들다</option>
          <option value="2">2 - 보통</option>
          <option value="3">3 - 좋다</option>
          <option value="4">4 - 매우 좋다</option>
          <option value="5">5 - 완벽하다!</option>
        </select>
      </div>

      <div style={{ marginTop: '10px' }}>
        <label>📝 의견:</label>
        <textarea
          placeholder="자유롭게 의견을 남겨주세요."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
          cols="30"
        />
      </div>

      <button onClick={handleSubmitFeedback} style={styles.button}>
        피드백 제출
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Feedback;
