const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const EncodingPlugin = require('webpack-encoding-plugin');
const pkg = require('../package.json')
const commonConfig = require('./webpack.common')

const bannerPack = new webpack.BannerPlugin({
  banner: [
    `ArtText v${pkg.version}`,
  ].join('\n'),
  entryOnly: true
})


const proMode = process.env.NODE_ENV === 'production'

module.exports = {
  ...commonConfig.default,

  mode: proMode ? 'production': 'development',

  entry: './lib/index.ts',

  output: {
    filename: 'arttext.js',
    path: path.resolve(__dirname, '../docs/dist')
  },

  plugins: [
    bannerPack,
    new MiniCssExtractPlugin({
      filename: 'arttext.css'
    }),
    new EncodingPlugin({
      encoding: 'UTF-8'
    })
  ]
}