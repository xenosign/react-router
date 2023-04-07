const connection = require('./mysqlConnect');

const registerUser = (req, res) => {
  try {
    connection.query(
      `SELECT * FROM mydb1.user WHERE USERID = '${req.body.id}';`,
      (err, data) => {
        if (err) throw err;
        if (data.length !== 0)
          return res.status(400).json('이미 가입 된 회원입니다');

        connection.query(
          `INSERT INTO mydb1.user (USERID, PASSWORD) values ('${req.body.id}', '${req.body.password}')`,
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

module.exports = {
  registerUser,
};
