const weight = 100;
const date = new Date();

export default function weightReducer(state = weight, action) {
  if (action.type === '증가') {
    state += date.getDate();
    return state;
  } else if (action.type === '감소') {
    state -= date.getMonth() + 1;
    return state;
  } else {
    return state;
  }
}
