import { MessageDescriptor } from '@formatjs/intl/src/types';
import { FormatXMLElementFn, PrimitiveType } from 'intl-messageformat';
import { Options as IntlMessageFormatOptions } from 'intl-messageformat/src/core';

export type Kieli = 'EN' | 'FI' | 'SV';
export type ApiDate = `${number}${number}${number}${number}-${number}${number}-${number}${number}`;

export type Metadata = {
    kieli: Kieli;
    nimi: string;
    kuvaus?: string;
    lyhytnimi?: string;
    kayttoohje?: string;
    kasite?: string;
    sisaltaamerkityksen?: string;
    eisisallamerkitysta?: string;
    huomioitavakoodi?: string;
    sisaltaakoodiston?: string;
    kohdealue?: string;
    sitovuustaso?: string;
    kohdealueenOsaAlue?: string;
    toimintaymparisto?: string;
    tarkentaaKoodistoa?: string;
    huomioitavaKoodisto?: string;
    koodistonLahde?: string;
};

export type Koodi = UpsertKoodi & {
    versio: number;
    version: number;
    koodiUri: string;
    paivitysPvm: string;
    resourceUri: string;
    tila: string;
    koodisto?: { koodistoUri: string };
};
export type UpsertKoodi = {
    koodiArvo: string;
    voimassaAlkuPvm?: string;
    voimassaLoppuPvm?: string;
    metadata: Metadata[];
};
export type CsvKoodiObject = Omit<Koodi, 'metadata' | 'versio' | 'version'> & {
    koodistoUri: string;
    versio: string;
    version: string;
    nimi_FI: string;
    nimi_SV: string;
    nimi_EN: string;
    lyhytNimi_FI: string;
    lyhytNimi_SV: string;
    lyhytNimi_EN: string;
    eiSisallaMerkitysta_FI: string;
    eiSisallaMerkitysta_SV: string;
    eiSisallaMerkitysta_EN: string;
    huomioitavaKoodi_FI: string;
    huomioitavaKoodi_SV: string;
    huomioitavaKoodi_EN: string;
    kasite_FI: string;
    kasite_SV: string;
    kasite_EN: string;
    kayttoohje_FI: string;
    kayttoohje_SV: string;
    kayttoohje_EN: string;
    kuvaus_FI: string;
    kuvaus_SV: string;
    kuvaus_EN: string;
    sisaltaaKoodiston_FI: string;
    sisaltaaKoodiston_SV: string;
    sisaltaaKoodiston_EN: string;
    sisaltaaMerkityksen_FI: string;
    sisaltaaMerkityksen_SV: string;
    sisaltaaMerkityksen_EN: string;
    newRow: boolean;
};

export type MessageFormatter = (
    descriptor: MessageDescriptor,
    values?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>>,
    opts?: IntlMessageFormatOptions
) => string;
