import { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   Container as MapDiv,
//   NaverMap,
//   Marker,
//   useNavermaps,
// } from 'react-naver-maps';

export default function Weather() {
  // const navermaps = useNavermaps();
  const [area, setArea] = useState();
  const [data, setData] = useState();
  const [weather, setWeather] = useState();
  // const getData = async () => {
  //   const res = await axios.get('http://localhost:4000/data/getdata');
  //   res.status === 200 ? console.log(res.status) : console.log(res.json());
  //   const allData = res.data;
  //   console.log(allData);
  //   setArea((cur) => allData.data[0].area_name);
  //   setData((cur) => allData.data[0].live_data.AREA_CONGEST_MSG[0]);
  //   setWeather((cur) => allData.weather[0]);
  // };
  useEffect(() => {
    // getData();
    // //10분마다 데이터 갱신 시키기
    // const reNew = setInterval(() => {
    //   getData();
    //   console.log('데이터 갱신 완료');
    // }, 600000);
    // return clearInterval(reNew);
  }, []);
  return (
    <>
      <h1>{area}</h1>
      <h2>{data}</h2>
      <h3>
        {/* 오늘 최고 기온은 {weather.max_temperature}도 <br />
        최저 기온은 {weather.min_temperature}도 이고, <br />
        현재 체감 온도는 {weather.sen_temperature}입니다. */}
      </h3>
    </>
  );
}
