import gaxios from 'gaxios';
import { errorHandlingWrapper } from './errorHandling';
import { OrganisaatioNimi } from '../types';

type Organisaatio = {
    nimi: OrganisaatioNimi;
};

export const fetchOrganisaatioNimi = async (oid: string): Promise<OrganisaatioNimi | undefined> => {
    return errorHandlingWrapper(async () => {
        const { data } = await gaxios.request<Organisaatio>({ method: 'GET', url: `/organisaatio-service/api/${oid}` });
        return data.nimi;
    });
};
