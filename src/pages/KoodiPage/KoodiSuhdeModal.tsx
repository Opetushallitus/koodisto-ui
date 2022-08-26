import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/Modal';
import { FormattedMessage } from 'react-intl';
import { KoodiList } from '../../types';
import { KoodiTable } from '../../components/Table';
import { fetchKoodistoKoodis } from '../../api/koodi';
import { Loading } from '../../components/Loading';
import { SuhdeModalFooter } from '../../modals/SuhdeModal';

type SuhdeModalProps = {
    close: () => void;
    save: (toAdd: KoodiList[]) => void;
    relationSources: { koodistoUri: string; versio: number }[];
};
export const KoodiSuhdeModal: React.FC<SuhdeModalProps> = ({ close, save, relationSources }) => {
    const [selected, setSelected] = useState<KoodiList[]>([]);
    const [koodiList, setKoodiList] = useState<KoodiList[] | undefined>(undefined);
    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            const list = await relationSources.reduce(
                async (p, c) => [
                    ...(await p),
                    ...((await fetchKoodistoKoodis(c.koodistoUri, c.versio, controller)) || []),
                ],
                Promise.resolve([] as KoodiList[])
            );

            list && setKoodiList(list);
        })();
        return () => {
            controller.abort();
        };
    }, [relationSources]);
    return (
        <Modal
            header={<FormattedMessage id={'KOODI_SUHDE_MODAL_HEADER'} defaultMessage={'Valitse koodit'} />}
            body={(koodiList && <KoodiTable modal koodiList={koodiList} setSelected={setSelected} />) || <Loading />}
            footer={<SuhdeModalFooter selected={selected} close={close} save={save} />}
            onClose={close}
        ></Modal>
    );
};
