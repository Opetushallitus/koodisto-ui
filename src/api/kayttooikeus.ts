import axios from 'axios';
import { atom, Getter } from 'jotai';

type CASMeApi = {
    uid: string;
    oid: string;
    firstName: string;
    lastName: string;
    groups: string[];
    roles: string;
    lang: 'fi' | 'sv' | 'en';
};

const urlAtom = atom<string>('/kayttooikeus-service/cas/me');
export const casMeAtom = atom<Promise<CASMeApi>>(async (get: Getter) => {
    const { data } = await axios.get<CASMeApi>(get(urlAtom));
    return data;
});
export const casMeLangAtom = atom((get) => {
    return get(casMeAtom).lang;
});
