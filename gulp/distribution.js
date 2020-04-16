const gulp = require('gulp');

// const zipIntegration = require('./zipIntegration');
// const sentryRelease = require('./sentryRelease');
// const { crowdinDownload } = require('./crowdin');
// const buildEmojiData = require('./buildEmojiData');
// const templates = require('./templates');
// const jsLegacyVendor = require('./jsLegacyVendor');
// const jsLegacy = require('./jsLegacy');
const {
  webpackDist,
  //webpackDistCi,
  //webpackDistIntegration,
} = require('./webpack');
//const compressLegacyJs = require('./compressLegacyJs');
const clearCache = require('./clearCache');

/**
 * Our main dist task.
 *
 * This is run by the backend team when they compile the UI code to go
 * into the salesforce package.
 */
const dist = gulp.series(
  // crowdinDownload,
  // gulp.parallel(
  //   buildEmojiData,
  //   templates,
  //   jsLegacyVendor,
  //   jsLegacy,
  clearCache,
  webpackDist
  // ),
  // compressLegacyJs,
  // sentryRelease
);

/**
 * This dist task is run on Bamboo, our CI server.
 *
 * It skips including the babel-polyfill
 */
// const distCi = gulp.series(
//   crowdinDownload,
//   gulp.parallel(
//     buildEmojiData,
//     templates,
//     jsLegacyVendor,
//     jsLegacy,
//     webpackDistCi
//   ),
//   compressLegacyJs
// );

// const distIntegration = gulp.series(
//   gulp.parallel(buildEmojiData, webpackDistIntegration),
//   zipIntegration
// );

module.exports = {
  dist,
  //distCi,
  //distIntegration,
};
