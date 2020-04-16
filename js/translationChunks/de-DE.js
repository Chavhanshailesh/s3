import 'moment/locale/de';
import froala from 'froala-editor/js/languages/de';
import { countries } from 'i18n-iso-countries/langs/de.json';
import { countriesToMap } from './common';
import translations from '../../translations/de-DE/web.json';

export default {
  translations: {
    'de-DE': {
      ...countriesToMap(countries),
      ...translations,
    },
  },
  froala,
};
