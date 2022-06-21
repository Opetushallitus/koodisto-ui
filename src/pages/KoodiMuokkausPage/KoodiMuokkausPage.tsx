import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FooterContainer,
    FooterLeftContainer,
    FooterRightContainer,
    MainHeaderContainer,
    MainContainer,
    MainContainerRow,
    MainContainerRowTitle,
    MainContainerRowContent,
} from '../../components/Containers';
import Button from '@opetushallitus/virkailija-ui-components/Button';
import { FormattedMessage } from 'react-intl';
import { IconWrapper } from '../../components/IconWapper';
import { CrumbTrail } from '../../components/KoodistoPathContainer';
import { fetchPageKoodi } from '../../api/koodi';
import { useForm, UseFormReturn } from 'react-hook-form';
import { Koodi } from '../../types';
import { Loading } from '../../components/Loading';
import Input from '@opetushallitus/virkailija-ui-components/Input';

export const KoodiMuokkausPage: React.FC = () => {
    const { koodiUri, koodiVersio } = useParams();
    const [loading, setLoading] = useState<boolean>(false);
    const formReturn = useForm<Koodi>({
        shouldUseNativeValidation: true,
        defaultValues: { metadata: [{ kieli: 'FI' }, { kieli: 'SV' }, { kieli: 'EN' }] },
    });
    useEffect(() => {
        if (koodiUri && koodiVersio) {
            (async () => {
                setLoading(true);
                const data = await fetchPageKoodi(koodiUri, +koodiVersio);
                data && formReturn.reset(data);
                setLoading(false);
            })();
        }
    }, [koodiUri, koodiVersio, formReturn.reset]);
    const save = (a: Koodi) => {
        console.log(a);
    };
    return (loading && <Loading />) || <KoodiMuokkausPageComponent {...formReturn} save={save} />;
};
const KoodiMuokkausPageComponent: React.FC<{ save: (a: Koodi) => void } & UseFormReturn<Koodi>> = ({
    register,
    handleSubmit,
    save,
}) => {
    const navigate = useNavigate();
    const { koodiUri, koodiVersio } = useParams();
    return (
        <>
            <CrumbTrail trail={[{ label: koodiUri || '' }]} />
            <MainHeaderContainer>
                <FormattedMessage id={'KOODI_MUOKKAA_SIVU_TITLE'} defaultMessage={'Muokkaa koodia'} tagName={'h1'} />
            </MainHeaderContainer>
            <MainContainer>
                <MainContainerRow>
                    <MainContainerRowTitle id={'FIELD_TITLE_koodiArvo'} defaultMessage={'Arvo'} />
                    <MainContainerRowContent>
                        <Input {...register('koodiArvo')} />
                    </MainContainerRowContent>
                </MainContainerRow>
            </MainContainer>
            <FooterContainer>
                <FooterLeftContainer>
                    <Button variant={'outlined'} name={'KOODI_VERSIOI'}>
                        <FormattedMessage id={'KOODI_VERSIOI'} defaultMessage={'Versioi koodi'} />
                    </Button>
                    <Button variant={'outlined'} name={'KOODI_POISTA'}>
                        <IconWrapper icon={'ci:trash-full'} inline={true} height={'1.2rem'} />
                        <FormattedMessage id={'KOODI_POISTA'} defaultMessage={'Poista koodi'} />
                    </Button>
                </FooterLeftContainer>
                <FooterRightContainer>
                    <Button
                        variant={'outlined'}
                        name={'KOODI_PERUUTA'}
                        onClick={() => navigate(`/koodi/view/${koodiUri}/${koodiVersio}`)}
                    >
                        <FormattedMessage id={'KOODI_PERUUTA'} defaultMessage={'Peruuta'} />
                    </Button>
                    <Button name={'KOODI_TALLENNA'} onClick={handleSubmit((a) => save(a))}>
                        <FormattedMessage id={'KOODI_TALLENNA'} defaultMessage={'Tallenna'} />
                    </Button>
                </FooterRightContainer>
            </FooterContainer>
        </>
    );
};
