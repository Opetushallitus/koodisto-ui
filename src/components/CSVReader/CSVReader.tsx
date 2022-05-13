import React from 'react';

import { useCSVReader } from 'react-papaparse';
import { FormattedMessage } from 'react-intl';
import { ParseResult } from 'papaparse';
import Button from '@opetushallitus/virkailija-ui-components/Button';
import styled from 'styled-components';
// const GREY = '#CCC';
// const GREY_LIGHT = 'rgba(255, 255, 255, 0.4)';
// const DEFAULT_REMOVE_HOVER_COLOR = '#A01919';
// const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(DEFAULT_REMOVE_HOVER_COLOR, 40);
// const GREY_DIM = '#686868';
const Reader = styled.div`
    display: flex;
    flex-direction: row;
    padding-bottom: 1rem;
`;
const AcceptedFile = styled.div`
    border: 1px solid #ccc;
    width: 30rem;
    margin-left: 1rem;
    padding-left: 0.5rem;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
`;
const UploadArea = styled.div`
    min-height: 8rem;
    background-color: #eee;
    border: dotted;
    display: flex;
    text-align: center;
    justify-content: center;
    align-content: center;
    flex-direction: column;
`;

type Props<T> = {
    onUploadAccepted?: (data: ParseResult<T>, file?: File, event?: DragEvent | Event) => void;
};

const CSVReader = <T extends object>({ onUploadAccepted }: Props<T>) => {
    const { CSVReader } = useCSVReader();
    // const [zoneHover, setZoneHover] = useState(false);
    // const [removeHoverColor, setRemoveHoverColor] = useState(DEFAULT_REMOVE_HOVER_COLOR);
    return (
        <CSVReader
            onUploadAccepted={onUploadAccepted}
            config={{ header: true }}
            // onDragOver={(event: DragEvent) => {
            //     event.preventDefault();
            //     setZoneHover(true);
            // }}
            // onDragLeave={(event: DragEvent) => {
            //     event.preventDefault();
            //     setZoneHover(false);
            // }}
        >
            {({
                getRootProps,
                acceptedFile,
                ProgressBar,
                getRemoveFileProps,
                Remove,
            }: {
                getRootProps: () => never;
                acceptedFile: { name: string };
                ProgressBar: React.FC<{ style: unknown }>;
                getRemoveFileProps: () => undefined;
                Remove: React.FC<{ color: unknown }>;
            }) => (
                <div>
                    <Reader>
                        <Button {...getRootProps()}>
                            <FormattedMessage id={'LATAA_CVS_VALITSE_TIEDOSTO'} defaultMessage={'Valitse tiedosto'} />
                        </Button>
                        <AcceptedFile>{acceptedFile && acceptedFile.name}</AcceptedFile>
                    </Reader>
                    {!acceptedFile && (
                        <UploadArea {...getRootProps()}>
                            <FormattedMessage id={'LATAA_CSV_EI_DATAA'} defaultMessage={'Tai raahaa tiedosto tähän'} />
                        </UploadArea>
                    )}
                    <ProgressBar style={{ margin: '0.2rem', backgroundColor: '#0a789c' }} />
                </div>
            )}
        </CSVReader>
    );
};
export default CSVReader;
