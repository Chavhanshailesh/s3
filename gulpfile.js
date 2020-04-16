const gulp = require('gulp');

const clearCache = require('./gulp/clearCache');
// const jsLegacyVendor = require('./gulp/jsLegacyVendor');
// const jsLegacy = require('./gulp/jsLegacy');
const {
  webpackCompiler,
  webpackDist,
  //webpackDistCi,
  //webpackDistIntegration,
} = require('./gulp/webpack');
// const templates = require('./gulp/templates');
// const compressLegacyJs = require('./gulp/compressLegacyJs');
// const buildEmojiData = require('./gulp/buildEmojiData');
// const zipIntegration = require('./gulp/zipIntegration');
// const sentryRelease = require('./gulp/sentryRelease');
const { crowdinDownload } = require('./gulp/crowdin');
//const watchDev = require('./gulp/watchDev');
const watch = require('./gulp/watch');
const { dist } = require('./gulp/distribution');

/**
 * This is our gulpfile, it's <s>not</s> now pretty, <s>but</s> and it is ours. 😉
 *
 * It has tasks which deal with:
 *
 *  - Combining and minifying legacy code (both JS and CSS)
 *  - Running webpack to compile modern JS
 *  - Downloading/uploading new translation keys to CrowdIn
 *  - Uploading sourcemaps and release information to Sentry
 *  - Clearing local development cache
 *  - Building emoji JSON data
 */

/**
 * Add all the build tasks to the default task
 *
 * By default we run in development mode for everything and don't apply
 * any kind of minification
 */
module.exports.default = gulp.series(
  // buildEmojiData,
  // jsLegacyVendor,
  // jsLegacy,
  webpackCompiler
);

module.exports = {
  ...module.exports,
  // buildEmojiData,
   clearCache,
  // compressLegacyJs,
  crowdinDownload,
  // crowdinUpload,
  dist,
  // distCi,
  // distIntegration,
  // jsLegacy,
  // jsLegacyVendor,
  // sentryRelease,
  // templates,
  watch,
  //watchDev,
  webpackCompiler,
  webpackDist,
  //webpackDistCi,
  //webpackDistIntegration,
  //zipIntegration,
};
