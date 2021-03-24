const path = require('path')
const HtmlWebackPlugin = require('html-webpack-plugin')
// const {CleanWebpackPlugin} = require ('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { resolve } = require('path')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: [
        './js/index.js',
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        port: 4200,
        contentBase: path.join(__dirname, 'src'),
    },

    plugins: [
            new HtmlWebackPlugin({
                template: './index.html'
            }),
            // new CleanWebpackPlugin(),
            new CopyWebpackPlugin({
            patterns: [
                { from: "assets", to: "assets" },
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [],
            }, 
            {
                test: /\.sass$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'file-loader',
                        options: { outputPath: '', name: 'main.css'}
                    },
                    'sass-loader'
                ]
            }
        ]
    }
}