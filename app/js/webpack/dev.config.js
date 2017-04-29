var webpack = require('webpack');
var outputPath = __dirname + '/../';

module.exports = {
	entry:  './app/js/main.js',
	output: {
		path: outputPath,
		filename: 'bundle.js'
	},
	
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				options: {
					presets: ['react', "es2015"]
				},
				exclude: [/node_modules/]
			}
		],
	},
	plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.ProvidePlugin({
            $ : "jquery",
			_ : "lodash",
			React: "react"
        })
	],

	devtool: 'source-map',
};