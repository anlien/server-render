# server-render
react 在服务端渲染

# 遇到的问题
* [Async functions producing an error "ReferenceError: regeneratorRuntime is not defined](https://github.com/babel/babel/issues/5085)
* [babel 插件写法](https://github.com/thejameskyle/babel-handbook)
* [visitor 参数](https://github.com/babel/babel/blob/master/packages/babel-types/src/definitions/es2015.js)
* [未解的问题：ModuleConcatenation bailout: Cannot concat with ](https://github.com/webpack/webpack/issues/5408);

# 图片问题
* 图片资源最好不要重名，输出asset-manifest无法区分

# 单服务与双服务
本项目是一个同构项目，也就是node与web都进行渲染，也就是说，若对一个文件修改则webpack和node端都需要编译。编译的问题好解决，问题是nodejs需要重启，这就会造成一些热替换的问题。还是启动双服务较为妥当。

# 生产环境添加css不能热更新的解决思路
* 每个页面都添加一个[filename].css文件，有则可以热更新。
* 使用 [css-hot-loader](https://www.npmjs.com/package/css-hot-loader) 插件。[参考](https://github.com/neutrinojs/neutrino/issues/802)
* 使用 CSS模块 可以使用模块参数来启用/禁用，[参考](https://60devs.com/webpack-hot-reload-css-modules.html)
* 使用style-loader[https://github.com/webpack-contrib/mini-css-extract-plugin/issues/34]
* 使用 [extract-css-chunks-webpack-plugin](https://www.npmjs.com/package/extract-css-chunks-webpack-plugin) hmr
* 生产环境 将css 打包在一起，正式环境则多个包
* react-hot-loader readme中 ： webpack ExtractTextPlugin is not compatible with React Hot Loader. Please disable it in development. 

1. 接口的方法。加载数据 
2. 组件走接口
3. 路由请求

# 注意事项
1. node渲染时没有css，所以同构不支持css module
2. 图片不能重名。名字与位置无关。
