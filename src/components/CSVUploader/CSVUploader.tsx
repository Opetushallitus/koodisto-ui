import Modal from '../Modal/Modal';
import { FormattedMessage } from 'react-intl';
import CSVReader from '../CSVReader/CSVReader';
import Button from '@opetushallitus/virkailija-ui-components/Button';
import * as React from 'react';
import { useMemo, useState } from 'react';
import Table from '../Table/Table';
import { Column } from 'react-table';
import { CsvKoodiObject } from '../../types/types';
import { getHeaders, mapCsvToKoodi, mapHeadersToColumns, validData } from './uploadCsv';
import { batchUpsertKoodi, useKoodisto } from '../../api/koodisto';
import Loading from '../pages/Loading/Loading';
import { danger, success } from '../Notification/Notification';
import downloadCsv from '../../utils/downloadCsv';

type Props = {
    koodistoUri: string;
    closeUploader: () => void;
};

const persistData = async ({
    data = [],
    koodistoUri,
    closeUploader,
}: {
    data?: CsvKoodiObject[];
    koodistoUri: string;
    closeUploader: () => void;
}) => {
    const koodi = data.map(mapCsvToKoodi);
    const result = await batchUpsertKoodi(koodistoUri, koodi);
    if (result) {
        success({ title: 'update success', message: `${result.koodistoUri} was updated` });
        closeUploader();
    }
};

const CSVUploader: React.FC<Props> = ({ koodistoUri, closeUploader }) => {
    const [csvKoodiArray, setCsvKoodiArray] = useState<CsvKoodiObject[]>([]);
    const now = useMemo<number>(() => Date.now(), [koodistoUri]);
    const { data, loading } = useKoodisto(koodistoUri, now);
    const headers = useMemo<(keyof CsvKoodiObject)[]>(() => [...getHeaders(csvKoodiArray || [])], [csvKoodiArray]);
    const dataMemo = useMemo<CsvKoodiObject[]>(
        () =>
            csvKoodiArray?.map((a) => ({
                ...a,
                newRow: data?.find((b) => b.koodiArvo === a.koodiArvo) === undefined,
            })) || [],
        [csvKoodiArray, data]
    );

    const columns = React.useMemo<Column<CsvKoodiObject>[]>(
        () => mapHeadersToColumns(['newRow' as keyof CsvKoodiObject, ...headers]),
        [headers]
    );
    if (loading) return <Loading />;
    return (
        <Modal
            header={
                <FormattedMessage
                    id={'LATAA_CSV_OTSIKKO'}
                    defaultMessage={'Lataa koodisto csv-tiedostosta {koodistoUri}'}
                    values={{ koodistoUri }}
                />
            }
            body={
                <>
                    <Button onClick={() => downloadCsv(koodistoUri)}>
                        <FormattedMessage id={'LATAA_CSV_LATAA'} defaultMessage={'Lataa'} />
                    </Button>
                    <hr />
                    <CSVReader<CsvKoodiObject>
                        onUploadAccepted={(results) => {
                            const wrongKoodistoUri = results.data?.find((a) => {
                                return a.koodistoUri !== koodistoUri;
                            });
                            if (wrongKoodistoUri) {
                                setCsvKoodiArray([]);
                                danger({
                                    title: (
                                        <FormattedMessage
                                            id={'CSV_UPLOAD_INVALID_KOODISTORI_TITLE'}
                                            defaultMessage={'Virheellinen koodistoUri tiedostossa.'}
                                        />
                                    ),
                                    message: (
                                        <FormattedMessage
                                            id={'CSV_UPLOAD_INVALID_KOODISTORI_MESSAGE'}
                                            defaultMessage={'Tiedostosta löytyi koodistoUri {wrongKoodistoUri}'}
                                            values={{ wrongKoodistoUri: wrongKoodistoUri.koodistoUri }}
                                        />
                                    ),
                                });
                            } else {
                                setCsvKoodiArray(results.data);
                            }
                        }}
                    />
                    {(csvKoodiArray.length && <Table columns={columns} data={dataMemo} />) || (
                        <FormattedMessage id={'LATAA_CSV_EI_DATAA'} defaultMessage={'Valitse tiedosto.'} />
                    )}
                </>
            }
            footer={
                <>
                    <Button
                        disabled={!validData(csvKoodiArray)}
                        onClick={() => persistData({ closeUploader, data: dataMemo, koodistoUri })}
                    >
                        <FormattedMessage id={'LATAA_CSV_TALLENNA'} defaultMessage={'Tallenna'} />
                    </Button>
                    <Button onClick={closeUploader}>
                        <FormattedMessage id={'LATAA_CSV_PERUUTA'} defaultMessage={'Peruuta'} />
                    </Button>
                </>
            }
            onClose={closeUploader}
        />
    );
};
export default CSVUploader;
