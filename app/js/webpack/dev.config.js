var webpack = require('webpack');
var path = require('path');
module.exports = {
	entry:  './app/js/main.js',
	output: {
		path: __dirname + '/../',
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				options: {
					presets: ['react', "es2015"]
				}
			}
		]
	},
	resolve: {
	},
	devtool: 'eval',
}