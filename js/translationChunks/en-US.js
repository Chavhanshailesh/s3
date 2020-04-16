import { countries } from 'i18n-iso-countries/langs/en.json';
import { countriesToMap } from './common';
import translations from '../../translations/en-US/web.json';

export default {
  translations: {
    'en-US': {
      ...countriesToMap(countries),
      ...translations,
    },
  },
};
