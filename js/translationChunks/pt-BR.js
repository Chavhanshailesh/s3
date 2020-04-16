import 'moment/locale/pt-br';
import froala from 'froala-editor/js/languages/pt_br';
import { countries } from 'i18n-iso-countries/langs/pt.json';
import { countriesToMap } from './common';
import translations from '../../translations/pt-BR/web.json';

export default {
  translations: {
    'pt-BR': {
      ...countriesToMap(countries),
      ...translations,
    },
  },
  froala,
};
