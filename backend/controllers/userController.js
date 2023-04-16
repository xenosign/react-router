const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const {
  DB_MODE,
  MYSQL_DB,
  MYSQL_TABLE,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
} = process.env;

if (DB_MODE === 'mysql') {
  const connection = require('./mysqlConnect');

  console.log(DB_MODE, '모드로 실행 중입니다!');

  // 사용자 ID 를 받아서 JWT AccessToken 을 생성해 주는 함수
  const issueToken = async (userID) => {
    return jwt.sign(
      { userID: userID }, // 유저 정보를 암호화하여 토큰 발행
      JWT_ACCESS_SECRET, // 해당 JWT를 쉽게 풀 수 없도록, 암호키 삽입
      { expiresIn: '1d' }, // 해당 토큰 만료기간 설정, 하루 동안 토큰을 인증할 수 있습니다
      // 기간을 적게 하고 싶으면 ms 단위로 정하면 됩니다 (1000 * 60 -> 1분, 1000 * 60 * 60 -> 60분)
    );
  };

  // 브라우저 로컬 스토리지에 저장 된, 토큰을 검증하는 컨트롤러
  // 토큰 검증이 완료 되면 원하는 정보를 담아서 전달해 준다 -> 프론트에서는 로그인 처리
  const verifyToken = (req, res) => {
    jwt.verify(req.body.token, JWT_ACCESS_SECRET, (err, decoded) => {
      // console.log(req.body.token);
      // 토큰 검증 실패 시, 권한 없음 결과 전달
      if (err) return res.status(401).json('토큰 기한 만료');
      // 토큰 검증 성공 시, 토큰을 푼 결과(decoded) 안의 userID 를 받아서 프론트에 전달
      return res
        .status(200)
        .json({ userID: decoded.userID, msg: '토큰 검증 완료' });
    });
  };

  // 회원 가입 컨트롤러
  const registerUser = (req, res) => {
    try {
      connection.query(
        `SELECT * FROM ${MYSQL_DB}.${MYSQL_TABLE} WHERE USERID = '${req.body.id}';`,
        (err, data) => {
          if (err) throw err;
          if (data.length !== 0)
            return res.status(400).json('이미 가입 된 회원입니다');

          // bcrypt 모듈을 사용하여 비밀번호를 암호화하여 저장
          const encryptedPassword = bcrypt.hashSync(req.body.password, 10);

          connection.query(
            `INSERT INTO ${MYSQL_DB}.${MYSQL_TABLE} (USERID, PASSWORD) values ('${req.body.id}', '${encryptedPassword}')`,
            (err, data) => {
              if (err) throw err;
              res.status(200).json('회원 가입 성공');
            },
          );
        },
      );
    } catch (err) {
      console.error(err);
      res.status(500).json('회원 가입 실패, 알 수 없는 문제 발생');
    }
  };

  // 토큰 관련 기능은 함수로 분리 하였습니다! 코드 상단의 issueToken, verifyToken 을 참고하세요!
  const loginUser = (req, res) => {
    try {
      connection.query(
        `SELECT * FROM ${MYSQL_DB}.${MYSQL_TABLE} WHERE USERID = '${req.body.id}';`,
        (err, data) => {
          if (err) throw err;
          if (data.length === 0)
            return res.status(400).json('가입 되지 않은 회원 입니다');

          // bcrypt 모듈을 사용하여 암호화 된 비밀번호와 입력한 비밀번호가 동일한지 비교
          const isSamePassword = bcrypt.compareSync(
            req.body.password,
            data[0].PASSWORD,
          );

          // 비번이 동일하면 로그인이 성공 하였으므로, 토큰을 발행 합니다!
          if (isSamePassword) {
            // jwt 모듈을 사용하여 accessToken 발행
            const accessToken = issueToken(data[0].userID);

            // 생성 된 토큰을 프론트로 전달!
            // 프론트에서는 로컬 스토리지에 저장 할 것이므로, 쿠키에 담지 않고 데이터로 전송
            // 리액트 Login.jsx 에 가면 처리 코드가 있습니다!
            res
              .status(200)
              .json({ token: accessToken, message: '로그인 성공' });
          } else {
            return res.status(400).json('비밀 번호가 다릅니다');
          }
        },
      );
    } catch (err) {
      console.error(err);
      res.status(500).json('로그인 실패, 알 수 없는 문제 발생');
    }
  };

  const duplicateUser = (req, res) => {
    try {
      connection.query(
        `SELECT * FROM ${MYSQL_DB}.${MYSQL_TABLE} WHERE USERID = '${req.body.id}';`,
        (err, data) => {
          if (err) throw err;
          if (data.length !== 0)
            return res.status(400).json('이미 가입 된 회원입니다');

          return res.status(200).json('회원 가입이 가능한 ID 입니다');
        },
      );
    } catch (err) {
      console.error(err);
      res.status(500).json('회원 가입 실패, 알 수 없는 문제 발생');
    }
  };

  // 깃헙 로그인 구현 시작
  const GITHUB_CLIENT_ID = 'Iv1.1b017e86d5470be6';
  const GITHUB_REDIRECT_URI = 'http://localhost:3000/oauth/callback/github';
  const GITHUB_CLIENT_SECRET = 'e25c64ba00ab596c8e9ee2e639bc2fa06e189a8e';

  const gitLogin = async (req, res) => {
    try {
      const ACCESS_TOKEN_URL = `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${req.body.token}`;

      const resCode = await axios.post(ACCESS_TOKEN_URL, {
        Accept: 'application/json',
      });

      // 토큰 발행 성공시에도 status 가 200으로 찍히며, 결과 값을 하나의 긴 쿼리 스트링으로 들어오기 때문에
      // 문장 내부에 access_token 이라는 단어가 있으면 토큰 발행 성공으로 간주
      // 실패할 경우 err_status 같은 문장이 찍힘
      if (resCode.data.indexOf('access_token') === -1)
        return res.status(400).json('토큰 발행 실패');

      // 문장 내부에서 access_token 만 분리해 내야하므로 전체 문장에서 특정 단어를 찾아서 해당 단어의 index 를 기준으로 문장을 자름
      const tokenStr = resCode.data;
      // access_token= 로 토큰이 시작 되므로 처음 시작되는 n= 의 위치를 찾아서 + 2를 더하면 토큰의 시작 index 찾기 가능
      // = 로 해도 되지만 만에 하나 토큰에 = 이 포함 될 경우를 고려하여 n= 를 찾음
      const startIndex = tokenStr.indexOf('n=') + 2;
      // 토큰이 끝나면 토큰의 만료일이 &expires 로 표현이 되므로 &exp 단어를 찾아서 해당 위치를 access_token 의 마지막 지정으로 설정
      const endIndex = tokenStr.indexOf('&exp');

      // 문장을 잘라서 깃헙 access_token 만 추출출
      const githubAccessToken = tokenStr.substring(startIndex, endIndex);
      console.log('깃헙 엑세스 토큰', githubAccessToken);

      // 분리한 엑세스 토큰을 엑세스 토큰을 풀어주는 깃헙 api 에 요청
      const resToken = await axios.get('https://api.github.com/user', {
        headers: {
          authorization: `token ${githubAccessToken}`,
        },
      });

      // api 에서 제공하는 사용자 정보를 획득, 해당 정보에서 사용자 email 을 userID 로 사용하여 회원 가입 진행
      // 단, 가입이 이미 된 회원은 바로 서버에서 직접 만든 AccessToken 을 전달하면서 로그인 처리
      const accessToken = await issueToken(resToken.data.email);

      // 깃헙 로그인한 사용자가 DB에 등록 되어 있는지 확인 후
      // 등록 안되어 있으면 회원 가입 후 로그인 처리, 되어 있으면 로그인 처리
      connection.query(
        `SELECT * FROM ${MYSQL_DB}.${MYSQL_TABLE} WHERE USERID = '${resToken.data.email}';`,
        (err, data) => {
          if (err) throw err;
          // DB에 사용자가 있는 케이스이므로 토큰과 사용자 ID를 전달하면서 로그인 처리
          if (data.length !== 0)
            return res.status(200).json({
              token: accessToken,
              userID: resToken.data.email,
              message: '로그인 성공',
            });

          // SNS 로그인 사용자의 경우 서비스 제공자 입장에서도 해당 이용자의 비번을 알면 안되므로
          // 랜덤한 숫자를 발생시켜서 해당 숫자를 암호화 하여 비밀번호로 저장
          const encryptedPassword = bcrypt.hashSync(`${Math.random()}`, 10);

          // DB에 사용자가 없으면 회원 가입 처리 후, 토큰과 사용자 ID를 전달하면서 로그인 처리
          connection.query(
            `INSERT INTO ${MYSQL_DB}.${MYSQL_TABLE} (USERID, PASSWORD) values ('${resToken.data.email}', '${encryptedPassword}')`,
            (err, data) => {
              if (err) throw err;
              res.status(200).json({
                token: accessToken,
                userID: resToken.data.email,
                message: '로그인 성공',
              });
            },
          );
        },
      );
    } catch (err) {
      console.log(err);
      res.status(500).json('깃허브 로그인 중, 알 수 없는 에러 발생');
    }
  };

  // 카카오 로그인 구현 시작
  // 깃헙 로그인과 달리 카카오 서버에서 토큰을 처리하는 부분은 프론트에서 전부 처리하기 때문에 구조가 다릅니다!
  const kakaoLogin = async (req, res) => {
    try {
      // 프론트에서 전달한 kakao 서버에 저장 된 이메일을 userID 로 사용할 것이므로 해당 정보를 accessToken 으로 발행
      const accessToken = await issueToken(req.body.userID);

      // 카카오 로그인한 사용자가 DB에 등록 되어 있는지 확인 후
      // 등록 안되어 있으면 회원 가입 후 로그인 처리, 되어 있으면 로그인 처리
      connection.query(
        `SELECT * FROM ${MYSQL_DB}.${MYSQL_TABLE} WHERE USERID = '${req.body.userID}';`,
        (err, data) => {
          if (err) throw err;
          // DB에 사용자가 있는 케이스이므로 토큰과 사용자 ID를 전달하면서 로그인 처리
          if (data.length !== 0)
            return res.status(200).json({
              token: accessToken,
              userID: req.body.userID,
              message: '로그인 성공',
            });

          // SNS 로그인 사용자의 경우 서비스 제공자 입장에서도 해당 이용자의 비번을 알면 안되므로
          // 랜덤한 숫자를 발생시켜서 해당 숫자를 암호화 하여 비밀번호로 저장
          const encryptedPassword = bcrypt.hashSync(`${Math.random()}`, 10);

          // DB에 사용자가 없으면 회원 가입 처리 후, 토큰과 사용자 ID를 전달하면서 로그인 처리
          connection.query(
            `INSERT INTO ${MYSQL_DB}.${MYSQL_TABLE} (USERID, PASSWORD) values ('${req.body.userID}', '${encryptedPassword}')`,
            (err, data) => {
              if (err) throw err;
              res.status(200).json({
                token: accessToken,
                userID: req.body.userID,
                message: '로그인 성공',
              });
            },
          );
        },
      );
    } catch (err) {
      console.log(err);
      res.status(500).json('카카오 로그인 중, 알 수 없는 에러 발생');
    }
  };

  // 네이버 로그인 구현 시작
  const NAVER_CLIENT_ID = '_UmPcWI1byBAwXFr7Z3Y';
  const NAVER_REDIRECT_URL = 'http://localhost:3000/oauth/callback/naver';
  const NAVER_CLIENT_SECRET = 'yhdvc_FRRu';

  const naverLogin = async (req, res) => {
    console.log(req.body.CODE);
    console.log(req.body.STATE);
    try {
      const resNaverToken = await axios({
        method: 'POST',
        url: 'https://nid.naver.com/oauth2.0/token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params: {
          grant_type: 'authorization_code',
          client_id: NAVER_CLIENT_ID,
          client_secret: NAVER_CLIENT_SECRET,
          redirect_uri: NAVER_REDIRECT_URL,
          code: req.body.CODE,
          state: req.body.STATE,
        },
      });

      console.log(resNaverToken.data);

      // 네이버 사용자 정보 요청
      const resNaverUserInfo = await axios({
        method: 'GET',
        url: 'https://openapi.naver.com/v1/nid/me',
        headers: {
          Authorization: `Bearer ${resNaverToken.data.access_token}`,
        },
      });

      console.log(resNaverUserInfo.data);
    } catch (error) {
      console.error('err');
    }
  };

  module.exports = {
    registerUser,
    loginUser,
    duplicateUser,
    verifyToken,
    gitLogin,
    kakaoLogin,
    naverLogin,
  };
} else {
  console.log(DB_MODE, '모드로 실행 중입니다!');
}
