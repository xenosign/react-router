import React from 'react';
import GlobalStyle from './components/GlobalStyle';
import { useSelector } from 'react-redux';
import Mbti from './pages/Mbti';
import Show from './pages/Show';
import Main from './pages/Main';
import Login from './pages/Login';
import KakaoRedirectHandler from './components/KakaoRedirectHandler';

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
