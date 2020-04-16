const fs = require('fs');
const gulp = require('gulp');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');

const GulpLogger = require('./logger/GulpLogger');
const { sandboxParams } = require('./includes/constants');

/**
 * Template compilation
 */
const templates = () => {
  if (!fs.existsSync('./templates')) {
    fs.mkdirSync('./templates');
  }

  let logger = new GulpLogger('Templates');
  return gulp
    .src('./ejs/*.ejs')
    .pipe(ejs(sandboxParams))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest('./templates'))
    .pipe(logger.success());
};

module.exports = templates;
