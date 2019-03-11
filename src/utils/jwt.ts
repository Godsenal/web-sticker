import axios from 'axios';

export function setToken(token: string) {
  localStorage.setItem('token', token);
  axios.defaults.headers.common.Authorization = 'Bearer '.concat(token);
}

export function getToken() {
  const token = localStorage.getItem('token');
  return token;
}

export function removeToken() {
  localStorage.removeItem('token');
  axios.defaults.headers.common.Authorization = null;
}
export default {
  setToken,
  getToken,
  removeToken,
};
