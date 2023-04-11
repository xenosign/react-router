import axios from 'axios';
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { login } from '../store/modules/user';

export default function Login() {
  // REST API 키를 입력 해야 합니다!
  const KAKAO_CLIENT_ID = '2be90ab71a1f36d735f12cd91b53a982';
  const KAKAO_REDIRECT_URI = 'http://localhost:3000/oauth/callback/kakao';
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
  const KAKAO_LOGOUT_URI = 'http://localhost:3000';
  const KAKAO_LOGOUT_URL = `https://kauth.kakao.com/oauth/logout?client_id=${KAKAO_CLIENT_ID}&logout_redirect_uri=${KAKAO_LOGOUT_URI}`;

  const loginIdInput = useRef();
  const loginPwInput = useRef();
  const registerIdInput = useRef();
  const registerPwInput = useRef();

  const dispatch = useDispatch();

  const loginUser = async () => {
    if (!loginIdInput.current.value || !loginPwInput.current.value)
      return alert('필수 값을 입력해 주세요');

    const resLogin = await axios.post('http://localhost:4000/user/login', {
      id: loginIdInput.current.value,
      password: loginPwInput.current.value,
    });

    if (resLogin.status !== 200) return alert(resLogin.data);

    dispatch(
      login({
        id: loginIdInput.current.value,
        password: loginPwInput.current.value,
      }),
    );
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
          password: registerPwInput.current.value,
        }),
      );
    } catch (err) {
      alert(err.response.data);
    }

    // const resRegister = await fetch('http://localhost:4000/user/register', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     id: registerIdInput.current.value,
    //     password: registerPwInput.current.value,
    //   }),
    // });

    // if (resRegister.status !== 200) return alert(await resRegister.json());

    // alert(await resRegister.json());
    // dispatch(
    //   login({
    //     id: registerIdInput.current.value,
    //     password: registerPwInput.current.value,
    //   }),
    // );
  };

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
      <Link to={KAKAO_AUTH_URL}>카카오 로그인</Link>
      <Link to={KAKAO_LOGOUT_URL}>카카오 로그 아웃</Link>
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
