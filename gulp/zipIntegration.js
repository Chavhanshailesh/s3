const shell = require('gulp-shell');

/**
 * For info what should be returned from a Gulp task.
 * https://stackoverflow.com/a/36899424/2737783
 * */
const zipIntegration = () => {
  return shell.task(
    [
      'rm -rf app-integration',
      'mkdir app-integration',
      'cp -r chunks sourcemaps-not-for-upload app.js app-integration',
      "find app-integration/sourcemaps-not-for-upload -type f -not -name '*chunk.js.map' -not -name 'app.js.map' -print0 | xargs -0  -I {} rm -v {}", // Remove all the source map files except app.js.map. Done to keep the zip < 5MB
      'ditto -c -k --sequesterRsrc app-integration app-integration.zip', // Zipping the assets
      'ditto -c -k --sequesterRsrc chunks chunks.zip',
      'rm -rf app-integration', // Removing temp folder
    ],
    { shell: 'bash', cwd: 'dist' }
  )();
};

module.exports = zipIntegration;
