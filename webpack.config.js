var path    = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
/*
['webpack-dev-server/client?http://127.0.0.1:8080',
'webpack/hot/only-dev-server']
*/
module.exports = {

  entry: {
  //  'webpack-dev-server/client?http://127.0.0.1:8080',
  //  'webpack/hot/only-dev-server',
    game_level: './src/game_level.js',
    game_main: './src/game_main.js'
  },
  output: {
    path: __dirname + '/public',
    filename: '[name].js'
  },
  resolve: {
    modulesDirectories: ['node_modules'],
    extensions:         ['', '.js']
  },
  module: {
    loaders: [
      {
        test:    /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      },
      {
        test: /\.scss?$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('style_game.css'),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
  ],
  //devtool: 'source-map',
  devtool: 'eval',
  devServer: {
    contentBase: './public',
    hot: true,
    headers: {"Access-Control-Allow-Origin": "*"},
  }
};
