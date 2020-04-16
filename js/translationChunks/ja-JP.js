import 'moment/locale/ja';
import froala from 'froala-editor/js/languages/ja';
import { countries } from 'i18n-iso-countries/langs/ja.json';
import { countriesToMap } from './common';
import translations from '../../translations/ja-JP/web.json';

export default {
  translations: {
    'ja-JP': {
      ...countriesToMap(countries),
      ...translations,
    },
  },
  froala,
};
