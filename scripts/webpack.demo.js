const path = require('path');
const webpack = require('webpack');
const pkg = require('../package.json');
const commonConfig = require('./webpack.common');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const EncodingPlugin = require('webpack-encoding-plugin');


module.exports = {
  ...commonConfig.default,
  mode: 'production',
  entry: path.resolve(__dirname, '../src/index.ts'),
  output: {
    filename: 'arttext.min.js',
    path: path.resolve(__dirname, '../docs/dist'),
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'arttext.min.css'
    }),
    new webpack.BannerPlugin({
      banner: [
        `ArtText v${pkg.version}`,
      ].join('\n'),
      entryOnly: true
    }),
    new EncodingPlugin({
      encoding: 'UTF-8'
    }),
  ],
};