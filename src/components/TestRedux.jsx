import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function TestRedux() {
  const weight = useSelector((state) => state.weightReducer);
  const dispatch = useDispatch();

  return (
    <>
      <h1>당신의 몸무게는 {weight} 입니다!</h1>
      <button onClick={() => dispatch({ type: '증가' })}>증가</button>
      <button onClick={() => dispatch({ type: '감소' })}>감소</button>
    </>
  );
}
