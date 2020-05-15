# server-render
react 在服务端渲染

# 第一版
.babelrc
```js
{
   "presets": [
      "@babel/preset-react",
      [
         "@babel/preset-env",
         {
            "targets": {
               "node": "current"
            }
         }
      ]
   ]
}
```
package.json
```js
 "scripts": {
    "build": "babel src -d dist"
  },
 "dependencies": {
    "koa": "^2.11.0",
    "react": "^16.13.1",
    "react-dom": "^16.13.1"
  },
  "devDependencies": {
    "@babel/cli": "^7.8.4",
    "@babel/core": "^7.9.0",
    "@babel/preset-env": "^7.9.5",
    "@babel/preset-react": "^7.9.4"
  }
```
1. 运行 npm run build & node dist/server/index.js 直接可以运行

# 第二版
node端使用babel编译。client使用webpack编译。

# 遇到的问题
* [Async functions producing an error "ReferenceError: regeneratorRuntime is not defined](https://github.com/babel/babel/issues/5085)

* [babel 插件写法](https://github.com/thejameskyle/babel-handbook)
* [visitor 参数](https://github.com/babel/babel/blob/master/packages/babel-types/src/definitions/es2015.js)

# 图片问题
* 图片资源最好不要重名，输出asset-manifest无法区分

# 单服务与双服务
本项目是一个同构项目，也就是node与web都进行渲染，也就是说，若对一个文件修改则webpack和node端都需要编译。编译的问题好解决，问题是nodejs需要重启，这就会造成一些热替换的问题。还是启动双服务较为妥当。

不考虑使用 webpack-dev-server ，原因有：1.webpack-dev-server 也是启动一个express. 2.webpack-dev-server不容易控制；