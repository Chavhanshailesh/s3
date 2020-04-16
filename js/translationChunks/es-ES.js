import 'moment/locale/es';
import froala from 'froala-editor/js/languages/es';
import { countries } from 'i18n-iso-countries/langs/es.json';
import { countriesToMap } from './common';
import translations from '../../translations/es-ES/web.json';

export default {
  translations: {
    'es-ES': {
      ...countriesToMap(countries),
      ...translations,
    },
  },
  froala,
};
