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
    const response = await fetch(get(urlAtom));
    return response.json();
});
export const casMeLangAtom = atom((get) => {
    return get(casMeAtom).lang;
});
