const path = require('path');
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

const { sourceMapFolder } = require('./includes/constants');
const GulpLogger = require('./logger/GulpLogger');

/**
 * Legacy JS compression - only runs for dist
 * NOTE: Webpack takes care of minification for React code
 */
const compressLegacyJs = () => {
  let logger = new GulpLogger('Compress JS');
  return gulp
    .src(['./dist/legacy.js', './dist/vendor.js'], {
      cwd: path.join(__dirname, '../'),
    })
    .pipe(
      sourcemaps.init({
        loadMaps: true,
      })
    )
    .pipe(uglify())
    .on('error', logger.error)
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('./' + sourceMapFolder + '/'))
    .pipe(gulp.dest('./dist'))
    .pipe(logger.success());
};

module.exports = compressLegacyJs;
