// 초기 상태
const initState = {
  userID: '',
  userPW: '',
  isLogin: false,
};

// 액션 타입 설정
const LOGIN = 'user/LOGIN';
const LOGOUT = 'user/LOGOUT';

// 액션 생성 함수
export function login(loginInfo) {
  return {
    type: LOGIN,
    payload: loginInfo,
  };
}

export function logout() {
  return {
    type: LOGOUT,
  };
}

let testValue;

// 리듀서 일해라
export default function user(state = initState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        userID: action.payload.id,
        isLogin: true,
      };
    case LOGOUT:
      return {
        ...state,
        userID: '',
        isLogin: false,
      };
    default:
      return state;
  }
}
