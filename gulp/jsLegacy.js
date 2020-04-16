const path = require('path');
const gulp = require('gulp');
const concat = require('gulp-concat');
const replace = require('gulp-replace');
const wrap = require('gulp-wrap');
const handlebars = require('gulp-handlebars');
const declare = require('gulp-declare');
const merge = require('merge-stream');
const sourcemaps = require('gulp-sourcemaps');

const GulpLogger = require('./logger/GulpLogger');
const jsFirstParty = require('./includes/jsFirstParty');

/**
 * Compiles our first party legacy JS code into legacy.js
 *
 * All the legacy code is wrapped with an event listener listening for the
 * legacyReady event which fires when our modern JS finishes initialising
 * so that it doesnt try to access some variables before they are
 * declared.
 */
const jsLegacy = () => {
  let logger = new GulpLogger('Legacy JS');
  const firstParty = gulp
    .src(jsFirstParty, { cwd: path.join(__dirname, '../') })
    .pipe(sourcemaps.init())
    .on('error', logger.error)
    .pipe(concat('legacy.js'))
    .pipe(
      wrap("Simpplr.App.on('legacyReady', function() { <%= contents %> })")
    );

  let templatesPartials = gulp
    .src('handlebars/partials/*.hbs')
    .pipe(sourcemaps.init())
    // The following replacements help reduce the template file size
    .pipe(replace(/(\n{2,})/g, '\n')) // Replace multiple line breaks with just one
    .pipe(replace(/(\t+)/g, ' ')) // Replace multiple tabs with just one space
    .pipe(replace(/([ ]{2,})/g, ' ')) // Replace multiple spaces with just one
    // Remove sequences of tabs, new lines or spaces between > or }} and < or {{
    .pipe(
      replace(/(>|\}\})([\n\t\r ]+)(<|\{\{)/g, function(...matches) {
        // Keep one space only, to avoid CSS issues (like we have with React)
        return matches[1] + ' ' + matches[3];
      })
    )
    .pipe(handlebars())
    .on('error', logger.error)
    .pipe(
      wrap(
        'Handlebars.registerPartial(<%= processPartialName(file.relative) %>, Handlebars.template(<%= contents %>));',
        {},
        {
          imports: {
            processPartialName: function(fileName) {
              // Strip the extension and the underscore
              // Escape the output with JSON.stringify
              return JSON.stringify(path.basename(fileName, '.js'));
            },
          },
        }
      )
    )
    .pipe(gulp.dest('./dist/.cache/handlebars/partials'));

  let templatesFull = gulp
    .src('handlebars/*.hbs')
    // The following replacements help reduce the template file size
    .pipe(replace(/(\n{2,})/g, '\n')) // Replace multiple line breaks with just one
    .pipe(replace(/(\t+)/g, ' ')) // Replace multiple tabs with just one space
    .pipe(replace(/([ ]{2,})/g, ' ')) // Replace multiple spaces with just one
    // Remove sequences of tabs, new lines or spaces between > or }} and < or {{
    .pipe(
      replace(/(>|\}\})([\n\t\r ]+)(<|\{\{)/g, function(...matches) {
        // Keep one space only, to avoid CSS issues (like we have with React)
        return matches[1] + ' ' + matches[3];
      })
    )
    .pipe(handlebars())
    .on('error', logger.error)
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .on('error', logger.error)
    .pipe(
      declare({
        namespace: 'Simpplr.templates',
        noRedeclare: true,
      })
    )
    .on('error', logger.error)
    .pipe(gulp.dest('./dist/.cache/handlebars'));

  return merge(templatesPartials, templatesFull, firstParty)
    .pipe(concat('legacy.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(logger.success());
};

module.exports = jsLegacy;
