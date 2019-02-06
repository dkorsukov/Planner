const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJSWebpackPlugin = require("uglifyjs-webpack-plugin");
const WebpackMd5Hash = require('webpack-md5-hash');

module.exports = {
	mode: "production",

	entry: "./src/js/main.js",

	output: {
		path: path.resolve(__dirname, "build/"),
		filename: "js/scripts.min.js"
	},

	devServer: {
		overlay: true
	},

	plugins: [
		new MiniCssExtractPlugin({
			filename: "css/styles.min.css"
		}),
		new HtmlWebpackPlugin({
			template: "./src/index.html",
			filename: "index.html",
			minify: true,
			favicon: "./build/favicon.png"
		}),
		new WebpackMd5Hash()
	],

	optimization: {
		minimizer: [
      new UglifyJSWebpackPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: true,
          ecma: 6,
          mangle: true
        },
        sourceMap: true
      })
		]
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				use: ["babel-loader"]
			},
			{
				test: /\.scss$/,
				use: ["style-loader",
							MiniCssExtractPlugin.loader, 
							"css-loader", 
							"postcss-loader",
							"sass-loader"]
			},
			{
				test: /\.(png|jpg)$/,
				use: [{
					loader: "file-loader",
					options: {
						name: "img/[name].[ext]"
					}
				}, {
					loader: "image-webpack-loader",
					options: {
						optipng: {
							enabled: true
						},
						pngquant: {
							quality: "60-95",
							speed: 4
						}
					}
				}]
			},
			{
				test: /\.(ttf|woff|woff2)/,
				use: [{
					loader: "file-loader",
					options: {
						name: "fonts/[name].[ext]"
					}
				}]
			}
		]
	}
}