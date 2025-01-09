import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Workout from './workout.js';
import Animationtest from './animationtest.js';
import Feedback from './feedback.js';
import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 관리
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const CLIENT_ID = process.env.REACT_APP_GOOGLE_ID;
  const REDIRECT_URI = "http://localhost:3000";
  const SCOPE = process.env.REACT_APP_GOOGLE_SCOPE;
  const handleGoogleLogin = () => {
  const googleOAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}`;


  window.location.href = googleOAuthUrl;
};


  return (
    <div className="App">
      <header className="App-header">
        <h1>시니어 셀프 PT</h1> {/* 제목 추가 */}
        {loggedIn ? (
        <div>
          <p>Google로 로그인했습니다!</p>
        </div>
      ) : (
        <button onClick={handleGoogleLogin}>Google로 로그인</button>
      )}



      </header>
    </div>
  );
}

function Dashboard() {
  const [selectedMuscles, setSelectedMuscles] = useState([]); // 선택된 근육을 저장할 상태
   const navigate = useNavigate();
  // 근육을 선택할 때마다 상태를 업데이트
    const handleCheckboxChange = (event) => {
    const muscle = event.target.value;
    setSelectedMuscles((prevSelectedMuscles) => {
      if (prevSelectedMuscles.includes(muscle)) {
        // 이미 선택된 근육이 있을 경우, 제거
        return prevSelectedMuscles.filter(item => item !== muscle);
      } else {
        // 선택되지 않은 근육이면 추가
        return [...prevSelectedMuscles, muscle];
      }
    });
  };
  const startWorkout = () => {
  if (selectedMuscles.length === 0) {
    alert("먼저 운동할 근육을 선택해주세요!");
    return;
  }
  // 선택된 근육 정보를 전달하거나, 운동 페이지로 이동
  navigate('/workout', { state: { muscles: selectedMuscles } }); // 운동 페이지로 이동
};
  return (
    <div>
      <h3>로그인에 성공했어요 ^^</h3>
      <p>오늘도 즐겁게 운동을 시작해볼까요</p>
      <p>어떤 근육을 위주로 운동할 건지 선택해보세요~!!</p>

      {/* 체크박스들 */}
          <div>
            <label>
              <input
                type="checkbox"
                value="가슴"
                checked={selectedMuscles.includes("가슴")}
                onChange={handleCheckboxChange}
              />
              가슴
            </label>
            <label>
              <input
                type="checkbox"
                value="어깨"
                checked={selectedMuscles.includes("어깨")}
                onChange={handleCheckboxChange}
              />
              어깨
            </label>
            <label>
              <input
                type="checkbox"
                value="복부"
                checked={selectedMuscles.includes("복부")}
                onChange={handleCheckboxChange}
              />
              복부
            </label>
            <label>
              <input
                type="checkbox"
                value="등"
                checked={selectedMuscles.includes("등")}
                onChange={handleCheckboxChange}
              />
              등
            </label>
            <label>
              <input
                type="checkbox"
                value="팔근육"
                checked={selectedMuscles.includes("팔근육")}
                onChange={handleCheckboxChange}
              />
              팔근육
            </label>
            <label>
              <input
                type="checkbox"
                value="허벅지"
                checked={selectedMuscles.includes("허벅지")}
                onChange={handleCheckboxChange}
              />
              허벅지
            </label>
            <label>
              <input
                type="checkbox"
                value="팔목"
                checked={selectedMuscles.includes("팔목")}
                onChange={handleCheckboxChange}
              />
              팔목
            </label>
            <label>
              <input
                type="checkbox"
                value="발목"
                checked={selectedMuscles.includes("발목")}
                onChange={handleCheckboxChange}
              />
              발목
            </label>
            <label>
              <input
                type="checkbox"
                value="허리"
                checked={selectedMuscles.includes("허리")}
                onChange={handleCheckboxChange}
              />
              허리
            </label>
            <label>
              <input
                type="checkbox"
                value="종아리"
                checked={selectedMuscles.includes("종아리")}
                onChange={handleCheckboxChange}
              />
              종아리
            </label>
          </div>

          {/* 선택된 근육들 표시 */}
          <div>
            <h4>선택된 근육:</h4>
            <ul>
              {selectedMuscles.map((muscle, index) => (
                <li key={index}>{muscle}</li>
              ))}
            </ul>
          </div>
          {/* 운동 시작 버튼 */}
      <div>
        <button onClick={startWorkout}>운동 시작하기</button>
      </div>
        </div>
      );
    }


function AppWithRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workout" element={<Workout />} />
        <Route path="/animationtest" element={<Animationtest />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </Router>
  );
}

export default AppWithRouter;
