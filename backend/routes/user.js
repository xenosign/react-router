const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  duplicateUser,
} = require('../controllers/userController');

const isLogin = (req, res, next) => {
  console.log(req.session);
};

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/duplicate', duplicateUser);
router.post('/test', isLogin);

module.exports = router;
