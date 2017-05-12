const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  target: 'web',
  entry: {
    static: './src/static-example.js',
    compiled: './src/compiled-example.js'
  },
  output: {
    filename: '[id].[name].js',
    path: path.join(__dirname, 'dist'),
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['es2015', 'stage-2', 'react'],
          babelrc: false
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.ejs',
      inject: false
    }),
    new HtmlWebpackPlugin({
      filename: 'static.html',
      template: './src/static-example.ejs',
      inject: false
    }),
    new HtmlWebpackPlugin({
      filename: 'compiled.html',
      template: './src/compiled-example.ejs',
      inject: false
    })
  ],
  devtool: 'cheap-module-source-map'
};
