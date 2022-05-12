import { CsvKoodiObject, UpsertKoodi, Kieli } from '../../types/types';
import { Column } from 'react-table';
import { useIntl } from 'react-intl';

export const getHeaders = (data?: CsvKoodiObject[]): (keyof CsvKoodiObject)[] =>
    (data?.[0] ? Object.keys(data[0]) : []) as (keyof CsvKoodiObject)[];
export const mapHeadersToColumns = (headers?: (keyof CsvKoodiObject)[]): Column<CsvKoodiObject>[] =>
    headers?.map((key): Column<CsvKoodiObject> => {
        const { formatMessage } = useIntl();
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
    return !!data;
};

export const mapCsvToKoodi = (csvRow: CsvKoodiObject): UpsertKoodi => {
    const topLevel = {
        koodiArvo: csvRow.koodiArvo,
        voimassaAlkuPvm: csvRow.voimassaAlkuPvm,
        voimassaLoppuPvm: csvRow.voimassaLoppuPvm || undefined,
    };
    const metadata_FI = {
        kieli: 'FI' as Kieli,
        kuvaus: csvRow.kuvaus_FI || undefined,
        lyhytNimi: csvRow.lyhytNimi_FI || undefined,
        nimi: csvRow.nimi_FI,
    };
    const metadata_SV = {
        kieli: 'SV' as Kieli,
        kuvaus: csvRow.kuvaus_SV || undefined,
        lyhytNimi: csvRow.lyhytNimi_SV || undefined,
        nimi: csvRow.nimi_SV,
    };
    const metadata_EN = {
        kieli: 'EN' as Kieli,
        kuvaus: csvRow.kuvaus_EN || undefined,
        lyhytNimi: csvRow.lyhytNimi_EN || undefined,
        nimi: csvRow.nimi_EN,
    };
    return {
        ...topLevel,
        metadata: [
            ...(metadata_FI.nimi ? [{ ...metadata_FI }] : []),
            ...(metadata_SV.nimi ? [{ ...metadata_SV }] : []),
            ...(metadata_EN.nimi ? [{ ...metadata_EN }] : []),
        ],
    };
};
