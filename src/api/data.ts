import axios from 'axios';
import { ISticker } from '../interfaces';

const PATH = '/api/data';

export function update(field: string, value: string | ISticker[]) {
  return axios.post(`${PATH}/update`, { field, value });
}

