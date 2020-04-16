const gulp = require('gulp');

const { crowdinDownload } = require('./crowdin');
// const buildEmojiData = require('./buildEmojiData');
// const jsLegacyVendor = require('./jsLegacyVendor');
// const jsLegacy = require('./jsLegacy');
// const watchDev = require('./watchDev');
const { webpackCompiler } = require('./webpack');
const clearCache = require('./clearCache');

/**
 * Watch task for development only
 */
const watch = gulp.series(
  crowdinDownload,
  //gulp.parallel(buildEmojiData, jsLegacyVendor, jsLegacy),
  //watchDev,
  clearCache,
  webpackCompiler
);

module.exports = watch;
