import { API_BASE_PATH } from '../context/constants';
import { atom } from 'jotai';
import axios from 'axios';

const urlAtom = atom(`${API_BASE_PATH}/session/maxinactiveinterval`);
export const maxIntervalAtom = atom(async (get) => {
    const response = await axios.get<number>(get(urlAtom));
    return response.data;
});
