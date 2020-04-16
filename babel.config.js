const jsConfig = require('./jsconfig.json');

/*
  This file is used for configuring babel, such as giving alias to module names.
  jsConfig.json file is atom specific. This file is using jsConfig just to import the project root and alias.
  So that we maintain the above two values in one single file.
*/

module.exports = {
  presets: ['@babel/preset-env', '@babel/react'],
  //ignore: ['./js/legacy/**/*.js', './js/vendor/froala/image.js'],
  plugins: [
    [
      'module-resolver',
      {
        root: [jsConfig.compilerOptions.baseUrl],
        alias: jsConfig.paths,
      },
    ],
    // '@babel/plugin-proposal-object-rest-spread',
    // '@babel/plugin-proposal-class-properties',
    // '@babel/plugin-transform-regenerator',
    // '@babel/plugin-transform-runtime',
    // 'syntax-dynamic-import',
  ],
};
