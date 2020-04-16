import 'moment/locale/fr';
import froala from 'froala-editor/js/languages/fr';
import { countries } from 'i18n-iso-countries/langs/fr.json';
import { countriesToMap } from './common';
import translations from '../../translations/fr-FR/web.json';

export default {
  translations: {
    'fr-FR': {
      ...countriesToMap(countries),
      ...translations,
    },
  },
  froala,
};
