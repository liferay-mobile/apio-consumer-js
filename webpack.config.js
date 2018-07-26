const moduleConfig = {
	rules: [
		{
			test: /\.js$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: [['env', {modules: false}]],
					plugins: ['transform-runtime'],
				},
			},
		},
	],
};

const browserConfig = {
	entry: './src/index.js',
	module: moduleConfig,
	output: {
		filename: './browser.js',
		libraryTarget: 'umd',
		library: 'ApioConsumer',
		libraryExport: 'default',
	},
};

const nodeConfig = {
	target: 'node',
	entry: './src/index.js',
	module: moduleConfig,
	output: {
		filename: './node.js',
		libraryTarget: 'commonjs2',
		libraryExport: 'default',
	},
};

module.exports = [browserConfig, nodeConfig];
