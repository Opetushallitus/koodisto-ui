import React, { useState, useEffect } from 'react';
import { Modal, Footer } from '../../components/Modal';
import Button from '@opetushallitus/virkailija-ui-components/Button';
import { FormattedMessage } from 'react-intl';
import { Koodi } from '../../types';
import { KoodiTable } from '../../components/Table';
import { fetchKoodistoKoodis } from '../../api/koodi';
import { Loading } from '../../components/Loading';

type SuhdeModalProps = {
    close: () => void;
    save: (toAdd: Koodi[]) => void;

    relationSources: { koodistoUri: string; versio: number }[];
};
export const SuhdeModal: React.FC<SuhdeModalProps> = ({ close, save, relationSources }) => {
    const [selected, setSelected] = useState<Koodi[]>([]);
    const [koodiList, setKoodiList] = useState<Koodi[] | undefined>(undefined);
    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            const list = await relationSources.reduce(
                async (p, c) => [
                    ...(await p),
                    ...((await fetchKoodistoKoodis(c.koodistoUri, c.versio, controller)) || []),
                ],
                Promise.resolve([] as Koodi[])
            );

            list && setKoodiList(list);
        })();
        return () => {
            controller.abort();
        };
    }, [relationSources]);
    return (
        <Modal
            header={<FormattedMessage id={'SUHDEMODAL_HEADER'} defaultMessage={'Valitse koodistot'} />}
            body={(koodiList && <KoodiTable modal koodiList={koodiList} setSelected={setSelected} />) || <Loading />}
            footer={
                <Footer>
                    <Button
                        disabled={selected.length === 0}
                        onClick={() => {
                            save(selected);
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
