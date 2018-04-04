/**
 * webpack-dev-server 会为每个入口文件创建一个客户端脚本，
 * 这个脚本会监控该入口文件的依赖模块的更新，
 * 如果该入口文件编写了 HMR 处理函数，它就能接收依赖模块的更新，
 * 反之，更新会向上冒泡，直到客户端脚本仍没有处理函数的话，
 * webpack-dev-server 会重新加载整个页面。
 * 如果入口文件本身发生了更新，因为向上会冒泡到客户端脚本，
 * 并且不存在 HMR 处理函数，所以会导致页面重载。
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack'); // 引入 webpack 便于调用其内置插件

/**
 * webpack -p(相当于
 * webpack --optimize-minimize --define process.env.NODE_ENV="'production'"
 * )设置的process.env.NODE_ENV环境变量，是用于编译后的代码的，
 * 只有在打包后的代码中，这一环境变量才是有效的。
 * 如果在 webpack 配置文件中引用此环境变量，得到的是 undefined，
 * 但是，有时我们确实需要在 webpack 配置文件中使用 process.env.NODE_ENV，
 * 怎么办呢？一个方法是运行NODE_ENV='production' webpack -p命令，
 * 不过这个命令在Windows中是会出问题的。为了解决兼容问题，
 * 我们采用 cross-env 解决跨平台的问题。
 */
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  // devtool: 'inline-source-map', // 控制是否生成以及如何生成 source map

  devServer: { // 检测代码变化并自动重新编译并自动刷新浏览器
    contentBase: path.resolve(__dirname, 'dist'), // 设置静态资源的根目录
    hot: true, // 告诉 dev-server 我们在用 HMR
    hotOnly: true // 指定如果热加载失败了禁止刷新页面 (这是 webpack 的默认行为)，这样便于我们知道失败是因为何种错误
  },
  
  // entry: './src/index.js', // 入口起点，可以指定多个入口起点
  entry: {
    app: './src/index.js',
    // print: './src/print.js'
    // another: './src/another.js'
    vendor: [  // 第三方库可以统一放在这个入口一起合并
      'lodash'
    ]
  },
  output: { // 输出，只可指定一个输出配置
    // [chunkhash] 是内容相关的，只要内容发生了改变，构建后文件名的 hash 就会发生改变。
    filename: '[name].[chunkhash].js', // 输出文件名
    chunkFilename: '[name].bundle.js',  // 指定非入口块文件输出的名字
    // [name]会替换为对应的入口起点名
    /**
     * [chunkhash]不能和 HMR 一起使用，换句话说，不应该在开发环境中使用 [chunkhash] (或者 [hash])，这会导致许多问题。
     */
    // filename: isProd ? '[name].[chunkhash].js' : '[name].bundle.js', // 根据入口起点名动态生成 bundle 名，可以使用像 "js/[name]/bundle.js" 这样的文件夹结构
    path: path.resolve(__dirname, 'dist') // 输出文件所在的目录
  },

  plugins: [ // 插件属性，是插件的实例数组
    new HtmlWebpackPlugin({
      title: 'webpack demo by plugin',  // 生成 HTML 文档的标题
      filename: 'index.html' // 写入 HTML 文件的文件名，默认 `index.html`
    }),
    /**
     * 使用 jQuery 时我们习惯性地使用$或jQuery变量，
     * 每次都使用const $ = require(“jquery”)引入的话太麻烦，
     * 将其设置成全局变量, 这样就可以在每个模块中直接使用这两个变量了。
     * 为了兼容这一做法，我们使用 ProvidePlugin 插件为我们完成这一任务。
     */
    new webpack.ProvidePlugin({  // 设置全局变量
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new webpack.HashedModuleIdsPlugin(), // 替换掉原来的`module.id`
    new CleanWebpackPlugin(['dist']), // 第一个参数是要清理的目录的字符串数组
    /**
     * 提取出第三方库放到单独模块中
     * 指定入口文件名时它会提取入口文件为单个文件(entry里vendor数组)，
     * 不指定则会提取 webpack 的运行时代码。
     */
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor' // 将 vendor 入口处的代码放入 vendor 模块
    }),
    // 包含 vendor 的 CommonsChunkPlugin 实例必须在包含 runtime 的之前，否则会报错。
    // 再次new相当于没有指定(指定的已经提取过了)
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime' // 将 webpack 自身的运行时代码放在 runtime 模块
    })
    // new webpack.HotModuleReplacementPlugin(), // 启用 HMR
    // new webpack.NamedModulesPlugin() // 打印日志信息时 webpack 默认使用模块的数字 ID 指代模块，不便于 debug，这个插件可以将其替换为模块的真实路径
  ],
  
  module: { // 如何处理项目中不同类型的模块
    rules: [ // 用于规定在不同模块被创建时如何处理模块的规则数组
      {
        test: /\.css$/, // 匹配特定文件的正则表达式或正则表达式数组
        use: [ // 应用于模块的 loader 使用列表
          'style-loader',
          'css-loader'
        ]
      },
      { // 增加加载图片的规则
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      { // 增加加载字体的规则
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  }
};