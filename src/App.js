import React from 'react';
import GlobalStyle from './components/GlobalStyle';
import { useSelector } from 'react-redux';
import Mbti from './pages/Mbti';
import Show from './pages/Show';
import Main from './pages/Main';
import Login from './pages/Login';
import { Route, Routes } from 'react-router-dom';
import KakaoRedirectHandler from './components/KakaoRedirectHandler';
import Weather from './components/Weather';

function App() {
  const isLogin = useSelector((state) => state.user.isLogin);

  return (
    <>
      <GlobalStyle />
      <Weather />
      <Routes>
        <Route path="/" element={isLogin ? <Main /> : <Login />} />
        <Route
          path="/oauth/callback/kakao"
          element={<KakaoRedirectHandler />}
        />
      </Routes>
    </>
  );
}

export default App;
