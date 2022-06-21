import { mapKoodiToCSV } from './downloadCsv';
import { Tila } from '../types';

const cleanKoodi = {
    versions: 1,
    paivittajaOid: '1.2.3.4.5',
    koodistoUri: 'foo',
    sisaltyyKoodeihin: [],
    sisaltaaKoodit: [],
    rinnastuuKoodeihin: [],
    koodiArvo: '',
    koodiUri: '',
    metadata: [],
    paivitysPvm: new Date(),
    resourceUri: '',
    tila: 'LUONNOS' as Tila,
    versio: 0,
    version: 0,
    voimassaAlkuPvm: new Date(),
    voimassaLoppuPvm: undefined,
    koodisto: {
        koodistoUri: 'koodistoUri',
        versio: 1,
        metadata: [],
    },
};
describe('downloadCsv', () => {
    describe('mapKoodiToCSV', () => {
        it('can map koodi with 0 metadata', () => {
            expect(mapKoodiToCSV(cleanKoodi)).toStrictEqual({
                koodistoUri: 'koodistoUri',
                koodiArvo: '',
                versio: 0,
                voimassaAlkuPvm: '',
                voimassaLoppuPvm: '',
                nimi_FI: '',
                nimi_SV: '',
                nimi_EN: '',
                kuvaus_FI: '',
                kuvaus_SV: '',
                kuvaus_EN: '',
                lyhytNimi_FI: '',
                lyhytNimi_SV: '',
                lyhytNimi_EN: '',
            });
        });
        it('can map koodi with 1 metadata', () => {
            expect(mapKoodiToCSV({ ...cleanKoodi, metadata: [{ kieli: 'FI', nimi: 'bar' }] })).toStrictEqual({
                koodistoUri: 'koodistoUri',
                koodiArvo: '',
                versio: 0,
                voimassaAlkuPvm: '',
                voimassaLoppuPvm: '',
                nimi_FI: 'bar',
                nimi_SV: '',
                nimi_EN: '',
                kuvaus_FI: '',
                kuvaus_SV: '',
                kuvaus_EN: '',
                lyhytNimi_FI: '',
                lyhytNimi_SV: '',
                lyhytNimi_EN: '',
            });
        });
    });
});
