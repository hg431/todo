const path = require('path');
/* const HtmlWebpackPlugin = require('html-webpack-plugin'); */

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.js',
  },
  plugins: [
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: '[name][ext]',
        },
      },
    ],
  },
};
