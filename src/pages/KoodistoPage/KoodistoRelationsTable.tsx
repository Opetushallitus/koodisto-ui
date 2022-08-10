import * as React from 'react';
import { useMemo, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Table } from '../../components/Table';
import { Link } from 'react-router-dom';
import { KoodistoRelation, ListKoodisto, PageKoodisto } from '../../types';
import Button from '@opetushallitus/virkailija-ui-components/Button';
import { ButtonLabelPrefix } from '../KoodistoTablePage/KoodistoTablePage';
import { IconWrapper } from '../../components/IconWapper';
import { SuhdeModal } from './SuhdeModal';
import { ColumnDef } from '@tanstack/react-table';
import { UseFieldArrayReplace } from 'react-hook-form';

type KoodistoRelationsTableProps = {
    koodistoRelations: KoodistoRelation[];
    editable: boolean;
    replace?: UseFieldArrayReplace<PageKoodisto>;
};

const AddSuhdeButton: React.FC<{ name: string; onClick: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({
    name,
    onClick,
}) => {
    return (
        <Button name={name} onClick={onClick} variant={'text'}>
            <ButtonLabelPrefix>
                <IconWrapper icon="el:plus" inline={true} fontSize={'0.6rem'} />
            </ButtonLabelPrefix>
            <FormattedMessage id={'TAULUKKO_LISAA_KOODISTOJA_BUTTON'} defaultMessage={'Lisää koodistoja'} />
        </Button>
    );
};

const KoodistoRelationsTable: React.FC<KoodistoRelationsTableProps> = ({ koodistoRelations, editable, replace }) => {
    const { formatMessage, locale } = useIntl();

    const [showSuhdeModal, setShowSuhdeModal] = useState<boolean>(false);
    const showModal = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        setShowSuhdeModal(true);
    };
    const data = useMemo<KoodistoRelation[]>(() => {
        return [...koodistoRelations];
    }, [koodistoRelations]);
    const columns = React.useMemo<ColumnDef<KoodistoRelation>[]>(
        () => [
            {
                header: formatMessage({ id: 'TAULUKKO_KOODISTO_OTSIKKO', defaultMessage: 'Koodisto' }),
                columns: [
                    {
                        id: 'nimi',
                        cell: (info) => (
                            <Link to={`/koodisto/${info.row.original.koodistoUri}/${info.row.original.koodistoVersio}`}>
                                {info.row.original.nimi?.[locale as keyof typeof info.row.original.nimi] ||
                                    info.row.original.nimi?.['fi']}
                            </Link>
                        ),
                    },
                ],
            },
            {
                header: formatMessage({ id: 'TAULUKKO_VERSIO_OTSIKKO', defaultMessage: 'Versio' }),
                columns: [
                    {
                        id: 'koodistoVersio',
                        header: '',
                        enableColumnFilter: false,
                        accessorKey: 'koodistoVersio',
                    },
                ],
            },
            {
                header: formatMessage({ id: 'TAULUKKO_VERSIO_KUVAUS', defaultMessage: 'Kuvaus' }),
                columns: [
                    {
                        id: 'kuvaus',
                        header: '',
                        enableColumnFilter: false,
                        accessorFn: (relation: KoodistoRelation) =>
                            relation.kuvaus?.[locale as keyof typeof relation.kuvaus] || relation.kuvaus?.['fi'],
                    },
                ],
            },
        ],
        [formatMessage, locale]
    );
    const addNewKoodistoToRelations = (relations: KoodistoRelation[], koodisto: ListKoodisto[]) => {
        replace &&
            replace([
                ...relations,
                ...koodisto.map((a) => ({
                    koodistoUri: a.koodistoUri,
                    koodistoVersio: a.versio,
                    nimi: { fi: a.nimi || '', sv: a.nimi || '', en: a.nimi || '' },
                    kuvaus: { fi: a.kuvaus || '', sv: a.kuvaus || '', en: a.kuvaus || '' },
                    passive: false,
                    status: 'NEW' as const,
                })),
            ]);
    };
    return (
        <>
            <Table<KoodistoRelation> columns={columns} data={data}>
                {editable && <AddSuhdeButton name={'TAULUKKO_LISAA_SISALTYY_KOODISTOJA_BUTTON'} onClick={showModal} />}
            </Table>
            {showSuhdeModal && (
                <SuhdeModal
                    oldRelations={koodistoRelations}
                    save={(a) => addNewKoodistoToRelations(koodistoRelations, a)}
                    close={() => setShowSuhdeModal(false)}
                />
            )}
        </>
    );
};
export default KoodistoRelationsTable;
