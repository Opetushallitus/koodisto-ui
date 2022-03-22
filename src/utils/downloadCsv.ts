import axios from 'axios';
import Papa from 'papaparse';
import { API_BASE_PATH } from '../context/constants';
import { Metadata } from '../types/types';

type Koodi = {
    versio: number;
    version: number;
    koodiUri: string;
    koodiArvo: string;
    paivitysPvm: string;
    resourceUri: string;
    tila: string;
    voimassaAlkuPvm: string;
    voimassaLoppuPvm: string;
    metadata: Metadata[];
};
const mapKoodiToCSV = (koodi: Koodi) => {
    const langPacks = koodi.metadata
        .map((a) => {
            const langPack = {};
            const keys = Object.keys(a);
            keys.filter((k) => k !== 'kieli').forEach((k) => {
                // @ts-ignore
                langPack[`${k.toUpperCase()}_${a.kieli}`] = a[k];
            });
            return langPack;
        })
        .reduce((p, c) => ({ ...p, ...c }), {});
    return {
        versio: koodi.versio,
        koodiUri: koodi.koodiUri,
        koodiArvo: koodi.koodiArvo,
        paivitysPvm: koodi.paivitysPvm,
        voimassaAlkuPvm: koodi.voimassaAlkuPvm,
        voimassaLoppuPvm: koodi.voimassaLoppuPvm,
        tila: koodi.tila,
        ...langPacks,
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
const fetchKoodisto = async (koodistoUri: string) => {
    const { data } = await axios.get<Koodi[]>(`${API_BASE_PATH}/json/${koodistoUri}/koodi`);
    return data;
};

const convertCsvToExcelAcceptedBlob = (csv: string) => {
    const csvWithBom = `${decodeURIComponent('%EF%BB%BF')}${csv}`;
    const csvArray = new Uint16Array(
        csvWithBom.split('').map(function (k) {
            return k.charCodeAt(0);
        })
    );
    return new Blob([csvArray], { type: 'text/csv;charset=UTF-16LE;' });
};

const downloadCsv = async (koodistoUri: string) => {
    const data = await fetchKoodisto(koodistoUri);
    data.sort((a, b) => a.koodiUri.localeCompare(b.koodiUri));
    const csvData = data.map(mapKoodiToCSV);
    const csv = Papa.unparse(csvData, { quotes: true, quoteChar: '"', delimiter: '\t', newline: '\r\n' });
    const blob = convertCsvToExcelAcceptedBlob(csv);
    pushBlobToUser({ fileName: `${koodistoUri}.csv`, blob });
};
export default downloadCsv;
