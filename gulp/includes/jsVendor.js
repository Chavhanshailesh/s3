const jsVendor = [
  // Third-party vendor libraries
  'node_modules/jquery/dist/jquery.js',
  'node_modules/jquery-ui-stable-build/ui/core.js',
  'node_modules/jquery-ui-stable-build/ui/position.js',
  'node_modules/jquery-ui-stable-build/ui/widget.js',
  'node_modules/jquery-ui-stable-build/ui/mouse.js',
  'node_modules/jquery-ui-stable-build/ui/tabs.js',
  'node_modules/jquery-ui-stable-build/ui/sortable.js',
  'node_modules/jquery-ui-touch-punch/jquery.ui.touch-punch.js',
  'node_modules/handlebars/dist/handlebars.runtime.js',
  'node_modules/wolfy87-eventemitter/EventEmitter.js',
  'node_modules/selectize/dist/js/standalone/selectize.js',
  'js/legacy/selectize_plugins/*.js',
  'node_modules/FlexiColorPicker/colorpicker.js',
  'node_modules/chart.js/dist/Chart.js',
  'node_modules/form-serializer/dist/jquery.serialize-object.min.js',
  'node_modules/autosize/dist/autosize.js',
  'node_modules/nprogress/nprogress.js',
  'node_modules/popper.js/dist/umd/popper.js',

  // Simpplr namespace
  'js/legacy/namespace.js',

  // Include Settings, Utility + Loader before anything else
  // NOTE: these is here because they're needed in the React code
  'js/legacy/lib/Utility.js',
  'js/legacy/lib/Loader.js',
  'js/legacy/lib/App.js',
];

module.exports = jsVendor;
