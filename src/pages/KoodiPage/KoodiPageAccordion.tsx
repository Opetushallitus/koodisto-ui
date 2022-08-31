import React from 'react';
import { Accordion } from '../../components/Accordion';
import { useIntl, FormattedMessage } from 'react-intl';
import { KoodiRelationsTable } from './KoodiRelationsTable';
import { Koodi, KoodiList } from '../../types';
import { UseFieldArrayReturn } from 'react-hook-form';
import styled from 'styled-components';
import Button from '@opetushallitus/virkailija-ui-components/Button';
import { StyledPopup } from '../../components/Modal/Modal';
import { KoodiSuhdeModal } from './KoodiSuhdeModal';
import { fetchPageKoodi } from '../../api/koodi';

type KoodiPageAccordionProps = {
    koodi: Koodi;
    editable?: boolean;
    sisaltyyKoodeihinReturn?: UseFieldArrayReturn<Koodi>;
    sisaltaaKooditReturn?: UseFieldArrayReturn<Koodi>;
    rinnastuuKoodeihinReturn?: UseFieldArrayReturn<Koodi>;
};
const AccordionContainer = styled.div`
    padding-top: 1rem;
`;
const AccordionHeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
`;
export const KoodiPageAccordion: React.FC<KoodiPageAccordionProps> = ({
    koodi,
    editable,
    sisaltyyKoodeihinReturn,
    sisaltaaKooditReturn,
    rinnastuuKoodeihinReturn,
}) => {
    const { formatMessage } = useIntl();
    const data = [
        {
            id: 'is-incuded',
            localizedHeadingTitle: formatMessage(
                {
                    id: 'TAULUKKO_SISALTYY_KOODEIHIN_OTSIKKO',
                    defaultMessage: 'Sisältyy koodeihin ({count})',
                },
                { count: koodi.sisaltyyKoodeihin?.length }
            ),
            panelComponent: (
                <KoodiRelationsTable
                    relationSources={koodi?.koodisto?.sisaltyyKoodistoihin?.map((a) => ({
                        koodistoUri: a.koodistoUri,
                        versio: a.koodistoVersio,
                    }))}
                    editable={!!editable}
                    relations={koodi.sisaltyyKoodeihin || []}
                    fieldArrayReturn={sisaltyyKoodeihinReturn}
                />
            ),
        },
        {
            id: 'includes',
            localizedHeadingTitle: formatMessage(
                {
                    id: 'TAULUKKO_SISALTAA_KOODIT_OTSIKKO',
                    defaultMessage: 'Sisältää koodit ({count})',
                },
                { count: koodi.sisaltaaKoodit?.length }
            ),
            panelComponent: (
                <KoodiRelationsTable
                    relationSources={koodi?.koodisto?.sisaltaaKoodistot?.map((a) => ({
                        koodistoUri: a.koodistoUri,
                        versio: a.koodistoVersio,
                    }))}
                    editable={!!editable}
                    relations={koodi.sisaltaaKoodit || []}
                    fieldArrayReturn={sisaltaaKooditReturn}
                />
            ),
        },
        {
            id: 'levels-with',
            localizedHeadingTitle: formatMessage(
                {
                    id: 'TAULUKKO_RINNASTUU_KOODEIHIN_OTSIKKO',
                    defaultMessage: 'Rinnastuu koodeihin ({count})',
                },
                { count: koodi.rinnastuuKoodeihin?.length }
            ),
            panelComponent: (
                <KoodiRelationsTable
                    relationSources={koodi?.koodisto?.rinnastuuKoodistoihin?.map((a) => ({
                        koodistoUri: a.koodistoUri,
                        versio: a.koodistoVersio,
                    }))}
                    editable={!!editable}
                    relations={koodi.rinnastuuKoodeihin || []}
                    fieldArrayReturn={rinnastuuKoodeihinReturn}
                />
            ),
        },
    ];

    const addRelationsToForm = async (fromKoodiList: KoodiList[]) => {
        for (const fromKoodi of fromKoodiList) {
            const fromKoodiData = await fetchPageKoodi(fromKoodi.koodiUri, fromKoodi.versio);
            sisaltyyKoodeihinReturn?.append(fromKoodiData?.sisaltyyKoodeihin || []);
            sisaltaaKooditReturn?.append(fromKoodiData?.sisaltaaKoodit || []);
            rinnastuuKoodeihinReturn?.append(fromKoodiData?.rinnastuuKoodeihin || []);
        }
    };

    return (
        <AccordionContainer>
            <AccordionHeaderContainer>
                <FormattedMessage id={'KOODI_SUHTEET_TITLE'} defaultMessage={'Koodin suhteet'} tagName={'h2'} />
                {editable && (
                    <StyledPopup
                        trigger={
                            <Button name={'KOODI_KOPIOI_SUHTEET_BUTTON'} variant={'text'}>
                                <FormattedMessage
                                    id={'KOODI_KOPIOI_SUHTEET_BUTTON'}
                                    defaultMessage={'Kopioi suhteet koodilta'}
                                />
                            </Button>
                        }
                        modal
                    >
                        {(close: () => void) => (
                            <KoodiSuhdeModal
                                relationSources={[
                                    { koodistoUri: koodi.koodisto.koodistoUri, versio: koodi.koodisto.versio },
                                ]}
                                save={(koodiList) => koodiList.length && addRelationsToForm(koodiList)}
                                close={close}
                            />
                        )}
                    </StyledPopup>
                )}
            </AccordionHeaderContainer>
            <Accordion data={data} />
        </AccordionContainer>
    );
};
