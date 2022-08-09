import * as React from 'react';
import { useMemo, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Table } from '../../components/Table';
import { Link } from 'react-router-dom';
import { KoodistoRelation } from '../../types';
import Button from '@opetushallitus/virkailija-ui-components/Button';
import { ButtonLabelPrefix } from '../KoodistoTablePage/KoodistoTablePage';
import { IconWrapper } from '../../components/IconWapper';
import { SuhdeModal } from './SuhdeModal';
import { ColumnDef } from '@tanstack/react-table';

type KoodistoRelationsTableProps = {
    koodistoRelations: KoodistoRelation[];
    editable: boolean;
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

const KoodistoRelationsTable: React.FC<KoodistoRelationsTableProps> = ({ koodistoRelations, editable }) => {
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
                                {info.row.original.nimi[locale as keyof typeof info.row.original.nimi] ||
                                    info.row.original.nimi['fi']}
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
                            relation.kuvaus[locale as keyof typeof relation.kuvaus] || relation.kuvaus['fi'],
                    },
                ],
            },
        ],
        [formatMessage, locale]
    );

    return (
        <>
            <Table<KoodistoRelation> columns={columns} data={data}>
                {editable && <AddSuhdeButton name={'TAULUKKO_LISAA_SISALTYY_KOODISTOJA_BUTTON'} onClick={showModal} />}
            </Table>
            {showSuhdeModal && <SuhdeModal close={() => setShowSuhdeModal(false)} />}
        </>
    );
};
export default KoodistoRelationsTable;
