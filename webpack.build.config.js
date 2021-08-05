const path = require("path");
const pkg = require('./package.json');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "./package/bundles"),
    filename: 'arttext.min.js',
    libraryTarget: 'umd',
    library: 'arttext',
    umdNamedDefine: true
  },
  plugins: [
    new webpack.DefinePlugin({
        "process.env.ART_VERSION": "'" + JSON.stringify(pkg.version) + "'"
    }),
  ],
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 10000,
            name: "imgs/[name]--[folder].[ext]",
          },
        },
      },
    ],
  },
};
