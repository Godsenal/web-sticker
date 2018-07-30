import axios from 'axios';

const PATH = '/auth';
export function login(username: string, password: string) {
  return axios.post(`${PATH}/login`, { username, password });
}
export function signup(username: string, password: string) {
  return axios.post(`${PATH}/signup`, { username, password });
}
export function verify() {
  return axios.get(`${PATH}/verfiy`);
}

