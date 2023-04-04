import React from 'react';
import { useSelector } from 'react-redux';
import Header from './Header';

export default function Profile() {
  const weight = useSelector((state) => state);

  return (
    <>
      <h1>프로필 페이지 입니다!</h1>
    </>
  );
}
