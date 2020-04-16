const gulp = require('gulp');
const rename = require('gulp-rename');
const gulpSentryRelease = require('gulp-sentry-release');
const git = require('git-rev-sync');

const { sourceMapFolder } = require('./includes/constants');

const sentryArtifactOpts = {
  DOMAIN: '~/resource',
  API_URL: 'https://app.getsentry.com/api/0/projects/simpplr/simpplr/',
  API_KEY: '0ffadae19104440d839063b5c94fdf10d40d980c392e401e9cb8c73182c2ad2b',
  version: git.long(),
};

/**
 * Push sourcemaps to Sentry to make stacktraces more
 * useful - otherwise you just get the minified code.
 * Only runs on dist.
 */
const sentryRelease = () => {
  return gulp
    .src(['./dist/*.min.js', './dist/' + sourceMapFolder + '/*.map'])
    .pipe(
      rename(function(path) {
        // files on production use the format of Simpplr__app_min_js
        // source map files need to be in the format of app.min.js.map
        const ext = path.extname;
        if (ext !== '.map') {
          path.basename = 'Simpplr__' + path.basename.replace(/\./g, '_');
          path.extname = ext.replace(/\./g, '_');
        } else {
          path.basename = sourceMapFolder + '/' + path.basename;
        }
      })
    )
    .pipe(gulpSentryRelease(sentryArtifactOpts).release(git.long()));
};

module.exports = sentryRelease;
