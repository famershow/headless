import type { InferType } from "groqd";
import type {
  CountryCode,
  CurrencyCode,
  LanguageCode,
} from "@shopify/hydrogen/storefront-api-types";

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

export type SectionFragment<T> = {
  [K in keyof T]: InferType<T[K]>;
};
