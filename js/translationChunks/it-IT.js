import 'moment/locale/it';
import froala from 'froala-editor/js/languages/it';
import { countries } from 'i18n-iso-countries/langs/it.json';
import { countriesToMap } from './common';
import translations from '../../translations/it-IT/web.json';

export default {
  translations: {
    'it-IT': {
      ...countriesToMap(countries),
      ...translations,
    },
  },
  froala,
};
