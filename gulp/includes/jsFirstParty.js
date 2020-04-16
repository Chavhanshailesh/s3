const jsFirstParty = [
  // Simpplr jQuery plugins
  'js/legacy/plugins/**/*.js',

  // Simpplr JS library
  'js/legacy/lib/LazyLoader.js', // fix an ordering issue... really must use an AMD or browserify here...
  'js/legacy/lib/Listing.js', // fix an ordering issue... really must use an AMD or browserify here...
  'js/legacy/lib/Modal/Default.js', // fix an ordering issue... really must use an AMD or browserify here...
  'js/legacy/lib/Modal/*.js', // fix an ordering issue... really must use an AMD or browserify here...
  'js/legacy/lib/**/*.js',

  // Include setup script
  'js/legacy/setup.js',

  // Simpplr JS files, init & setup etc
  'js/legacy/anchor_links.js',
  'js/legacy/forms.js',
  'js/legacy/mobile.js',
  'js/legacy/main.js',

  // Don't include things we already included in vendor JS
  '!js/legacy/lib/Settings.js',
  '!js/legacy/lib/Utility.js',
  '!js/legacy/lib/Loader.js',
  '!js/legacy/lib/App.js',
];

module.exports = jsFirstParty;
