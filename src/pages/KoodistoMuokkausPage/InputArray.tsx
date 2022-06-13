import { MessageDescriptor, useIntl, FormattedMessage } from 'react-intl';
import { FieldPath, Control, UseFormRegister, UseFormGetValues, UseFormSetValue, useFieldArray } from 'react-hook-form';
import { Metadata, PageKoodisto } from '../../types';
import Input from '@opetushallitus/virkailija-ui-components/Input';
import { IconWrapper } from '../../components/IconWapper';
import * as React from 'react';

export const InputArray = ({
    title,
    fieldPath,
    control,
    register,
    getValues,
    setValue,
}: {
    title: MessageDescriptor;
    fieldPath: FieldPath<Metadata>;
    control: Control<PageKoodisto>;
    register: UseFormRegister<PageKoodisto>;
    getValues: UseFormGetValues<PageKoodisto>;
    setValue: UseFormSetValue<PageKoodisto>;
}) => {
    const { formatMessage } = useIntl();
    const { fields } = useFieldArray({
        control,
        name: 'metadata',
    });
    const copyToNames = (): void => {
        const firstValue = getValues(`metadata.0.${fieldPath}`);
        setValue(`metadata.1.${fieldPath}`, firstValue);
        setValue(`metadata.2.${fieldPath}`, firstValue);
    };
    return (
        <>
            <FormattedMessage {...title} />
            {fields.map((field, index) => (
                <div key={field.id}>
                    <FormattedMessage id={`FIELD_TITLE_${field.kieli}`} defaultMessage={field.kieli} />
                    <Input
                        {...register(`metadata.${index}.${fieldPath}`)}
                        suffix={
                            index === 0 && (
                                <div
                                    title={formatMessage({
                                        id: 'KOPIOI_MUIHIN_NIMIIN',
                                        defaultMessage: 'Kopioi muihin kieliin',
                                    })}
                                    onClick={() => copyToNames()}
                                >
                                    <IconWrapper
                                        icon="ci:copy"
                                        color={'gray'}
                                        height={'1.5rem'}
                                        name={'KOPIOI_MUIHIN_NIMIIN'}
                                    />
                                </div>
                            )
                        }
                    />
                </div>
            ))}
        </>
    );
};
