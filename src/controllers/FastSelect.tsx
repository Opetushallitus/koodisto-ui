import * as React from 'react';
import { useMemo, useState } from 'react';
import Select from '@opetushallitus/virkailija-ui-components/Select';
import { SelectOption } from '../types';
import { escapeRegExp, sortBy } from 'lodash';

const MAX_DISPLAYED_OPTIONS = 500;
export const FastSelect: React.FC<{
    id: string;
    options: SelectOption[];
    value: { label: string; value: string };
    error: boolean;
    isDisabled?: boolean;
}> = ({ options, value, ...props }) => {
    const [inputValue, setInputValue] = useState('');
    const filteredOptions = useMemo(() => {
        if (!inputValue) {
            return options;
        }

        const matchByStart = [] as SelectOption[];
        const matchByInclusion = [] as SelectOption[];

        const regByInclusion = new RegExp(escapeRegExp(inputValue), 'i');
        const regByStart = new RegExp(`^${escapeRegExp(inputValue)}`, 'i');

        options
            .filter((option) => regByInclusion.test(option.label))
            .forEach((option) =>
                regByStart.test(option.label) ? matchByStart.push(option) : matchByInclusion.push(option)
            );

        return sortBy([...matchByStart, ...matchByInclusion], [(o) => o.label]);
    }, [inputValue, options]);

    const slicedOptions = useMemo(
        () => [
            ...filteredOptions.slice(0, MAX_DISPLAYED_OPTIONS),
            ...(filteredOptions.findIndex((a) => {
                return value && a.value === value.value;
            }) >= 0
                ? []
                : [value]),
        ],
        [filteredOptions, value]
    );

    return (
        <Select
            {...props}
            value={value}
            options={slicedOptions}
            onInputChange={(a) => setInputValue(a)}
            filterOption={() => true}
        />
    );
};
