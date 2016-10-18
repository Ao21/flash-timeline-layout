'use strict';
let webpack = require('webpack');
let path = require('path');

function root(__path = '.') {
	return path.join(__dirname, __path);
}

const vendors = ['mo-js',
    'mojs-player',
    'mojs-curve-editor',
    'hammerjs']

module.exports = {
	entry: {
		main: [].concat('./src/app', vendors)
	},

	output: {
		path: './dist',
		filename: '[name].bundle.js'
	},

	module: {
		rules: [
			{ test: /\.ts$/, use: 'awesome-typescript-loader' },
			{ test: /\.scss$/, loaders: ['style', 'css', 'sass'], include: [root('./src')] },
		]
	},

	plugins: [
		new webpack.LoaderOptionsPlugin({
			minimize: true,
			debug: false
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: true
			},
			output: {
				comments: false
			},
			sourceMap: false
		})
	],

	resolve: {
		modules: [
			'node_modules',
			path.resolve(__dirname, 'app')
		],
		extensions: ['.ts', '.js']
	},

	devtool: false
};