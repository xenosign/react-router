import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import Login from './Login';
import Mbti from './Mbti';
import Show from './Show';
import Start from './Start';

const MainStyle = styled.main`
  box-sizing: border-box;
  width: 100%;
  max-width: 500px;
  padding: 0 35px;
  margin: auto;
  text-align: center;
`;

export default function Main() {
  const page = useSelector((state) => state.mbti.page);
  const survey = useSelector((state) => state.mbti.survey);

  return (
    <>
      <MainStyle>
        {page === 0 ? <Start /> : page <= survey.length ? <Mbti /> : <Show />}
      </MainStyle>
      <Routes>
        <Route path="/test" element={<Login />} />
      </Routes>
    </>
  );
}
