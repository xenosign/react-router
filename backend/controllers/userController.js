const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

          if (isSamePassword) {
            // accessToken 발행
            const accessToken = jwt.sign(
              { userID: data[0].USERID }, // 유저 정보
              JWT_ACCESS_SECRET, // 일종의 salt
              { expiresIn: '1d' }, // 옵션 중에서 만료기간
            );

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

  const isToken = (req, res) => {
    jwt.verify(req.body.token, JWT_ACCESS_SECRET, (err, decoded) => {
      if (err) return res.status(401).json('토큰 기한 만료');
      return res
        .status(200)
        .json({ userID: decoded.userID, msg: '토큰 검증 완료' });
    });
  };

  const kakaoLoginUser = (req, res) => {
    try {
      connection.query(
        `SELECT * FROM mydb.user WHERE USERID = '${req.body.id}';`,
        (err, data) => {
          if (err) throw err;
          if (!data.length === 0) res.status(200).json('카카오 로그인 완료');
          connection.query(
            `INSERT INTO mydb.user (USERID, PASSWORD, NAME, PHONE_NUMBER) values ('${req.body.id}', '${req.body.password}', '${req.body.name}', '${req.body.phone}');`,
            (err, data) => {
              if (err) throw err;
              res.status(200).json('카카오 로그인 완료');
            },
          );
        },
      );
    } catch (err) {
      console.error(err);
      res.status(500).json('회원가입 실패, 알 수 없는 문제 발생');
    }
  };

  module.exports = {
    registerUser,
    loginUser,
    duplicateUser,
    isToken,
  };
} else {
  console.log(DB_MODE, '모드로 실행 중입니다!');
}
