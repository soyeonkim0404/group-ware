import { NO_USE_ERROR_HANDLER } from '@lib/hooks/useErrorHandler';

const getGeolocation = () => {
  if (!('geolocation' in navigator)) {
    throw new Error('geolocation 을 사용할 수가 없습니다.');
  }

  return new Promise((resolve, reject) => {
    const options = {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0,
    };

    // 성공
    const success = (position) => {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      resolve([latitude, longitude]);
    };

    // 실패
    const fail = (error) => {
      console.log(error);
      if (error.code === 1) {
        alert('위치 액세스가 거부되었습니다. 허용해주세요. ');
      }
      reject(NO_USE_ERROR_HANDLER);
    };

    navigator.geolocation.getCurrentPosition(success, fail, options);
  });
};

export default getGeolocation;
