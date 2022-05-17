import { CsvKoodiObject, Kieli, MessageFormatter, UpsertKoodi } from '../../types/types';
import { Column } from 'react-table';

export const getHeaders = (data?: CsvKoodiObject[]): (keyof CsvKoodiObject)[] =>
    (data?.[0] ? Object.keys(data[0]) : []) as (keyof CsvKoodiObject)[];

export const mapHeadersToColumns = ({
    headers,
    formatMessage,
}: {
    headers?: (keyof CsvKoodiObject)[];
    formatMessage: MessageFormatter;
}): Column<CsvKoodiObject>[] =>
    headers?.map((key): Column<CsvKoodiObject> => {
        if (key === 'newRow')
            return {
                Header: 'new',
                accessor: (originalRow) => {
                    return originalRow.newRow
                        ? formatMessage({
                              id: 'CSV_UPLOAD_NEW_ROW',
                              defaultMessage: 'Koodi lisätään',
                          })
                        : formatMessage({
                              id: 'CSV_UPLOAD_OLD_ROW',
                              defaultMessage: 'Koodi päivitetään',
                          });
                },
            };
        else
            return {
                Header: key,
                id: key,
                accessor: key,
            } as Column<CsvKoodiObject>;
    }) || [];

export const validData = (data: CsvKoodiObject[] | undefined): boolean => {
    return !!data && data.length > 0;
};
const mapCsvRowToMetadata = (csvRow: CsvKoodiObject, kieli: Kieli) => {
    return {
        kieli,
        kuvaus: csvRow[`kuvaus_${kieli}`] || undefined,
        lyhytNimi: csvRow[`lyhytNimi_${kieli}`] || undefined,
        nimi: csvRow[`nimi_${kieli}`],
    };
};
export const mapCsvToKoodi = (csvRow: CsvKoodiObject): UpsertKoodi => {
    const topLevel = {
        koodiArvo: csvRow.koodiArvo,
        versio: csvRow.versio,
        voimassaAlkuPvm: csvRow.voimassaAlkuPvm || undefined,
        voimassaLoppuPvm: csvRow.voimassaLoppuPvm || undefined,
    };
    const metadata_FI = mapCsvRowToMetadata(csvRow, 'FI');
    const metadata_SV = mapCsvRowToMetadata(csvRow, 'SV');
    const metadata_EN = mapCsvRowToMetadata(csvRow, 'EN');
    return {
        ...topLevel,
        metadata: [
            ...(metadata_FI.nimi ? [metadata_FI] : []),
            ...(metadata_SV.nimi ? [metadata_SV] : []),
            ...(metadata_EN.nimi ? [metadata_EN] : []),
        ],
    };
};
