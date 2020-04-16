/* eslint-disable global-require */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const globImporter = require('node-sass-glob-importer');

// Export a function. Accept the base config as the only param.
module.exports = async ({ config }) => {
	// These config should be similar to webpacks config found in gulpfile.js
	config.plugins.push(
		new MiniCssExtractPlugin({
			filename: '[name].css',
		})
	);

	config.module.rules.push({
		test: /\.s(a|c)ss$/,
		use: [
			{ loader: MiniCssExtractPlugin.loader },
			{ loader: 'css-loader' },
			{
				loader: 'postcss-loader',
				options: {
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
					sassOptions: {
						importer: globImporter(),
					},
				},
			},
		],
	});

	// Return the altered config
	return config;
};
