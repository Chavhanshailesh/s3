import i18next from 'i18next';
import moment from 'moment';

let translator = null;

const DEFAULT_NAMESPACE = 'translation';

// This function doesnt get called anywhere but webpack detects the chunks imported
// inside it and builds them so that we can include the relevant chunk ahead of time
// in the footer before other JS resources
// eslint-disable-next-line no-unused-vars
function defineChunks() {
  import(
    '../translationChunks/en-US' /* webpackMode: "lazy", webpackChunkName: "lang-en-US" */
  );
  import(
    '../translationChunks/en-GB' /* webpackMode: "lazy", webpackChunkName: "lang-en-GB" */
  );
  import(
    '../translationChunks/es-ES' /* webpackMode: "lazy", webpackChunkName: "lang-es-ES" */
  );
  import(
    '../translationChunks/fr-FR' /* webpackMode: "lazy", webpackChunkName: "lang-fr-FR" */
  );
  import(
    '../translationChunks/pt-BR' /* webpackMode: "lazy", webpackChunkName: "lang-pt-BR" */
  );
  import(
    '../translationChunks/de-DE' /* webpackMode: "lazy", webpackChunkName: "lang-de-DE" */
  );
  import(
    '../translationChunks/ja-JP' /* webpackMode: "lazy", webpackChunkName: "lang-ja-JP" */
  );
  import(
    '../translationChunks/it-IT' /* webpackMode: "lazy", webpackChunkName: "lang-it-IT" */
  );
}

export function setupTranslator(lng, locale, appName) {
  translator = i18next.createInstance(
    {
      lng,
      fallbackLng: locale.fallbackLng,
      initImmediate: false,
      debug: false,
      saveMissing: true,
      interpolation: {
        format: (value, format) => {
          if (format === 'join') {
            return value.join(', ');
          }

          if (format === 'lowercase') {
            return (value || '').toLowerCase();
          }

          return value;
        },
        // Whoa there! This seems risky, but we are mostly outputting strings in
        // React components, which will escape for us anyway, so i18next needn't
        escapeValue: false,
        defaultVariables: {
          appName,
        },
      },
    },
    (err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.warn(err);
      }
    }
  );

  translator.on('missingKey', (lngs, namespace, key, res) => {
    const message = `Missing translation key (${lngs}): ${key}`;

    // eslint-disable-next-line no-console
    console.warn(message);

    if (global.Raven) {
      global.Raven.captureMessage(message, {
        level: 'warning',
        tags: {
          lngs,
          namespace,
          key,
          res,
        },
      });
    }
  });

  const { translations, froala } = locale.default;
  const [language] = lng.split('-');

  // Register froala translations globally
  if (froala) {
    froala(null, global.jQuery);
  }

  try {
    Object.keys(translations).forEach((key) => {
      translator.addResources(key, DEFAULT_NAMESPACE, translations[key]);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(
      'Error loading translations. Have you nested a translation key?'
    );
  }

  // Set moment locale globally
  moment.locale(language);

  global.Simpplr.translator = translator;

  return translator;
}

export async function initTranslation(overrideLng = null) {
  if (!global.Simpplr.Settings) {
    throw new Error(
      'Initialised Translator too soon - Settings must be initialised first'
    );
  }

  const lng = overrideLng || document.documentElement.lang;

  console.log(lng)

  // weak mode won't make a network request to get the module, this means that the
  // chunk *must* be included explictly on the page
  const locale = await import(
    `../translationChunks/${lng}` /* webpackMode: "weak" */
  );

  return setupTranslator(lng, locale, global.Simpplr.Settings.appName);
}

export default function getTranslator() {
  if (!translator) {
    initTranslation();
  }

  return translator;
}
