import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/modules/user';

const KakaoRedirectHandler = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // 카카오가 콜백 url 로 전달한 코드(CODE)를 분리하는 코드
    const CODE = new URL(window.location.href).searchParams.get('code');
    const GRANT_TYPE = 'authorization_code';
    // REST API 키를 입력 해야 합니다!
    const KAKAO_CLIENT_ID = '2be90ab71a1f36d735f12cd91b53a982';
    const KAKAO_REDIRECT_URI = 'http://localhost:3000/oauth/callback/kakao';

    console.log(CODE);

    // 카카오에서 받은 코드(CODE)를 카카오 서버에 요청하여 카카오용 AccessToken 을 발행하는 요청 보내기
    async function loginFetch() {
      const tokenResponse = await fetch(
        `https://kauth.kakao.com/oauth/token?grant_type=${GRANT_TYPE}&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&code=${CODE}`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      );

      // 카카오에 보낸 요청이 정상적으로 들어 왔을 경우(status 가 200), 해당 응답에서 AccessToken 을 받는다
      if (tokenResponse.status === 200) {
        const tokenData = await tokenResponse.json();

        console.log('1 TokenData', tokenData);

        // 카카오 서버로 부터 받은 AccessToken을 AccessToken을 실제 카카오 사용자 정보로 풀어주는 API로 보내서 회원 정보 요청
        const userResponese = await fetch(`https://kapi.kakao.com/v2/user/me`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        });

        // 카카오에 보낸 요청이 정상적으로 들어 왔을 경우(status 가 200), 해당 응답에서 사용자 정보를 받는다
        if (userResponese.status === 200) {
          const userKaKaoInfo = await userResponese.json();

          console.log('2 userKaKaoInfo', userKaKaoInfo);

          const userLoginInfo = {
            userID: userKaKaoInfo.kakao_account.email,
          };

          // 카카오 정보 중 email 을 id 로 지정하여 백엔드에 요청 처리
          // 백엔드는 해당 email 로 회원 가입이 이미 되어 있으면? >> 로그인 처리 및 토큰 발행
          // 백엔드는 해당 email 로 회원 가입이 이미 되어 있지 않으면? >> 회원 가입 및 로그인 처리, 토큰 발행
          const registerResponse = await fetch(
            'http://localhost:4000/user/kakaologin',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(userLoginInfo),
            },
          );

          // 백엔드에서 로그인 or 회원 가입 처리 완료 시, 토큰을 로컬 스토리지에 저장 및 로그인 처리
          if (registerResponse.status === 200) {
            // 백엔드에서 토큰과 처리 값을 받기, 토큰만 따로 변수로 선언
            const data = await registerResponse.json();
            const token = data.token;

            // 깃헙 로그인 정보를 바탕으로 생성한 토큰을 LocalStorage 에 저장
            window.localStorage.setItem('token', token);

            dispatch(login({ id: userKaKaoInfo.kakao_account.email }));
            navigate('/');
          } else {
            alert('회원 등록 이상');
            navigate('/login');
          }
        } else {
          alert('카카오 로그인 회원 정보 획득 실패');
          navigate('/login');
        }
      } else {
        alert('카카오 로그인 토큰 발행 실패');
        navigate('/login');
      }
    }
    loginFetch();
  }, []);
};

export default KakaoRedirectHandler;
