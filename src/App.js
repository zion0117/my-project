import logo from './logo.svg';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Workout from './workout.js';
import Muscleselection from './muscleselection.js';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 관리
  const navigate = useNavigate();
  const handleLogin = () => {
    setIsLoggedIn(true); // 로그인 상태로 변경
    navigate('/dashboard');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>시니어 셀프 PT</h1> {/* 제목 추가 */}

        {isLoggedIn ? (
          <p>로그인 성공</p> // 로그인 상태일 때 표시할 메시지
        ) : (
          <button onClick={handleLogin}>로그인</button> // 로그인 버튼
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
  const exercises = [
  {
    id: 1,
    name: "푸쉬업",
    targetMuscles: ["가슴", "어깨", "팔근육"],
  },
  {
    id: 2,
    name: "플랭크",
    targetMuscles: ["복부", "허리"],
  },
  {
    id: 3,
    name: "데드리프트",
    targetMuscles: ["등", "허리", "허벅지"],
  },
  {
    id: 4,
    name: "스쿼트",
    targetMuscles: ["허벅지", "종아리", "발목"],
  },
  {
    id: 5,
    name: "팔굽혀 펴기",
    targetMuscles: ["가슴", "팔근육"],
  },
];
  const startWorkout = () => {
  if (selectedMuscles.length === 0) {
    alert("먼저 운동할 근육을 선택해주세요!");
    return;
  }
  // 선택된 근육 정보를 전달하거나, 운동 페이지로 이동
  navigate('/muscleselection', { state: { muscles: selectedMuscles } }); // 운동 페이지로 이동
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
        <Route path="/muscleselection" element={<Muscleselection />} />
      </Routes>
    </Router>
  );
}

export default AppWithRouter;
