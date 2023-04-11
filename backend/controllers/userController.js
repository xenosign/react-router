const bcrypt = require('bcrypt');

const { DB_MODE, MYSQL_DB, MYSQL_TABLE } = process.env;

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
            req.session.login = true;
            console.log(req.session);
            return res.status(200).json('로그인 완료');
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
  };
} else {
  console.log(DB_MODE, '모드로 실행 중입니다!');
}
