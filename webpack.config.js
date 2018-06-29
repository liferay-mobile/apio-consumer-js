const webpack = require('webpack');

const moduleConfig = {
	rules: [
		{
			test: /\.js$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['babel-preset-env'],
					plugins: ['transform-runtime'],
				},
			},
		},
	],
};

const browserConfig = {
	target: 'web',
	entry: './src/index.js',
	module: moduleConfig,
	output: {
		filename: './browser.js',
		libraryTarget: 'umd',
	},
	plugins: [new webpack.optimize.ModuleConcatenationPlugin()],
};

const nodeConfig = {
	target: 'node',
	entry: './src/index.js',
	module: moduleConfig,
	output: {
		filename: './node.js',
		libraryTarget: 'commonjs',
	},
};

module.exports = [browserConfig, nodeConfig];
