const path = require('path');
const notifier = require('node-notifier');
const through = require('through2');
const prettyTime = require('pretty-hrtime');
const gutil = require('gulp-util');

const isCiBuild = () => process.argv[process.argv.length - 1] === 'dist-ci';

// Logging
// --------------------
const GulpLogger = function(title) {
  let hadErrors = false;
  this.error = function(error, shouldEmit = true) {
    if (isCiBuild()) {
      gutil.log(`[ERROR] gulp build task failed: ${error.message}`);
      return process.exit(2);
    }

    let message = '';
    let colorize = false;

    if (error.plugin) {
      message = `${error.message.trim()}${
        error.fileName ? ' in ' + error.fileName : ''
      }`;
      message = message.replace('Module build failed: ', '');
      message = message.replace(/BabelLoaderError(.|\n)*/gm, '').trim();
      colorize = true;
    } else {
      message = error.stack;
    }

    message = message.replace(__dirname, '');

    notifier.notify({
      title: title,
      message: message,
      icon: path.join(__dirname, '../../img/crossbones.png'),
      sound: 'Frog',
      timeout: 1,
    });

    if (colorize) {
      message = gutil.colors.red(message);
    }

    gutil.log(message);

    // When running a watching task don't die if we hit an error.
    if (GulpLogger.gracefulErrors) {
      if (shouldEmit) {
        this.emit('end');
      }
      // This prevents the success notification from firing which happens
      // if the error is suppressed.
      hadErrors = true;
    }
  };

  this.reinit = function() {
    hadErrors = false;
  };

  this.success = function() {
    return through.obj((chunk, enc, callback) => {
      if (!hadErrors) {
        this.fireSuccess();
      }
      callback();
    });
  };

  this.fireSuccess = function() {
    notifier.notify({
      title: title,
      message: '🏔 Built successfully 🏔',
      icon: path.join(__dirname, '../../img/gulplogo.png'),
      timeout: 1,
    });
  };
};

GulpLogger.gracefulErrors = false;

module.exports = GulpLogger;
