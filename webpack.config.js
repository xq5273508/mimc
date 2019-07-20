'use strict';
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  "mode": process.env.NODE_ENV,
  // context: path.join(__dirname, "src"),
  entry: {
    "mimc": "./src/index.js"
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: '[name].js',
    libraryTarget: 'umd',
    publicPath: ""
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.join(__dirname, "src"), path.join(__dirname, "node_modules/mimc-webjs-sdk")]
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: "body",
      filename: "index.html",
      template: "./src/index.html",
    }),
  ]
};

if (process.env.NODE_ENV === 'development') {
  Object.assign(module.exports, {
    devtool: "source-map",
    devServer: {
      contentBase: path.join(__dirname, "dist"),
      historyApiFallback: true,
      noInfo: true,
      overlay: true,
      hot: true,
      host: '0.0.0.0'
    }
  });
}