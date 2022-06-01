import { API_BASE_PATH, API_INTERNAL_PATH } from '../context/constants';
import { atom, Getter } from 'jotai';
import { ApiDate, Kieli, Koodi, ListKoodisto, Metadata, PageKoodisto, UpsertKoodi, KoodistoRelation } from '../types';
import { casMeLangAtom } from './kayttooikeus';
import { parseApiDate, translateMetadata } from '../utils';
import { errorHandlingWrapper } from './errorHandling';
import { fetchOrganisaatioNimi } from './organisaatio';
import gaxios from 'gaxios';

const urlAtom = atom<string>(`${API_INTERNAL_PATH}/koodisto`);

type ApiRyhmaMetadata = {
    id: number;
    uri: string;
    kieli: Kieli;
    nimi: string;
};
type ApiBaseKoodisto = {
    koodistoUri: string;
    versio: number;
    voimassaAlkuPvm: ApiDate;
    voimassaLoppuPvm: ApiDate;
    metadata: Metadata[];
};
type ApiPageKoodisto = ApiBaseKoodisto & {
    resourceUri: string;
    omistaja: string | null;
    organisaatioOid: string;
    lukittu: boolean | null;
    koodistoRyhmaMetadata: Metadata[];
    paivitysPvm: ApiDate;
    paivittajaOid: string;
    tila: string;
    koodiVersio: number[];
    sisaltyyKoodistoihin: KoodistoRelation[];
    sisaltaaKoodistot: KoodistoRelation[];
    rinnastuuKoodistoihin: KoodistoRelation[];
    koodiList: Koodi[];
};
type ApiListKoodisto = ApiBaseKoodisto & {
    koodistoRyhmaMetadata: ApiRyhmaMetadata[];
    koodiCount: number;
};

const apiKoodistoListToKoodistoList = (a: ApiListKoodisto, lang: Kieli): ListKoodisto => {
    const nimi = translateMetadata({ metadata: a.metadata, lang })?.nimi;
    const ryhmaNimi = translateMetadata({ metadata: a.koodistoRyhmaMetadata, lang })?.nimi;
    return {
        ryhmaId: a.koodistoRyhmaMetadata?.[0]?.id || undefined,
        koodistoUri: a.koodistoUri,
        versio: a.versio,
        voimassaAlkuPvm: a.voimassaAlkuPvm && parseApiDate(a.voimassaAlkuPvm),
        voimassaLoppuPvm: a.voimassaLoppuPvm && parseApiDate(a.voimassaLoppuPvm),
        nimi,
        ryhmaNimi,
        koodiCount: a.koodiCount,
    };
};

const apiKoodistoListAtom = atom<Promise<ApiListKoodisto[]>>(async (get: Getter) => {
    const { data } = await gaxios.request<ApiListKoodisto[]>({ method: 'GET', url: get(urlAtom) });
    return data;
});

export const koodistoListAtom = atom<ListKoodisto[]>((get: Getter) => {
    const lang = get(casMeLangAtom);
    return get(apiKoodistoListAtom).map((a) => apiKoodistoListToKoodistoList(a, lang));
});

export const fetchKoodiListByKoodisto = async ({
    koodistoUri,
    koodistoVersio,
}: {
    koodistoUri: string;
    koodistoVersio?: number;
}): Promise<Koodi[] | undefined> => {
    return errorHandlingWrapper(async () => {
        const { data } = await gaxios.request<Koodi[]>({
            method: 'GET',
            url: `${API_BASE_PATH}/json/${koodistoUri}/koodi`,
            params: koodistoVersio !== undefined ? { koodistoVersio } : {},
        });
        return data;
    });
};

export const createKoodisto = async (koodistoUri: string, koodi: UpsertKoodi): Promise<number | undefined> => {
    return errorHandlingWrapper(async () => {
        const { data } = await gaxios.request<number>({
            method: 'POST',
            url: `${API_BASE_PATH}/codeelement/${koodistoUri}`,
            data: { koodi },
        });
        return data;
    });
};
export const updateKoodisto = async (koodi: UpsertKoodi): Promise<number | undefined> => {
    return errorHandlingWrapper(async () => {
        const { data } = await gaxios.request<number>({
            method: 'PUT',
            url: `${API_BASE_PATH}/codeelement/save`,
            data: { koodi },
        });
        return data;
    });
};

const mapApiPageKoodistoToPageKoodisto = (api: ApiPageKoodisto): PageKoodisto => {
    return {
        ...api,
        voimassaAlkuPvm: api.voimassaAlkuPvm && parseApiDate(api.voimassaAlkuPvm),
        voimassaLoppuPvm: api.voimassaLoppuPvm && parseApiDate(api.voimassaLoppuPvm),
    };
};
export const batchUpsertKoodi = async (
    koodistoUri: string,
    koodi: UpsertKoodi[]
): Promise<PageKoodisto | undefined> => {
    return errorHandlingWrapper(async () => {
        const { data } = await gaxios.request<ApiPageKoodisto>({
            method: 'POST',
            url: `${API_INTERNAL_PATH}/koodi/${koodistoUri}`,
            data: { koodi },
        });
        return mapApiPageKoodistoToPageKoodisto(data);
    });
};

export const fetchPageKoodisto = async (koodistoUri: string, versio: number): Promise<PageKoodisto | undefined> => {
    return errorHandlingWrapper(async () => {
        const { data: apiPageKoodisto } = await gaxios.request<ApiPageKoodisto>({
            method: 'GET',
            url: `${API_INTERNAL_PATH}/koodisto/${koodistoUri}/${versio}`,
        });
        if (apiPageKoodisto) {
            const organisaatioNimi = await fetchOrganisaatioNimi(apiPageKoodisto.organisaatioOid);
            return { ...mapApiPageKoodistoToPageKoodisto(apiPageKoodisto), organisaatioNimi };
        } else {
            return undefined;
        }
    });
};
