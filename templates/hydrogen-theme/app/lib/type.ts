import type {TypeFromSelection} from 'groqd';
import type {
  CountryCode,
  CurrencyCode,
  LanguageCode,
} from '@shopify/hydrogen/storefront-api-types';
import type {IMAGE_FRAGMENT} from '~/qroq/fragments';

export type I18nLocale = Locale & {
  pathPrefix: string;
};

export type Locale = {
  language: LanguageCode;
  languageLabel: string;
  country: CountryCode;
  label: string;
  currency: CurrencyCode;
  isoCode: string;
};

export type Localizations = Record<string, Locale>;

export type SanityImageFragment = TypeFromSelection<typeof IMAGE_FRAGMENT>;
