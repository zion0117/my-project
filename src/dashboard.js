import { useState } from 'react';
import './App.css';

function dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 관리

  const handleLogin = () => {
    setIsLoggedIn(true); // 로그인 상태로 변경
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>dashboard</h1> {/* 제목 추가 */}

        {isLoggedIn ? (
          <p>로그인 성공</p> // 로그인 상태일 때 표시할 메시지
        ) : (
          <button onClick={handleLogin}>로그인</button> // 로그인 버튼
        )}


        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default dashboard;
