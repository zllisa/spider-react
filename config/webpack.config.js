const path = require('path');
const WebpackBarPlugin = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');//清除老的dist文件夹
const MiniCssExtractPlugin = require('mini-css-extract-plugin');//提取css
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');//压缩css
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const getPublicUrlOrPath = require('react-dev-utils/getPublicUrlOrPath');
const webpack = require('webpack');
const fs = require('fs');
const {getClientEnvironment,paths} = require('./envAndPath');

const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));

//代码复用
const commonCssLoader = [
  {
    loader: MiniCssExtractPlugin.loader,
    options: {
      publicPath: '../'
    }
  },
  {
    loader: 'css-loader',
    options: {
      sourceMap: true,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [
          require('postcss-preset-env')()
        ]
      }
    }
  }
]
const handler = (percentage, message, ...args) => {
  // e.g. Output each progress message directly to the console:
  console.info(percentage, message, ...args);
};

const config = {
  entry: ['./src/index.tsx', './public/index.html'],
  output: {
    filename: 'js/bundle.js',
    path: path.resolve('./', 'dist'),
    publicPath:paths.publicUrlOrPath
  },
  module: {
    rules: [
      // {
      //   test:/\.js$/,
      //   exclude:/node_modules/,
      //   enforce:'pre',
      //   loader:'eslint-loader',
      //   options:{
      //     fix:true
      //   }
      // },
      {
        oneOf: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          },
          {
            test: /\.(ts|tsx?)$/,
            use: [
              {
                loader: 'babel-loader',
                options: {
                  cacheDirectory: true
                }
              },
              {
                loader: 'ts-loader',
                // exclude: /node_modules/
              }
            ],
          },
          {
            test: /\.css$/,
            use: [
              // 'style-loader',
              ...commonCssLoader
            ]
          },
          {
            test: /\.scss$/,
            use: [
              ...commonCssLoader,
              'scss-loader'
            ]
          },

          {
            test: /\.(png|svg|jpg|gif)$/,
            loader: 'url-loader',
            options: {
              limit: 8 * 1024,  //已byte为单位  1byte 字节 = 8 bit 比特(最好是8-12K)
              esModule: false,
              outputPath: 'imgs'
            },
          },
          {
            test: /\.html$/,
            loader: 'html-loader',
            options: {
              esModule: false
            }
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            exclude: /(node_modules)/,
            // loader: 'file-loader',
            // options: {
            //   outputPath:  'css/fonts'
            // }
            //webpack5的写法
            type: 'asset/resource',
            generator: {
              filename: "css/fonts/[name].[contenthash:8].[ext]"
            }
          },
          //处理其他资源
          // {
          //   exclude:/\.(html|js|css|scss|jpg|png|gif|woff|woff2|eot|ttf|otf)/,
          //   loader:'file-loader',
          //   options:{
          //     outputPath:'others'
          //   }
          // }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new CleanWebpackPlugin(),//webpack5 没有参数
    new HtmlWebpackPlugin({
      inject: true,
      template: './public/index.html',
      // 压缩html
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    new OptimizeCssAssetsPlugin(),
    new WebpackBarPlugin(),
    new webpack.DefinePlugin(env.stringified),
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
  ],
};

module.exports = config;