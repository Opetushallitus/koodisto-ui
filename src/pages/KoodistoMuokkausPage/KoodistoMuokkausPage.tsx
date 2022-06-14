import * as React from 'react';
import { useEffect, useState } from 'react';
import { fetchPageKoodisto, updateKoodisto } from '../../api/koodisto';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { PageKoodisto } from '../../types';
import { Loading } from '../../components/Loading';
import Input from '@opetushallitus/virkailija-ui-components/Input';
import Button from '@opetushallitus/virkailija-ui-components/Button';
import { FormattedMessage, useIntl } from 'react-intl';
import { KoodistoPathContainer } from '../../components/KoodistoPathContainer';
import { translateMetadata } from '../../utils';
import { useAtom } from 'jotai';
import { casMeLangAtom } from '../../api/kayttooikeus';
import { DatePickerController } from '../../controllers/DatePickerController';
import { InputArray } from './InputArray';
import { success } from '../../components/Notification';
import {
    MainHeaderContainer,
    MainContainer,
    FooterContainer,
    FooterLeftContainer,
    FooterRightContainer,
} from '../../components/Containers';
import { IconWrapper } from '../../components/IconWapper';

export const KoodistoMuokkausPage: React.FC = () => {
    const navigate = useNavigate();
    const { formatMessage } = useIntl();
    const { versio, koodistoUri } = useParams();
    const [lang] = useAtom(casMeLangAtom);
    const [loading, setLoading] = useState<boolean>(false);
    const versioNumber = versio ? +versio : undefined;
    const {
        control,
        register,
        handleSubmit,
        reset,
        getValues,
        setValue,
        formState: { errors },
    } = useForm<PageKoodisto>({
        shouldUseNativeValidation: true,
        defaultValues: { metadata: [{ kieli: 'FI' }, { kieli: 'SV' }, { kieli: 'EN' }] },
    });
    const koodistonMetadata = translateMetadata({ metadata: getValues('metadata'), lang });
    useEffect(() => {
        (async () => {
            if (koodistoUri && versioNumber) {
                setLoading(true);
                const koodistoData = await fetchPageKoodisto(koodistoUri, versioNumber);
                reset(koodistoData);
                setLoading(false);
            }
        })();
    }, [koodistoUri, reset, versioNumber]);
    const update = async (props: PageKoodisto) => {
        setLoading(true);
        const updated = await updateKoodisto(props);
        reset(updated);
        setLoading(false);
        updated &&
            success({
                title: (
                    <FormattedMessage
                        id={'KOODISTO_TALLENNUS_MESSAGE_TITLE'}
                        defaultMessage={'Koodisto tallennettiin onnistuneesti.'}
                    />
                ),
                message: (
                    <FormattedMessage
                        id={'KOODISTO_TALLENNUS_MESSAGE'}
                        defaultMessage={'Tallennettiin koodisto uri:lla {koodistoUri}'}
                        values={{ koodistoUri: updated?.koodistoUri }}
                    />
                ),
            });
    };
    return (
        (!loading && (
            <>
                <KoodistoPathContainer path={[koodistonMetadata?.nimi || '']} />
                <MainHeaderContainer>
                    <FormattedMessage
                        id={'KOODISTO_MUOKKAA_SIVU_TITLE'}
                        defaultMessage={'Muokkaa koodistoa'}
                        tagName={'h1'}
                    />
                </MainHeaderContainer>
                <MainContainer>
                    <form>
                        <FormattedMessage id={'FIELD_TITLE_koodistoRyhmaUri'} defaultMessage={'Koodistoryhmä*'} />
                        <Input
                            {...register('koodistoRyhmaUri', {
                                required: formatMessage({
                                    id: 'FI_RYHMA_PAKOLLINEN',
                                    defaultMessage: 'Valitse koodisto-ryhmä.',
                                }),
                            })}
                        />
                        <InputArray
                            control={control}
                            register={register}
                            getValues={getValues}
                            setValue={setValue}
                            title={{ id: 'FIELD_ROW_TITLE_NIMI', defaultMessage: 'Nimi*' }}
                            fieldPath={'nimi'}
                        />
                        <FormattedMessage id={'FIELD_TITLE_voimassaAlkuPvm'} defaultMessage={'Voimassa'} />
                        <DatePickerController<PageKoodisto>
                            name={'voimassaAlkuPvm'}
                            form={control}
                            validationErrors={errors}
                        />
                        <FormattedMessage id={'FIELD_TITLE_voimassaLoppuPvm'} defaultMessage={'Voimassa loppu'} />
                        <DatePickerController<PageKoodisto>
                            name={'voimassaLoppuPvm'}
                            form={control}
                            validationErrors={errors}
                        />
                        <FormattedMessage id={'FIELD_TITLE_organisaatioNimi'} defaultMessage={'Organisaatio*'} />
                        <Input
                            {...register('organisaatioNimi.fi', {
                                required: formatMessage({
                                    id: 'FI_ORGANISAATIO_PAKOLLINEN',
                                    defaultMessage: 'Valitse organisaatio.',
                                }),
                            })}
                        />
                        <FormattedMessage id={'FIELD_TITLE_omistaja'} defaultMessage={'Omistaja'} />
                        <Input {...register('omistaja')} />
                        <InputArray
                            control={control}
                            register={register}
                            getValues={getValues}
                            setValue={setValue}
                            title={{ id: 'FIELD_ROW_TITLE_KUVAUS', defaultMessage: 'Kuvaus' }}
                            fieldPath={'kuvaus'}
                        />
                    </form>
                </MainContainer>
                <FooterContainer>
                    <FooterLeftContainer>
                        <Button variant={'outlined'} name={'KOODISTO_VERSIOI'}>
                            <FormattedMessage id={'KOODISTO_VERSIOI'} defaultMessage={'Versioi koodisto'} />
                        </Button>
                        <Button variant={'outlined'} name={'KOODISTO_POISTA'}>
                            <IconWrapper icon={'ci:trash-full'} inline={true} height={'1.2rem'} />
                            <FormattedMessage id={'KOODISTO_POISTA'} defaultMessage={'Poista koodisto'} />
                        </Button>
                    </FooterLeftContainer>
                    <FooterRightContainer>
                        <Button
                            variant={'outlined'}
                            name={'KOODISTO_PERUUTA'}
                            onClick={() => navigate(`/koodisto/view/${koodistoUri}/${versio}`)}
                        >
                            <FormattedMessage id={'KOODISTO_PERUUTA'} defaultMessage={'Peruuta'} />
                        </Button>
                        <Button name={'KOODISTO_TALLENNA'} onClick={handleSubmit((a) => update(a))}>
                            <FormattedMessage id={'KOODISTO_TALLENNA'} defaultMessage={'Tallenna'} />
                        </Button>
                    </FooterRightContainer>
                </FooterContainer>
            </>
        )) || <Loading />
    );
};
