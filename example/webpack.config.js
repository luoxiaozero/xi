const path = require('path');
const commonConfig = require('../scripts/webpack.common');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    ...commonConfig.default,
    mode: 'development',
    entry: './example/index.ts',
    output: {
        filename: 'arttext.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'index.html'),//模板路径
            filename: 'index.html'//自动生成的HTML文件的名称
        }),
    ],
    devServer: {
        hot:true,
        open:true,
        contentBase: path.resolve(__dirname, 'dist'),
    },
    devtool: 'inline-source-map',
};