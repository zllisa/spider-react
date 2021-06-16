const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.config.js');
const path = require('path');
module.exports = merge(baseConfig, {
    /**
     * webpack5     启动命令变成webpack sever --参数 需要指定你运行的webpack文件 待研究？？？
     */
    mode: 'development',
    devServer:{
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        // open: true,
        hot:true
    },
    devtool:'eval-source-map'
})

