const fs = require('fs-extra');
const path = require('path');
const gutil = require('gulp-util');
const git = require('git-rev-sync');
const request = require('request-promise');
const download = require('progress-download');

// CrowdIn sync credentials
const CROWDIN_API_KEY = 'cca20ded1193e6e295ff278bc67d9286';
const CROWDIN_PROJECT_ID = 'simpplr';
const CROWDIN_LANGS = [
  'de-DE',
  'en-GB',
  'es-ES',
  'fr-FR',
  'it-IT',
  'ja-JP',
  'pt-BR',
];
// The mapping provides a way to map the language code in CrowdIn into a locale
// that we use in our app. e.g CrowdIn only uses 'fr' for French, whereas
// we need it to be 'fr-FR'
const CROWDIN_LOCALE_NAME_MAP = {
  'de-DE': 'de',
  'fr-FR': 'fr',
  'it-IT': 'it',
  'ja-JP': 'ja',
};

function getReleaseVersion() {
  const branchName = git.branch();
  const [prefix, release, suffix] = branchName.split('/');

  if (suffix !== 'develop') {
    return false;
  }

  return release;
}

// This will upload all the en-US files to CrowdIn
const crowdinUpload = () => {
  return new Promise(async (resolve) => {
    const release = getReleaseVersion();

    if (!release) {
      gutil.log('Skipping CrowdIn upload - not running on develop branch');
      return resolve();
    }

    // Get an array of all the en-US JSON files that should be uploaded
    const sourceDir = './translations/en-US';
    const files = fs
      .readdirSync(sourceDir)
      .map((file) => path.join(sourceDir, file));

    // Build the POST data that CrowdIn needs
    const formData = Object.assign(
      ...files.map((filename) => ({
        [`files[${path.basename(filename)}]`]: fs.createReadStream(filename),
      }))
    );

    const url = `https://api.crowdin.com/api/project/${CROWDIN_PROJECT_ID}/update-file?key=${CROWDIN_API_KEY}&branch=${release}`;
    gutil.log(`Uploading CrowdIn en-US strings for version: ${release}`);

    try {
      await request.post({ url, formData });
      gutil.log('String files uploaded successfully');
      resolve();
    } catch (e) {
      console.log('String files failed to upload', e);
      throw e;
    }
  });
};

// This downloads all languages from CrowdIn (except en-US)
const crowdinDownload = () => {
  return new Promise(async (resolve) => {
    //const release = getReleaseVersion();

    // if (!release) {
    //   gutil.log('Skipping CrowdIn download - not running on develop branch');
    //   return resolve();
    // }
    const release = 'blanc';
    const url = `https://api.crowdin.com/api/project/${CROWDIN_PROJECT_ID}/download/all.zip?key=${CROWDIN_API_KEY}&branch=${release}`;
    gutil.log(`Downloading CrowdIn translations from version: ${release}`);

    if (!fs.existsSync('./dist')) {
      fs.mkdirSync('./dist');
    }

    const tmpDir = './dist/translations-tmp';

    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }

    try {
      // Export the latest translations
      await request.get({
        uri: `https://api.crowdin.com/api/project/${CROWDIN_PROJECT_ID}/export?key=${CROWDIN_API_KEY}&branch=${release}`,
      });

      // Download the most recently exported translations into a temporary directory
      await download(url, tmpDir, { filename: 'all.zip', extract: true });

      // Copy the non en-US langs back into the project
      await Promise.all(
        CROWDIN_LANGS.map((lang) =>
          fs.copy(
            `${tmpDir}/${CROWDIN_LOCALE_NAME_MAP[lang] || lang}`,
            `./translations/${lang}`
          )
        )
      );

      // Delete the Localizable.strings files as we dont need those in the UI codebase
      CROWDIN_LANGS.forEach((lang) =>
        fs.removeSync(`./translations/${lang}/Localizable.strings`)
      );

      fs.removeSync(tmpDir);

      gutil.log('Translation files downloaded successfully');
      resolve();
    } catch (e) {
      console.log('Translation files failed to download');
      throw e;
    }
  });
};

module.exports = {
  crowdinDownload,
  crowdinUpload,
};
