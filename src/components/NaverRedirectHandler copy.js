import axios from 'axios';
import { useEffect } from 'react';
import { login } from '../store/modules/user';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function NaverRedirectHandler() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // 네이버에서 제공하는 코드를 분리하여 해당 코드를 깃헙 로그인을 처리하는 백엔드로 전송
    const naverLogin = async () => {
      try {
        const CODE = window.location.href.split('=')[1].split('&')[0];
        const STATE = window.location.href.split('=')[2].split('&')[0];

        const resNaverLogin = await axios.post(
          'http://localhost:4000/user/naverlogin',
          {
            CODE,
            STATE,
          },
        );

        // 로그인 성공 메세지 전달
        console.log('네이버 로그인 성공');

        // 네이버 로그인 정보를 바탕으로 생성한 토큰을 LocalStorage 에 저장
        window.localStorage.setItem('token', resNaverLogin.data.token);

        // 로그인 처리
        dispatch(login({ id: resNaverLogin.data.userID }));
        navigate('/');
      } catch (err) {
        console.log('네이버 로그인 에러 발생', err);
        navigate('/');
      }
    };

    naverLogin();
  }, []);
}
