import * as React from 'react';
import { useMemo } from 'react';
import { useAtom } from 'jotai';
import { Column, FilterProps, useFilters, useTable } from 'react-table';
import { Koodisto, koodistoAtom } from '../../../api/codes';
import styled from 'styled-components';

const TableContainer = styled.div`
    overflow-x: scroll;
    overflow-y: hidden;
`;
const Table = styled.table`
    width: 100%;
    border-spacing: 0;
`;
const Th = styled.th`
    text-align: left;
    border-bottom: 1px solid rgba(151, 151, 151, 0.5);
`;
const Td = styled.td``;
const Tr = styled.tr``;
const Tbody = styled.tbody`
    ${Tr}:nth-child(even) {
        background: rgba(245, 245, 245, 1);
    }

    ${Tr}:nth-child(odd) {
        background: rgba(255, 255, 255, 0);
    }
`;
// Define a default UI for filtering
function DefaultColumnFilter<T extends Record<string, unknown>>({
    column: { filterValue, preFilteredRows, setFilter },
}: FilterProps<T>) {
    const count = preFilteredRows.length;

    return (
        <input
            value={filterValue || ''}
            onChange={(e) => {
                setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
            }}
            placeholder={`Search ${count} records...`}
        />
    );
}

const KoodistoTable = () => {
    const [atomData] = useAtom(koodistoAtom);
    const data = useMemo<Koodisto[]>(
        () => atomData.sort((a, b) => a.koodistoUri.localeCompare(b.koodistoUri)),
        [atomData]
    );
    const columns = React.useMemo<Column<Koodisto>[]>(
        () => [
            {
                id: 'koodistoUri',
                Header: 'koodistoUri',
                accessor: 'koodistoUri',
                Filter: DefaultColumnFilter,
                filter: 'text',
            },
            {
                id: 'versio',
                Header: 'versio',
                accessor: (values) => {
                    return values.latestKoodistoVersio.versio;
                },
            },
            {
                id: 'voimassaAlkuPvm',
                Header: 'voimassaAlkuPvm',
                accessor: (values) => {
                    return values.latestKoodistoVersio.voimassaAlkuPvm;
                },
            },
            {
                id: 'voimassaLoppuPvm',
                Header: 'voimassaLoppuPvm',
                accessor: (values) => {
                    return values.latestKoodistoVersio.voimassaLoppuPvm;
                },
            },
        ],
        []
    );
    const defaultColumn = React.useMemo(
        () => ({
            // Let's set up our default Filter UI
            Filter: DefaultColumnFilter,
        }),
        []
    );
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<Koodisto>(
        { columns, data, defaultColumn },
        useFilters
    );
    return (
        <TableContainer>
            <Table {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        // eslint-disable-next-line react/jsx-key
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                // eslint-disable-next-line react/jsx-key
                                <Th {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                                </Th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <Tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                        prepareRow(row);
                        return (
                            // eslint-disable-next-line react/jsx-key
                            <Tr {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    // eslint-disable-next-line react/jsx-key
                                    return <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>;
                                })}
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        </TableContainer>
    );
};
export default KoodistoTable;
