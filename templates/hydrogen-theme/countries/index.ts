import type {I18nLocale, Localizations} from '../app/lib/type';

export const countries: Localizations = {
  default: {
    label: 'United States (USD $)',
    language: 'EN',
    languageLabel: 'English',
    country: 'US',
    currency: 'USD',
    isoCode: 'en-us',
  },
  '/fr': {
    label: 'France (EUR €)',
    language: 'FR',
    languageLabel: 'French',
    country: 'FR',
    currency: 'EUR',
    isoCode: 'fr-fr',
  },
  '/gb': {
    label: 'United Kingdom (GBP £)',
    language: 'EN',
    languageLabel: 'English',
    country: 'GB',
    currency: 'GBP',
    isoCode: 'gb-en',
  },
};

export const DEFAULT_LOCALE: I18nLocale = Object.freeze({
  ...countries.default,
  pathPrefix: '',
});

export function getAllLanguages() {
  const uniqueLanguages = [];
  const seenLanguages = new Set<string>();

  for (const key in countries) {
    const language = countries[key].language;
    // Remove duplicates to avoid having same language multiple times
    if (!seenLanguages.has(language)) {
      uniqueLanguages.push({
        id: language.toLocaleLowerCase(),
        title: countries[key].languageLabel,
      });
      seenLanguages.add(language);
    }
  }

  return uniqueLanguages;
}

export function getLocaleFromRequest(request: Request): I18nLocale {
  const url = new URL(request.url);
  const firstPathPart =
    '/' + url.pathname.substring(1).split('/')[0].toLowerCase();

  return countries[firstPathPart]
    ? {
        ...countries[firstPathPart],
        pathPrefix: firstPathPart,
      }
    : {
        ...countries['default'],
        pathPrefix: '',
      };
}

export function getAllLocales() {
  return Object.keys(countries).map((key) => {
    if (key === 'default') {
      return {
        ...countries[key],
        pathPrefix: '',
      };
    }

    return {
      ...countries[key],
      pathPrefix: key,
    };
  });
}
