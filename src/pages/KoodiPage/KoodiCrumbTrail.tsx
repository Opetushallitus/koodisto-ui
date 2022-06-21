import React, { useEffect, useState } from 'react';
import { translateMetadata } from '../../utils';
import { useAtom } from 'jotai';
import { casMeLangAtom } from '../../api/kayttooikeus';
import { CrumbTrail } from '../../components/KoodistoPathContainer';
import type { Koodi, PageKoodisto } from '../../types';
import { fetchPageKoodisto } from '../../api/koodisto';

export const KoodiCrumbTrail: React.FC<{ koodi: Koodi }> = ({ koodi }) => {
    const [lang] = useAtom(casMeLangAtom);
    const [koodisto, setKoodisto] = useState<PageKoodisto | undefined>(undefined);
    useEffect(() => {
        (async () => {
            const data = await fetchPageKoodisto({ koodistoUri: koodi.koodistoUri, lang });
            setKoodisto(data);
        })();
    }, []);
    const trail = [
        ...((koodisto && [
            {
                path: `/koodisto/view/${koodisto.koodistoUri}/${koodisto.versio}`,
                label: translateMetadata({ metadata: koodisto.metadata, lang })?.nimi || koodisto.koodistoUri,
            },
        ]) || [{ path: undefined, label: undefined }]),
        {
            label: translateMetadata({ metadata: koodi.metadata, lang })?.nimi || koodi.koodiUri,
        },
    ];
    return <CrumbTrail trail={trail} />;
};
