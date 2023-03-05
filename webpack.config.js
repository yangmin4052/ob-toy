const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ObWebpackPlugin = require('./webpack-plugins/ob-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: './src/a.js',
  output: {
    path: path.resolve(__dirname, 'dist-webpack'),
    filename: 'a.js'
  },
  devServer: {
    port: 8080
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './public/index.html')
    }),
    new ObWebpackPlugin({
      sourceMap: true
    })
  ]
};
