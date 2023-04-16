import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../store/modules/user';

// 네이버 로그인용, index.html 에 불러온 모듈을 불러온다
const { naver } = window;

export default function Login() {
  // REST API 키를 입력 해야 합니다!
  const KAKAO_CLIENT_ID = '2be90ab71a1f36d735f12cd91b53a982';
  const KAKAO_REDIRECT_URI = 'http://localhost:3000/oauth/callback/kakao';
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
  const KAKAO_LOGOUT_URI = 'http://localhost:3000';
  const KAKAO_LOGOUT_URL = `https://kauth.kakao.com/oauth/logout?client_id=${KAKAO_CLIENT_ID}&logout_redirect_uri=${KAKAO_LOGOUT_URI}`;

  // 깃헙 로그인 용 정보, 직접 만든 클라이언트 정보를 등록해 주세요!
  const GITHUB_CLIENT_ID = 'Iv1.1b017e86d5470be6';
  const GITHUB_REDIRECT_URI = 'http://localhost:3000/oauth/callback/github';
  const GITHUB_LOGIN_URL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}`;

  const loginIdInput = useRef();
  const loginPwInput = useRef();
  const registerIdInput = useRef();
  const registerPwInput = useRef();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginUser = async () => {
    try {
      if (!loginIdInput.current.value || !loginPwInput.current.value)
        return alert('필수 값을 입력해 주세요');

      const resLogin = await axios.post('http://localhost:4000/user/login', {
        id: loginIdInput.current.value,
        password: loginPwInput.current.value,
      });

      alert(resLogin.data.message);

      // 로그인이 성공하면 응답 데이터 token 프로퍼티에 accessToken 이 전달 되어 오므로
      // 로컬 스토리지에 로그인 정보가 저장 된 토큰을 저장
      // 해당 정보를 통하여 리액트 실행 시, 토큰을 백엔드 서버에 검증하여 자동 로그인을 처리
      window.localStorage.setItem('token', resLogin.data.token);

      return dispatch(
        login({
          id: loginIdInput.current.value,
        }),
      );
    } catch (err) {
      console.log(err);
      return alert(err.message);
    }
  };

  const checkDuplicateUser = async () => {
    try {
      if (!registerIdInput.current.value) return alert('ID 를 입력해 주세요');

      const resRegister = await axios.post(
        'http://localhost:4000/user/duplicate',
        {
          id: registerIdInput.current.value,
        },
      );

      alert(resRegister.data);
    } catch (err) {
      alert(err.response.data);
    }
  };

  const registerUser = async () => {
    try {
      if (!registerIdInput.current.value || !registerPwInput.current.value)
        return alert('필수 값을 입력해 주세요');

      const resRegister = await axios.post(
        'http://localhost:4000/user/register',
        {
          id: registerIdInput.current.value,
          password: registerPwInput.current.value,
        },
      );

      alert(resRegister.data);
      dispatch(
        login({
          id: registerIdInput.current.value,
        }),
      );
    } catch (err) {
      alert(err.response.data);
    }
  };

  // 네이버 로그인 구현
  const NAVER_CLIENT_ID = '_UmPcWI1byBAwXFr7Z3Y';
  const NAVER_REDIRECT_URL = 'http://localhost:3000/oauth/callback/naver';

  // 네이버 로그인 기능을 전역으로 쓰기 위해 선언
  let naverLogin;

  // 네이버 로그인 기능을 초기화 하기 위한 함수
  const initializeNaverLogin = () => {
    // 필요한 정보를 넣어주기
    naverLogin = new naver.LoginWithNaverId({
      clientId: NAVER_CLIENT_ID, // 발급받은 client ID
      callbackUrl: NAVER_REDIRECT_URL, // app 등록할 때 callbackurl에 추가해주었던 url
      isPopup: false, // popup 형식으로 띄울것인지 설정
      loginButton: { color: 'white', type: 1, height: '47' }, // 버튼의 스타일, 타입, 크기를 지정
    });
    // 입력한 값을 바탕으로 네이버 로그인 초기화 함수 실행
    naverLogin.init();
  };

  // 네이버에서 전달 한 TOKEN 을 받아서, 네이버 사용자 정보를 조회하기 위한 함수
  const getNaverToken = async () => {
    try {
      // 네이버에서 문자열로 전달한 TOKEN 을 분리
      const TOKEN = window.location.href.split('=')[1].split('&')[0];

      // 토큰이 들어온 경우, naverLogin.getLoginStatus 함수를 통해 콜백으로 네이버 유저의 정보를 받아옴
      if (TOKEN) {
        naverLogin.getLoginStatus(async (status) => {
          // 유저 정보가 없을 경우 에러 출력 후 종료
          if (!status)
            return console.log('네이버 로그인 사용자 정보 조회 실패');

          console.log(naverLogin.user); // 네이버 사용자 정보 조회

          const resNaverLogin = await axios.post(
            'http://localhost:4000/user/naverlogin',
            {
              userID: naverLogin.user.email,
            },
          );

          window.localStorage.setItem('token', resNaverLogin.data.token);

          dispatch(
            login({
              id: naverLogin.user.email,
            }),
          );
          return navigate('/');
        });
      } else {
        console.log('네이버 로그인 토큰 발행 실패');
        return navigate('/');
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    initializeNaverLogin();
    getNaverToken();
  }, []);

  return (
    <>
      {/* 로그인 파트 */}
      <h1>로그인 파트입니다</h1>
      아이디 : <input type="text" ref={loginIdInput} />
      <br />
      <br />
      비밀번호 : <input type="password" ref={loginPwInput} />
      <br />
      <br />
      <button onClick={loginUser}>로그인</button>{' '}
      <Link to={KAKAO_AUTH_URL}>카카오 로그인</Link>{' '}
      <Link to={KAKAO_LOGOUT_URL}>카카오 로그 아웃</Link>{' '}
      <Link to={GITHUB_LOGIN_URL}>깃 로그인</Link>
      {/* 네이버 아이디 로그인을 위한 div 설정 */}
      <div id="naverIdLogin"></div>
      <br />
      <br />
      {/* 회원 가입 파트 */}
      <h1>회원 가입 파트입니다</h1>
      아이디 : <input type="text" ref={registerIdInput} />
      <button onClick={checkDuplicateUser}>중복 확인</button>
      <br />
      <br />
      비밀번호 : <input type="password" ref={registerPwInput} />
      <br />
      <br />
      <button onClick={registerUser}>회원 가입</button>
      <br />
      <br />
    </>
  );
}
