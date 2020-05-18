# 概述
    支持在node端渲染react页面。

# 使用方式
    下载项目并安装依赖后。

## 启动
* 测试环境：运行 **npm run start** 启动 development 的开发环境。
* 预上线环境：运行 **npm run start:prod** 启动 production 的开发环境。 

## 添加页面
1. 在 src -> client -> pages 中添加页面的目录；
2. 在 src -> client -> routes.js 中添加对应的路由；

只有将页面添加在路由中，webpack才会进行监听。路由是整个项目的入口。

## 编译
* 测试环境：运行 **npm run build** 启动 development 的编译环境。
* 测试环境：运行 **npm run build:prod** 启动 production 的编译环境。

## 线上

    启动项目的命令是：node dist/server/server/index

# 技术点
* src-> client -> routes.js 是webpack的入口
* dist -> asset-manifest.json 是 webpack-dev-server 与 node server 的连接点

## 技术栈
* react：16.13.1
* react-dom：16.13.1
* react-router：5.1.2
* webpack: 4.43.0
* @babel/cli: 7.8.4

# 注意事项
1. css命名时最好使用命名空间。
2. 图片不能重名。名字与目录无关。

# 支持
* 联系方式：543720160@qq.com