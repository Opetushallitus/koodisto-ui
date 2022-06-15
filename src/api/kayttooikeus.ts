import axios from 'axios';
import { Atom, atom, Getter } from 'jotai';
import { Kieli, Locale, SelectOption } from '../types';
import { translateMultiLocaleText } from '../utils';
import { sortBy } from 'lodash';
const urlAtom = atom<string>('/kayttooikeus-service');

type CASMeApi = {
    uid: string;
    oid: string;
    firstName: string;
    lastName: string;
    groups: string[];
    roles: string;
    lang: Locale;
};

type OrganisaatioNames = Record<string, Record<Locale, string>>;

const casMeAtom = atom<Promise<CASMeApi>>(async (get: Getter) => {
    const { data } = await axios.get<CASMeApi | string>(`${get(urlAtom)}/cas/me`);
    if (typeof data === 'string') {
        const retry = await axios.get<CASMeApi>(`${get(urlAtom)}/cas/me`);
        return retry.data;
    }
    return data;
});
export const casMeLocaleAtom: Atom<Locale> = atom((get) => {
    const casMe = get(casMeAtom);
    return casMe.lang;
});
export const casMeLangAtom: Atom<Kieli> = atom((get) => {
    const lang = get(casMeLocaleAtom);
    return lang.toUpperCase() as Kieli;
});
const organisaatioNamesAtom = atom<Promise<OrganisaatioNames>>(async (get: Getter) => {
    const { data } = await axios.get<OrganisaatioNames | string>(`${get(urlAtom)}/organisaatio/names`);
    if (typeof data === 'string') {
        const retry = await axios.get<OrganisaatioNames>(`${get(urlAtom)}/organisaatio/names`);
        return retry.data;
    }
    return data;
});
export const organisaatioSelectAtom: Atom<SelectOption[]> = atom((get) => {
    const names = get(organisaatioNamesAtom);
    const locale = get(casMeLocaleAtom);
    return sortBy(
        Object.keys(names).map((key) => ({
            value: key,
            label: `${translateMultiLocaleText({ multiLocaleText: names[key], locale, defaultValue: key })} ${key}`,
        })),
        [(o: SelectOption) => o.label]
    );
});
