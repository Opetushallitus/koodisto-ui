import React from 'react';

import { useCSVReader } from 'react-papaparse';
import { FormattedMessage } from 'react-intl';
import { ParseResult } from 'papaparse';
import Button from '@opetushallitus/virkailija-ui-components/Button';
import styled from 'styled-components';

const Reader = styled.div`
    display: flex;
    flex-direction: row;
`;
const AcceptedFile = styled.div`
    border: 1px solid #ccc;
    width: 80%;
`;

type Props<T> = {
    onUploadAccepted?: (data: ParseResult<T>, file?: File, event?: DragEvent | Event) => void;
};

const CSVReader = <T extends object>({ onUploadAccepted }: Props<T>) => {
    const { CSVReader } = useCSVReader();

    return (
        <CSVReader onUploadAccepted={onUploadAccepted} config={{ header: true }}>
            {({
                getRootProps,
                acceptedFile,
                ProgressBar,
            }: {
                getRootProps: () => { foo: string };
                acceptedFile: { name: string };
                ProgressBar: React.FC<{ style: unknown }>;
                getRemoveFileProps: () => undefined;
            }) => (
                <>
                    <Reader>
                        <Button {...getRootProps()}>
                            <FormattedMessage id={'LATAA_CVS_VALITSE_TIEDOSTO'} defaultMessage={'Valitse tiedosto'} />
                        </Button>
                        <AcceptedFile>{acceptedFile && acceptedFile.name}</AcceptedFile>
                    </Reader>
                    <ProgressBar style={{ margin: '0.2rem', backgroundColor: '#0a789c' }} />
                </>
            )}
        </CSVReader>
    );
};
export default CSVReader;
