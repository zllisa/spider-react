# Spider React 
### 一个基于webpack从零构建的react脚手架之自学篇

## 一 基础知识
### 1.什么是webpack？
（1）前端资源的构建工具--ES6,less,scss 等文件变成浏览器可使用的资源

（2）静态资源打包器--通过入口文件将资源打包成响应模块，然后输出。

        什么是webpack的模块？
        -- ES6 import 语句
        --CommonJs 的require() 
        --AMD define 与 require语句
        --Css/scss/less 文件中的import语句
        --样式url(…) 或者 HTML 文件的 img src=中的图片链接
        注：webpack通过loader支持各种语言和预处理器编写模块。loader 描述了 webpack 如何处理 非 JavaScript(non-JavaScript) _模块_，并且在 bundle 中引入这些依赖。Webpack社区已经为各种流行语言和语言处理器构建了loader，包括：CoffeeScript，Typesctipt，ESNext（Babel），Sass，Less，Stylus，也可以自己编写Loader

### 2.webpack的五个核心？
* Input
* Output
* Loader
* Plugins
* Mode（devlopment || production）

### 3.安装并实践
安装**webpack** 必须也同时安装**webpack-cli**，对于将基本配置与开发和生产区分开的也需要安装 **webpack-merge**。

目前所有的构建工具都是基于Node平台运行的，模块化默认采用commomJS，__dirname是nodeJS的变量，代表当前文件的绝对路径。

### Loader 
Loader的使用主要是对rule的 配置，**test**表示匹配哪些文件，**use** 数组是loader执行顺序，从右到左，从上到下 依次执行。

主要处理文件的注意事项如下：
#### JS文件 eslint处理：
 * js 规范 使用爱彼迎的 -- eslint, eslint-plugin-import, eslint-config-airbnb-base
 * 设置使用规则：根据package.json的配置
  
#### JS文件兼容处理
 * 1.@babel/preset-env 只能转换基本语法 例如 let->var ； 箭头函数变成普通函数，但是不能转换Promise等语法，所以要引用转换更高语法的包 @bable/polyfill
 * 2.@babel/polyfill 在文件中直接引用就可以--缺点 只需要解决部分问题 但是把全部都引入了 体积很大
 * 3.core.js   按需引用 ---option2 和 3 只能选择一个
  
注意 正常情况一个文件只被一个loader处理，如果一个文件被多个loader处理(如js需要被eslint和babel处理)需要指定 loader的执行顺序，先执行eslint 然后在执行babel , enforce：‘pre’ 属性告诉loader先执行 不论顺序在上还是在下.

#### CSS文件--默认是将css文件作为[__webpack_modules__]对象的一个属性，属性名是文件名字-属性值是箭头函数，内容是eval(打包的字符串)，
  * 正常情况下是将css引入js文件（css-loader），再由js注入到html的header中的style标签（style-loader）
  * 将css提取成单独的css文件 使用单独的插件--MiniCssExtractPlugin (官方文档使用ExtractTextPlugin，但是有问题) 使用：需要在use中用插件替换style-loader，产生单独的css文件代替style-loader生成在js中的css文件
  * css文件的兼容问题-- postcss -->postcss-loader  post-preset-env，post-preset-env是帮助postcss找到package.json中browserslist里面的兼容配置。通过配置加载css的兼容样式

#### 图片处理
单个规则使用loader即可，多个使用use
* file-loader 就可以处理Img标签的图片 css中的图片。如果要优化图片可以再加入url-loader--可以限制低于设置的值的图片压缩成base64图片，超过限制的仍旧使用file-loader进行处理，所以使用url-loader仍要下载file-loader
  * 优点： 压缩base64 会减少请求数量（减轻服务器压力），缺点：图片提及会更大（文件请求会更慢）
  
注意：处理Html文件中的img需要引入html-loader 去解析，否则会出现输出的html中的图片的src是[Object，Module], 原因 url-loder默认使用es6模块化解析，而html-loader时使用commonjs解析.
    
解决：这时就要关闭 url-loader和html-loader中的 esModule：false
    
最开始我没有使用html-loader仍可处理html 的图片，为什么别人遇到这个问题难道是使用html的插件去热加载html原因？？？
    
**--** 确实是因为使用了html的插件，但是我不会出现[Object,Module]的情况，仍旧是引入的是图片的路径，只是这个路径下的图片有问题。不知道是否是webpack5 的原因。我没有去验证


### Plugins
**html-webpack-plugin**
* 功能：默认会创建一个空的HTML，自动引入打包输出的所有资源（JS/CSS）
* 注意：需要有结果的Html文件, new HtmlWebpackPlugin() 会复制html 并自动引入

**webpack-dev-server**
 * 功能：用来自动化--自动编译 自动打开浏览器 自动刷新浏览器等
 * 注意：仅限于开发环境，只会在内存中编译打包,不会有任何的输出

 **HMR**: hot module replacement 热模块替换，只在开发环境使用，配合webpack-dev-server使用
 * 样式文件：可以使用HMR功能，因为style-loader内部实现了
 * js文件：默认没有HMR功能，需要更改js文件，以用来支持HMR功能

    注意：只能做非入口文件的其他js文件
 * html：默认不能使用HMR文件 并且html文件不能热更新了，解决：修改entry入口，将html文件引入,(不需要做HMR功能只有一个文件)
  
**source-map**: 一种提供源代码到构建后代码的映射
 * 功能：如果构建后代码出错了，通过映射就可以追踪源代码出错的位置.
 * 模式：[inline-|hindden-|eval-|][nosources-][cheap-[module-]]source-map

**DefinePlugin**



### 性能优化
开发环境
-优化打包速度
-优化代码调试

生产环境
-优化打包速度
-优化代码运行速

方案：
* HMR ---只为开发环境
* oneOf ---不能处理一个文件被两个loader使用的情况 ，
* Source-map , 
* 缓存
  * babel 缓存 对没有变的js文件进行缓存--使第二次代码构建更快
  * 文件资源进行缓存--使上线代码性能优化 
    * 1，根据名字+hash值做版本更新，在服务器端配合，在服务器端设置静态资源缓存的时间。
    
        问题：js与css同时使用一个hash值，重新打包会全部失效，重新加载
    * 2，文件名字+ chunkhash 做版本更新，问题改动js css也重新加载
    * 3，文件名字+contenthash 做版本更新
  
    使用方法3.

* tree-shaking 
  * 1.只在生产环境 
  * 2.使用es6 module  减少打包体积
  * 在package.json 配置 使用“sideEffects”：false 所有代码都没有副作用，（都可以tree shaking）
  
  问题：css文件可能会干掉
  
  解决：“sideEffects”：[“*css”,"*scss"]  对于css scss 和@babel/ployfill文件

* code split 代码分割--主要针对js代码，两个js文件输出两个js文件而不是一个
  * 使用多入口 适用与多页面文件
  * optimization 将nodemodule 的代码单独打包成一个chunk输出，同时解决多入口文件公共依赖文件的重复打包
    `
    optimization:{
        splitChunks:{
            chunks:'all'
        }
    }
 ` 
  * 通过js代码让自己写的js代码单独打包, import 动态导入文件单独打包`import(/webpackChunkName:'test'/'wenjian').then().catch()`

  **总结 使用 单入口 + （2） + （3） 去实现代码分割**

* js文件懒加载和预加载
    * 懒加载：使用import动态加载文件的回调中处理事件---前提条件要代码分割  再次点击不会重复加载 读缓存
    * 预加载 prefetch，import语句的参数  浏览器空闲时加载， 避免懒加载时文件过多或者过大加载过慢 加载差

* 多进程打包---只有工作时间较长，才需要多进程打包 
    * 放在某个loader对这个loader进行多进程打包

* externals  忽略某个包打包使用cdn进行加载 ， 忽略的文件需要手动引用
  
* .使用dll对某些库单独打包 （react jauery vue 等）


**压缩js 与 html**
 * js：生产环境自动压缩js代码 mode=‘production’
 * html：HtmlWebpackPlugin中使用minify属性
