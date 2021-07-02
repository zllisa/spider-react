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

    注意：提取单独的css文件要指定publicPath，否则会找不到图片和字体资源。
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
 * 模式：false | eval | [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map

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


### ✨Webpack5需要注意的一些写法

- 使用WebpackDevServer，启动命令从webpack-dev-server 变成 webpack-serve
- file-loader， raw-loader，url-loader不是必须的，可以使用内置的AssetModule
  - asset/resource 生成一个单独的文件并导出URL。以前可以通过使用file-loader实现
  - asset/inline 导出assets的data URI。以前可以通过使用url-loader实现
  - asset/source 导出资产的源代码。以前可以通过使用raw-loader实现
  - 如果使用webpack5，但是又不想修改之前的loader配置,可这么修改 type: 'javascript/auto',这会停止asset module 再次处理那些assets
- 节点polyfill不再可用，
- webpack-merge的引入变成  `const {merge} = require('webpack-merge');`
- csv-loader来加载csv文件数据， xml-loader来加载xml文件数据 。可以使用 parser 而不是loader来处理toml, yamljs and json5格式的资源
- webpack5 在package.js 里的browserslist 导致webpack-dev-server热更新失效。解决：需要在里添加 `target:'web'` 不能添加 `target: process.env.NODE_ENV === 'development'?'web':browserslist` 三目表达式依旧不起作用。


- 更多参考： https://webpack.docschina.org/blog/2020-10-10-webpack-5-release/


###  React Config with TS

- 1.ts文件需要引入react与react-dom的描述文件，但是仍不识别组件的写法 所以需要tsx文件作为入口文件 ` @types/react  @types/react-dom`



### 关于Babel --提供ES5的全部环境，避免ES6的语法在浏览器不兼容（尤其是IE）。
核心原理是AST（抽象语法树）：首先将源码转换成AST，然后对AST进行处理生成新的AST，最后将新的AST生成JS代码，整个编译过程可以氛围3个阶段`parseing-->transforming-->generating` 都是围绕AST去做的。

当你在webpack的js中使用babel-loader处理js的语法兼容时，你需要在` options:{ presets:[],plugins:[]}`做一些babel的配置，使其转换一些js的新语法。

基础安装包： ` @babel-/core  @babel/polyfill  @babel/preset-env` 如果你需要使用babel的命令需要安装` @babel/cli` 。` babel-loader` 在webpack中处理js需要的loader。
对于ts 和react 需要额外添加的包： ` @babel/preset-react  @babel/preset-typescript`

#### babel的作用：
- 1.babelcore进行语法转换，基本语法 
- 2.通过ployfill方式预先在目标环境添加新的特性
- 3.源码转换？？

#### babel的基本概念

- 插件：babel本身就是构建在插件之上的，babel的插件主要氛围两种：语法插件 和 转换插件。插件的执行顺序是在presets之前的，里面插件的顺序是从数组左侧向右执行的。
  - 语法插件：只允许babel解析Parse一些特定的语法而非转换，可以在AST转换是使用，以支持解析新语法。

 ```js
 import * as babel from "@babel/core";
const code = babel.transformFromAstSync(ast, {
    //支持可选链
    plugins: ["@babel/plugin-proposal-optional-chaining"],
    babelrc: false
}).code;
 ```

 - 转换插件：转换插件会启用响应的语法插件去解析。
  可以直接在plugins中加入你需要使用的插件，例如： ` { "plugins": ["@babel/plugin-transform-arrow-functions"] }`，这个插件也是卸载

- 预设Preset：就是一堆插件的集合，从而达到某些转译能力，预设的执行顺序是从又往左，与插件相反。
   
  例如：`@babel/preset-react ` 就是 `@babel/plugin-syntax-jsx  @babel/plugin-transform-react-jsx  @babel/plugin-transform-react-display-name`几种插件的集合。

  当然我们也可以手动的在 plugins 中配置一系列的 plugin 来达到目的，就像这样：`"plugins":["@babel/plugin-syntax-jsx","@babel/plugin-transform-react-jsx","@babel/plugin-transform-react-display-name"] `. 但是这写是常用的插件，这样写很麻烦所以才会有presets，使用预设就会轻松的多。

- Polyfill 垫片：就是垫平不同浏览器环境的差异。`@babel/polyfill`模块可以模拟完整的ES5环境。注意：`@babel/polyfill`不是在babel的配置文件中配置的，而是在我们的代码中引入`import '@babel/polyfill';`。但是引入之后是将整个polyfill引入，打包的体积瞬间变大（80多k）。所以我们需要按需加载的功能。Babel也想到了，所以：
  - useBuiltIns: `@babel/preset-env`中提供的useBuiltIns属性就会自动进行按需加载polyfill，不需要手动引入。 `@babel/preset-env`的出现有点像民族统一，先是把 stage-x 干掉了，又怎么会漏掉 Polyfill 这一功能。
  配置如下：
  ```js
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
        },
      ]
  ```
  ⚠️注意：这里需要使用另外一个包core-js@3，且版本是3. 这里是因为`@babel/polyfill`模块包括`core-js`和`regenerator runtime`，`core-js`是其他的公司所开发。


#### 说说Babel的其他插件：

- `@babel/plugin-transform-runtime` 可以让Babel在编译中代码复用的插件，从而减少打包体积。 很多个文件同时引入某一个babel，如果没有这个插件，就会引用很多遍。引用这个插件只会引用一次。
  ⚠️注意：他有一个CP `@babel/runtime` 安装了上面的下面的就也装上吧。

