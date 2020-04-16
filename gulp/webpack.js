const path = require('path');
const gutil = require('gulp-util');
//const git = require('git-rev-sync');
const webpack = require('webpack');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const globImporter = require('node-sass-glob-importer');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { UnusedFilesWebpackPlugin } = require('unused-files-webpack-plugin');
const WebpackDevServer = require('webpack-dev-server');
const WebpackNotifierPlugin = require('webpack-notifier');

const GulpLogger = require('./logger/GulpLogger');
const { sandboxParams, sourceMapFolder } = require('./includes/constants');

// Allows us to initialise webpack from a gulp task
function runWebpack(cb, { env = 'dev' } = {}) {
  const inProd = env === 'prod';
  //const inCi = env === 'ci';
  const inDev = env === 'dev';
  //const inIntegration = env === 'integration';
  const DEV_PORT = 8020;
  const DEV_HOST = '0.0.0.0';
  const DEV_URL = `http://${DEV_HOST}:${DEV_PORT}/`;
  const webpackOutputBasePath = '../dist/';
  let logger = new GulpLogger('Javascript');
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  let plugins = [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['chunks/*'],
      verbose: false,
    }),
    new webpack.DefinePlugin({
      // to test responsive image loading, set IN_SANDBOX to false here and also in getAppConfig
      // then also add some server urls from backyard into content.js and/or feed.json and make sure you have a logged in session.
      IN_SANDBOX: !inProd,
      //COMMITHASH: JSON.stringify(git.long()),
    }),
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: env === 'dev' ? '[name].css' : '[name].min.css',
      sourceMap: true,
      sourceMapFilename: sourceMapFolder + '/[file].map',
    }),
  ];

  if (inDev) {
    plugins = [
      // Try to speed up incremental rebuilds in development
      new HardSourceWebpackPlugin({
        info: {
          level: 'none',
        },
      }),
      new WebpackNotifierPlugin({
        contentImage: path.join(
          __dirname,
          '../img/webpacks-icon-square-small.png'
        ),
        alwaysNotify: true, // comment this line to avoid notification on rebuilds
      }),
      ...plugins,
    ];
  }

  if (inProd) {
    plugins = [
      ...plugins,
      new webpack.optimize.ModuleConcatenationPlugin(),
      // new webpack.BannerPlugin({
      //   entryOnly: true,
      //   banner: `[name].js | ${year}.${month}.${day} ${hour}:${minute} | (c) Simpplr Inc.`,
      // }),
    ];
  }

  // Uncomment the line below to enable the bundle analyzer
  //  plugins.push(new BundleAnalyzerPlugin());

  //Uncomment the line below to enable the unused file analyzer
  // plugins.push(new UnusedFilesWebpackPlugin({
  // 	patterns: ['js/**/*.*']
	// globOptions: {
	// 	ignore: ['js/legacy/**/*'],
	// },
  //}));


  let entry = {
    // Only one babel-polyfill needed per page, at first file. In development
    // and on CI it gets included separately in the babelPolyfill entry point.
    // In production, it's added to the start of the react package.
    // element-remove polyfills Element.remove().
    app: inProd
      ? [
        'babel-polyfill',
        //'element-remove',
        //'react-hot-loader/patch',
        './js/index.js',
      ]
      :
      //['element-remove', 'react-hot-loader/patch', './js/index.jsx'],
      ['./js/index.js'],
    //endpoints: './api/src/index.js',
    babelPolyfill: 'babel-polyfill',
    //cssVarsPolyfill: './js/util/cssVarsPolyfill.js',
    font: './sass/font.scss',
  };

  // Only include other entrypoints in production to speed up recompiles
  // during development time
  // if (!inDev) {
  //   entry = {
  //     ...entry,
  //     mobileContent: [
  //       './js/util/contentHelpers/index.js',
  //       './sass/mobileContent.scss',
  //     ],
  //     customerAnalyticsLegacyShim: './js/analytics/legacy.js',
  //     customerAnalytics: ['babel-polyfill', './js/analytics/index.jsx'],
  //   };
  // }

  // use 'source-map' in production so we can send them to sentry
  let devtool = inProd ? 'source-map' : 'cheap-module-source-map';

  const webpackConfig = {
    mode: inProd ? 'production' : 'development',
    externals: {
      jquery: 'jQuery',
    },
    entry,
    output: {
      path: path.join(__dirname, webpackOutputBasePath),
      filename: '[name]' + (inProd ? '.min' : '') + '.js',
      chunkFilename:
        'chunks/[name].chunk' +
        (inProd ? '.min' : '') +
        '.js?v=[chunkhash]',
      sourceMapFilename: sourceMapFolder + '/[file].map',
      publicPath: '/',
    },
    devtool,
    plugins,
    resolve: {
      extensions: ['.js', '.jsx'],
      symlinks: false,
      alias: {
        // Make sure @hot-loader/react-dom version should exactly match the actual react-dom version
        //'react-dom': '@hot-loader/react-dom',
      },
    },
    performance: {
      hints: false,
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          // Try and speed up minimizing
          cache: true,
          parallel: true,
          sourceMap: true,
          extractComments: false,
        }),
      ],
      splitChunks: {
        cacheGroups: {
          vendors: {
            // Prevent translation files getting split into multiple chunks
            reuseExistingChunk: true,
          },
          // Don't split customer analytics into multiple chunks. We want it all in one file.
          customerAnalytics: {
            test: /[\\/]customerAnalytics[\\/]/,
            chunks: 'all',
            name: 'customerAnalytics',
          },
        },
      },
    },
    module: {
      rules: [
        // {
        //   // Don't use AMD loader for froala because it breaks ES6 module imports
        //   test: /froala-editor|vendor\/froala\/image/,
        //   parser: { amd: false },
        // },
        // {
        //   // Use script loader for cropper.js because it's so old it doesnt work
        //   // with modern bundlers
        //   test: /node_modules\/cropper\/dist\/cropper\.js$/,
        //   use: ['script-loader'],
        // },
        {
          test: /(\.jsx?)$/,
          // Allow only allow escape-string-regexp to be transpiled since it doesnt
          // have an ES5 package version
          exclude: /node_modules\/(?!escape-string-regexp)/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: './dist/.cache/webpack',
              },
            },
          ],
        },
        {
          test: /\.s(a|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: true,
              },
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                ident: 'postcss',
                plugins: () => [
                  require('autoprefixer'),
                  require('css-mqpacker'),
                ],
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                sassOptions: {
                  importer: globImporter(),
                },
              },
            },
          ],
        },
      ],
    },
  };

  const compiler = webpack(webpackConfig);

  // Custom error handler to make Webpack work nicely inside gulp
  function webpackRunCallback(err, stats) {
    if (!err && !stats.hasErrors() && !stats.hasWarnings()) {
      logger.fireSuccess();
    } else {
      const jsonStats = stats.toJson() || {};
      const errors = jsonStats.errors || [];

      if (!errors[0]) {
        jsonStats.warnings.forEach((warn) => gutil.log(`WARNING: ${warn}`));
      } else {
        logger.error(new gutil.PluginError('webpack-stream', errors[0]), false);
      }
    }

    if (cb) {
      cb();
    }
  }

  if (!inDev) {
    compiler.run(webpackRunCallback);
  } else {
    const devServerConfig = {
      contentBase: path.join(__dirname, '..'),
      // before(app, server, compiler) {
      //   app.set('view engine', 'ejs');
      //   app.set('views', path.join(__dirname, '../ejs'));
      //   app.get('/templates', (req, res) => {
      //     res.redirect('/templates/index.html');
      //   });
      //   app.get('/templates/:file.html', ({ params: { file } }, res) => {
      //     if (file.match(/^(403|404|500)$/)) {
      //       res.status(parseInt(file, 10));
      //     }
      //     res.render(file, sandboxParams);
      //   });
      // },
      watchOptions: {
        ignored: [
          /node_modules(?!\/webpack-dev-server)/,
          '/docs',
          '/storybook',
          '/test',
        ],
      },
      sockPort: DEV_PORT,
      hot: true, // set this to false to disable HMR
      liveReload: false,
      compress: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      stats: {
        colors: true,
        errorDetails: true,
        modules: false,
        chunks: false,
        namedChunkGroups: false,
        assets: false,
      },
      // 	quiet: true, // this disables webpack noisy CLI logging
      progress: true, // show single line build progress in CLI
      clientLogLevel: 'warn', // this shows browser level HMR logging
    };

    // Start a webpack-dev-server
    const devServer = new WebpackDevServer(compiler, devServerConfig);

    devServer.listen(DEV_PORT, DEV_HOST, function (err) {
      if (err) throw new gutil.PluginError('webpack-dev-server', err);
      console.log(`Starting Simpplr dev server on ${DEV_URL}`);
    });
  }
}

/**
 * JS tasks for compiling all our modern Javascript.
 */
const webpackCompiler = (callback) => {
  return runWebpack(callback, {});
};

const webpackDist = (callback) => {
  return runWebpack(callback, { env: 'prod' });
};

// const webpackDistIntegration = (callback) => {
//   return runWebpack(callback, { env: 'integration' });
// };

// const webpackDistCi = (callback) => {
//   return runWebpack(callback, { env: 'ci' });
// };

module.exports = {
  webpackCompiler,
  webpackDist,
  //webpackDistIntegration,
  //webpackDistCi,
};
