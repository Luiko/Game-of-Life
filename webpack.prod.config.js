const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const devConfig = require('./webpack.config');

module.exports = env => Object.assign({}, devConfig, {
  module: {
    rules : [ ...devConfig.module.rules.slice(0,2),
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            minimize: true
          }
        }]
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      }
    ]
  },
  devtool: undefined,
  plugins: [ ...devConfig.plugins,
    new ExtractTextPlugin({
      filename: "[name].[contenthash].css",
      disable: process.env.NODE_ENV === "development"
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: env.production
    })
  ]
});