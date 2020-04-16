const path = require('path');
const gulp = require('gulp');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');

const GulpLogger = require('./logger/GulpLogger');
const jsVendor = require('./includes/jsVendor');

/**
 * Compiles legacy 3rd party JS code into vendor.js
 */
const jsLegacyVendor = () => {
  let logger = new GulpLogger('Legacy Vendor JS');
  return gulp
    .src(jsVendor, { cwd: path.join(__dirname, '../') })
    .pipe(sourcemaps.init())
    .on('error', logger.error)
    .pipe(concat('vendor.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'))
    .pipe(logger.success());
};

module.exports = jsLegacyVendor;
