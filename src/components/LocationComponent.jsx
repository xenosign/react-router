import React, { useEffect, useState } from 'react';

const LocationComponent = () => {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [ready, setReady] = useState(false);

  const NAVER_CLIENT_ID = '_UmPcWI1byBAwXFr7Z3Y';

  useEffect(() => {
    // 브라우저의 geolocation API를 사용하여 위치 정보를 받아옴
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setReady(true);
      },
      (error) => {
        console.error('Error getting location:', error);
      },
    );
  }, []); // 빈 배열을 두 번째 인자로 전달하여 컴포넌트가 마운트되었을 때 한 번만 실행되도록 설정

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${NAVER_CLIENT_ID}&submodules=geocoder`;
    // YOUR_CLIENT_ID에 발급받은 네이버 API 클라이언트 ID를 입력하세요.
    document.head.appendChild(script);
    script.onload = () => {
      // 네이버 지도 API 스크립트가 로드된 후 실행될 코드
      const naver = window.naver;
      const mapOptions = {
        center: new naver.maps.LatLng(latitude, longitude), // 초기 지도 중심 좌표
        zoom: 14, // 초기 지도 줌 레벨
      };
      const map = new naver.maps.Map('map', mapOptions); // 지도 객체 생성
      // 지도에 마커 추가
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(37.5665, 126.978), // 마커의 위치 좌표
        map, // 마커를 표시할 지도 객체
      });
    };
  }, [ready]);

  return (
    <div>
      <h1>현재 위치 정보</h1>
      {latitude && longitude ? (
        <p>
          위도: {latitude.toFixed(2)}, 경도: {longitude.toFixed(2)}
        </p>
      ) : (
        <p>위치 정보를 불러오는 중...</p>
      )}
      <div id="map" style={{ width: '100%', height: '400px' }}></div>
    </div>
  );
};

export default LocationComponent;
