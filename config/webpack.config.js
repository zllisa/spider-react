const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');//清除老的dist文件夹
const MiniCssExtractPlugin = require('mini-css-extract-plugin');//提取css
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');//压缩css

//代码复用
const commonCssLoader = [
  MiniCssExtractPlugin.loader,
  'css-loader',
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

const config = {
  entry: ['./src/index.js', './src/index.html'],
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, 'dist')
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
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    corejs: {
                      version: 3
                    },
                    targets: {
                      chrome: '60',
                      firefox: '60',
                      ie: '9',
                      safari: '10',
                      edge: '17'
                    }
                  }
                ]
              ],
              cacheDirectory:true
            }
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
            loader: 'file-loader',
            options: {
              outputPath: 'fonts'
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
  plugins: [
    new CleanWebpackPlugin(),//webpack5 没有参数
    new HtmlWebpackPlugin({
      template: './src/index.html',
      //压缩html
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    new OptimizeCssAssetsPlugin()
  ],
};

module.exports = config;