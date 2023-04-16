import axios from 'axios';
import { useEffect } from 'react';
import { login } from '../store/modules/user';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function GithubRedirectHandler() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const gitHubLogin = async () => {
    try {
      const resGitLogin = await axios.post(
        'http://localhost:4000/user/gitlogin',
        {
          token: CODE,
        },
      );

      // 로그인 성공 메세지 전달
      console.log('깃헙 로그인 성공');

      // 깃헙 로그인 정보를 바탕으로 생성한 토큰을 LocalStorage 에 저장
      window.localStorage.setItem('token', resGitLogin.data.token);

      // 로그인 처리
      dispatch(login({ id: resGitLogin.data.userID }));
      navigate('/');
    } catch (err) {
      console.log('깃헙 로그인 에러 발생', err);
      navigate('/');
    }
  };

  useEffect(() => {
    // 깃헙에서 제공하는 코드를 분리하여 해당 코드를 깃헙 로그인을 처리하는 백엔드로 전송
    const CODE = new URL(window.location.href).searchParams.get('code');
    console.log(CODE);

    gitHubLogin();
  }, []);
}
