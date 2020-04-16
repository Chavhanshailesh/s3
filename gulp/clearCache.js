const del = require('del');

/**
 * Clears the development cache.
 *
 * Useful if you're getting errors in webpack due to moving files around.
 */
const clearCache = () => del('dist/.cache/**/*');

module.exports = clearCache;
