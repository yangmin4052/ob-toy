const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: './src/a.js',
  output: {
    path: path.resolve(__dirname, 'dist-webpack-loader'),
    filename: 'a.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'post',
        use: [
          {
            loader: './webpack-loaders/ob-webpack-loader',
            options: {}
          }
        ]
      }
    ]
  }
};
