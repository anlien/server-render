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
1. 运行 npm run build & node dist/server/index.js 直接可以运行。这个就是简单的服务端渲染。

# 第二版
node端使用babel编译。client使用webpack编译。

# 遇到的问题
* [Async functions producing an error "ReferenceError: regeneratorRuntime is not defined](https://github.com/babel/babel/issues/5085)