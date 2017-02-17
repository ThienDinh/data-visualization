module.exports = {
	entry: './app-client.js',
	output: {
		filename: './public/bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.js?/,
				exclude: /(node_modules|visualization_bachelor.js)/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015', 'react']
				}
			}
		]
	}
}