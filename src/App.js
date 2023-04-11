import React, { useEffect } from 'react';
import GlobalStyle from './components/GlobalStyle';
import { useDispatch, useSelector } from 'react-redux';
import Mbti from './pages/Mbti';
import Show from './pages/Show';
import Main from './pages/Main';
import Login from './pages/Login';
import KakaoRedirectHandler from './components/KakaoRedirectHandler';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
import { login } from './store/modules/user';

function App() {
  const isLogin = useSelector((state) => state.user.isLogin);
  const dispatch = useDispatch();

  const tokenLoginCheck = async () => {
    try {
      const resToken = await axios.post('http://localhost:4000/user/token', {
        token: window.localStorage.getItem('token'),
      });

      console.log(resToken);
      dispatch(
        login({
          id: resToken.data.userID,
        }),
      );
    } catch (err) {
      console.log(err);
      return;
    }
  };

  useEffect(() => {
    tokenLoginCheck();
  }, []);

  return (
    <>
      <GlobalStyle />
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
