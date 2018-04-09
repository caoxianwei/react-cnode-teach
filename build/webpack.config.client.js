// 利用path这个包，来完成绝对路径的书写，因为用相对路径的话，可能会出现系统之间的差异等问题
const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
// 判断环境是不是开发环境
const isDev = process.env.NODE_ENV === 'development';
const config = {
	// 应用的入口
	entry: {
		app: path.join(__dirname, '../client/app.js')
	},
	// 打包的输出
	// []是变量的意思，hash的话，就是根据文件内容，去计算得出的hash值
	// 如app.xjjxjsjjd11224sss.js
	// 这样就可以达到最大化地使用浏览器的缓存
	output: {
		// 打包输出文件的文件名
		filename: '[name].[hash].js',
		// 打包输出文件的存放地址
		path: path.join(__dirname, '../dist'),
		// 静态资源文件的引用路径
		// 如果是''，引用路径是:app.hash.js
		// 如果是'/public'，引用路径是/public/app.hash.js
		// 这个东西非常有用，可以帮我们去区分某个url是静态资源，还是api的请求，或者是某些需要特殊处理的请求
		publicPath: '/public'
	},
	module: {
		rules: [
			{
				test: /.jsx$/,
				loader: 'babel-loader'
			},
			{
				test: /.js$/,
				loader: 'babel-loader',
				exclude: [
					path.join(__dirname, '../node_modules')
				]
			}
		]
	},
	plugins: [
		new HTMLPlugin({
			template: path.join(__dirname, '../client/template.html')
		})
	]
}

if (isDev) {
	config.devServer = {
		host: '0.0.0.0',
		port: '8888',
		contentBase: path.join(__dirname, '../dist'),
		// hot: true,
		overlay: {
			errors: true
		},
		publicPath: '/public',
		historyApiFallback: {
			index: '/public/index.html'
		}
	};
}

module.exports = config;