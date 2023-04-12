const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  duplicateUser,
  isToken,
} = require('../controllers/userController');

const isLogin = (req, res, next) => {
  console.log(req.session);
};

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/duplicate', duplicateUser);
router.post('/test', isLogin);
// 토큰 검증용 라우터 주소 설정
// localhost:4000/user/token 으로 요청을 보내면 된다
router.post('/token', isToken);

module.exports = router;
