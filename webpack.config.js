const path = require('path');
/* const HtmlWebpackPlugin = require('html-webpack-plugin'); */

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
    display: './src/display.js',
  },
  devtool: 'inline-source-map',
  plugins: [
    /*     new HtmlWebpackPlugin({
      inject: false,
      title: 'To do lists',
    }), */
  ],
  output: {
    filename: '[name].bundle.js',
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
