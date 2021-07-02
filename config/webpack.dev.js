const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.config.js');
const path = require('path');
console.log('lisasasasa',path.resolve(__dirname, '../public'),)
module.exports = merge(baseConfig, {
    /**
     * webpack5     启动命令变成webpack sever --参数 需要指定你运行的webpack文件 待研究？？？
     */
    mode: 'development',
    devServer:{
        contentBase: path.resolve(__dirname,'../public'), //this is key to use ico. need run serve under public directory
        contentBasePublicPath:'/',
        watchContentBase: true,
        publicPath: '',//建议与output的publicPath相同
        compress: true,
        port: 9000,
        // open: true,
        hot:true,
    },
    devtool:'eval-source-map',
    target:'web'
})

