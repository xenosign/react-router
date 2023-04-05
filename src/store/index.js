import { combineReducers } from 'redux';
import mbti from './modules/mbti';
import todo from './modules/todo';
import weight from './modules/weight';

export default combineReducers({
  todo,
  weight,
  mbti,
});
