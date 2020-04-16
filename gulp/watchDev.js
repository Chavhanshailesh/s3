const path = require('path');
const gulp = require('gulp');

const GulpLogger = require('./logger/GulpLogger');
const jsLegacyVendor = require('./jsLegacyVendor');
const jsLegacy = require('./jsLegacy');
const jsVendor = require('./includes/jsVendor');
const jsFirstParty = require('./includes/jsFirstParty');

const watchDev = (callback) => {
  GulpLogger.gracefulErrors = true;

  // Build Javascript on file change
  gulp.watch(
    jsVendor,
    { cwd: path.join(__dirname, '../') },
    gulp.series(jsLegacyVendor)
  );
  gulp.watch(
    [...jsFirstParty, 'handlebars/**/*.hbs'],
    { cwd: path.join(__dirname, '../') },
    gulp.series(jsLegacy)
  );

  callback();
};

module.exports = watchDev;
