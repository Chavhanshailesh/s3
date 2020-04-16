import 'moment/locale/en-gb';
import { countries } from 'i18n-iso-countries/langs/en.json';

import { countriesToMap } from './common';
import translations from '../../translations/en-GB/web.json';

export default {
  fallbackLng: {
    'en-GB': ['en-US'],
  },
  translations: {
    'en-GB': {
      ...countriesToMap(countries),
      ...translations,
    },
  },
};
