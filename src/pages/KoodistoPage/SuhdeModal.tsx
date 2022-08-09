import React, { useState } from 'react';
import { Modal, Footer } from '../../components/Modal';
import Button from '@opetushallitus/virkailija-ui-components/Button';
import { FormattedMessage } from 'react-intl';
import KoodistoTable from '../KoodistoTablePage/KoodistoTable';
import { ListKoodisto } from '../../types';

export const SuhdeModal: React.FC<{ close: () => void }> = ({ close }) => {
    const [selected, setSelected] = useState<ListKoodisto[]>([]);
    return (
        <Modal
            header={<FormattedMessage id={'SUHDEMODAL_HEADER'} defaultMessage={'Valitse koodistot'} />}
            body={<KoodistoTable modal setSelected={setSelected} />}
            footer={
                <Footer>
                    <Button
                        onClick={() => {
                            console.log('you selected', selected);
                            close();
                        }}
                        name={'SUHDEMODAL_LISAA'}
                    >
                        <FormattedMessage
                            id={'SUHDEMODAL_LISAA'}
                            defaultMessage={'Lisää valitut ({chosen})'}
                            values={{ chosen: selected.length }}
                        />
                    </Button>
                    <Button onClick={close} name={'SUHDEMODAL_SULJE'}>
                        <FormattedMessage id={'SUHDEMODAL_SULJE'} defaultMessage={'Sulje'} />
                    </Button>
                </Footer>
            }
            onClose={close}
        ></Modal>
    );
};
