import Papa from 'papaparse';
import { Koodi, Metadata } from '../types/types';
import { fetchKoodisByKoodisto } from '../api/koodisto';
import { info } from '../components/Notification/Notification';

export const mapKoodiToCSV = (koodi: Koodi) => {
    const allLang = ['FI', 'SV', 'EN'];
    const metadataKeys = ['nimi', 'lyhytNimi', 'kuvaus'] as (keyof Metadata)[];
    const reducedMetdata = allLang.reduce((p, language) => {
        const languageKeyedMetadata: { [key: string]: string | undefined } = {};
        const languageMetadata =
            koodi.metadata.find((a) => a.kieli === language) ||
            ({
                nimi: '',
                lyhytnimi: '',
                kuvaus: '',
            } as Metadata);
        metadataKeys.forEach((k) => (languageKeyedMetadata[`${k}_${language}`] = languageMetadata[k]));
        return { ...p, ...languageKeyedMetadata };
    }, {});
    return {
        koodistoUri: koodi.koodisto?.koodistoUri,
        koodiArvo: koodi.koodiArvo,
        voimassaAlkuPvm: koodi.voimassaAlkuPvm,
        voimassaLoppuPvm: koodi.voimassaLoppuPvm,
        ...reducedMetdata,
    };
};
const pushBlobToUser = ({ fileName, blob }: { fileName: string; blob: Blob }) => {
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

const convertCsvToExcelAcceptedBlob = (csv: string) => {
    const csvWithBom = `${decodeURIComponent('%EF%BB%BF')}${csv}`;
    const charCodeArray = Array.from(csvWithBom).map((k) => k.charCodeAt(0));
    const csvArray = new Uint16Array(charCodeArray);
    return new Blob([csvArray], { type: 'text/csv;charset=UTF-16LE;' });
};

const downloadCsv = async (koodistoUri: string) => {
    const data = await fetchKoodisByKoodisto(koodistoUri);
    if (!data) return;
    data.sort((a, b) => a.koodiUri.localeCompare(b.koodiUri));
    const csvData = data.map(mapKoodiToCSV);
    const csv = Papa.unparse(csvData, { quotes: true, quoteChar: '"', delimiter: '\t', newline: '\r\n' });
    const blob = convertCsvToExcelAcceptedBlob(csv);
    pushBlobToUser({ fileName: `${koodistoUri}.csv`, blob });
    info({ title: 'CSV_DOWNLOAD_NOTIFICATION_TITLE', message: 'CSV_DOWNLOAD_NOTIFICATION_SUCCESS' });
};
export default downloadCsv;
