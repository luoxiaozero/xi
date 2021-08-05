const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: 'cheap-module-source-map',
  entry: "./example/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new webpack.DefinePlugin({
        "process.env.ART_VERSION": "'dev'"
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "index.html"), //模板路径
    }),
  ],
  devServer: {
    hot: true,
    open: true,
    contentBase: path.resolve(__dirname, "dist"),
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
