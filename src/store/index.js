import { combineReducers } from 'redux';
import mbti from './modules/mbti';
import todo from './modules/todo';
import user from './modules/user';
import weight from './modules/weight';

export default combineReducers({
  todo,
  weight,
  mbti,
  user,
});
