import jwtDecode from 'jwt-decode';
import { verify, sign } from 'jsonwebtoken';
//
import HttpService from './HttpService';
// ----------------------------------------------------------------------
const httpservice = new HttpService();
const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }

  const decoded = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

const me = () => {

  const accessToken = localStorage.getItem('accessToken');
  const decoded = jwtDecode(accessToken);

  return decoded.uuid;
}

//  const handleTokenExpired = (exp) => {
//   let expiredTimer;

//   window.clearTimeout(expiredTimer);
//   const currentTime = Date.now();
//   const timeLeft = exp * 1000 - currentTime;
//   console.log(timeLeft);
//   expiredTimer = window.setTimeout(() => {
//     console.log('expired');
//     // You can do what ever you want here, like show a notification
//   }, timeLeft);
// };

const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);

    httpservice.client.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    // This function below will handle when token is expired
    // const { exp } = jwtDecode(accessToken);
    // handleTokenExpired(exp);
  } else {
    localStorage.removeItem('accessToken');
    delete httpservice.client.defaults.headers.common.Authorization;
  }
};

export { isValidToken, setSession, verify, sign, me };
