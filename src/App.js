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
import LocationComponent from './components/LocationComponent';
import GithubRedirectHandler from './components/GithubRedirectHandler';

function App() {
  const isLogin = useSelector((state) => state.user.isLogin);
  const dispatch = useDispatch();

  // App 시작 시, 브라우저 로컬 스토리지에 저장 되어 있는 토큰이 있는지를 확인 후,
  // 해당 토큰을 백엔드에 검증. 검증이 되면 바로 로그인 처리 / 안되면 로그인 페이지로 이동
  const tokenLoginCheck = async () => {
    try {
      const resToken = await axios.post('http://localhost:4000/user/token', {
        token: window.localStorage.getItem('token'),
      });

      // 토큰 검증 결과를 받아서 처리, 필요 데이터는 data 에 담아서 전송되므로 필요한 정보 세팅
      // console.log(resToken);
      // alert(resToken.data.msg);

      // 토큰 검증이 성공 적으로 검증이 되었으므로 리덕스에 로그인 처리
      // 해당 함수로 인하여 토큰이 있는 동안은, 로그인을 하지 않아도 바로 로그인이 처리
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

  // 리액트 앱이 시작 되면 바로 토큰 검증 로직 실행 -> 토큰 로그인 수행
  useEffect(() => {
    tokenLoginCheck();
  }, []);

  return (
    <>
      <GlobalStyle />
      {/* <LocationComponent /> */}
      <Routes>
        <Route path="/*" element={isLogin ? <Main /> : <Login />} />
        <Route
          path="/oauth/callback/kakao"
          element={<KakaoRedirectHandler />}
        />
        <Route
          path="/oauth/callback/github"
          element={<GithubRedirectHandler />}
        />
      </Routes>
    </>
  );
}

export default App;
