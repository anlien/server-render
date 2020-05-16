
module.exports = {
    hot: true,
    host: '0.0.0.0',
    allowedHosts: [
        '127.0.0.1',
        'localhost'
    ],
    watchOptions: {
        ignored: /node_modules/,
        //当第一个文件更改，会在重新构建前增加延迟。
        //这个选项允许 webpack 将这段时间内进行的任何其他更改都聚合到一次重新构建里。以毫秒为单位：
        aggregateTimeout: 500,
        poll: 500 //指定毫秒为单位进行轮询
    },
    publicPath: '/',//webpack-dev-middleware 公开路径
    overlay: false,
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
    compress: true,//gzip压缩文件
    // openPage: '/different/page',打开的页面
    // quiet: true
    writeToDisk: (filePath) => {//两个服务的媒介
        return /asset-manifest\.json$/.test(filePath);
    },
    port: 3001,
    sockPort: 3001,
    serverSideRender: true //生成asset-manifest.json
}