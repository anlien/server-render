var path = require('path');
var webpack = require('webpack');
var express = require('express');
// const { createProxyMiddleware } = require('http-proxy-middleware');
var webpackConfig = require('./webpack.config');
const { runBuildServer } = require('./buildServer');
const { startNode } = require('./libs/tool');
const { compiling } = require('./libs/babel');
process.env.NODE_ENV = 'development';

const webpackHotMiddleware = require("webpack-hot-middleware");
const webpackDevMiddlewre = require("webpack-dev-middleware");
var app = express();
var compilerClient = webpack(webpackConfig);

const nodePath = './dist/server/server/index.js';
// console.time('runBuildClient');
// buildClient().then(() => {
//     console.timeEnd('runBuildClient');
//     console.log('File sizes:\n');
//     // printFileSizesAfterBuild(stats, clientConfig.buildDir, false);
//     // console.log('File sizes after gzip:\n');
//     // printFileSizesAfterBuild(stats, resolveApp('dist/www'), true);

//     console.log('编译server端代码');
//     runBuildServer();
//     console.log('启动node服务');
//     startNode(nodePath);
//     console.log('webpack 继续监听');
//     // webpackWatch();
// }).then(() => {
// Step 2: Attach the dev middleware to the compiler & the server

// }).then(() => {

// console.log('走向代理？？');
// app.use('/detail', createProxyMiddleware({ target: 'http://localhost:9000', changeOrigin: true }))

// app.use(express.static('./dist/www'));

// app.get('/detail', function (req, res) {
//     console.log(path.resolve(__dirname, path.relative(__dirname, './dist/www/index.html')));
//     res.sendFile(path.resolve(__dirname, path.relative(__dirname, './dist/www/index.html')));
// });

// app.get('*',(req,res)=>{
//     console.log(req.url);
//     console.log('/\.(js|css|jpg|png|jpeg|gif|ico)$/i.test(req.url)',/\.(js|css|jpg|png|jpeg|gif|ico)$/i.test(req.url));
//     if (/\.(js|css|jpg|png|jpeg|gif|ico)$/i.test(req.url)) {
//         try {
//             const pathUrl = path.join(path.join(path.resolve('dist/www'), req.url));
//             console.log('拼接的路径：',pathUrl);
//             res.sendFile(pathUrl);
//             // return await _serveStatic(ctx.req, ctx.res, path)                     
//         } catch (err) {
//             // ctx.res.statusCode = 404
//             // ctx.res.end('404 - Not Found')
//         }
//     }
// })

// })

const instance = webpackDevMiddlewre(compilerClient, {
    serverSideRender: true,
    publicPath: '/'
})

app.use(instance);

//第一次编译结束
instance.waitUntilValid(() => {
    console.log('----------------Package is in a valid state-------------------');
});
instance.invalidate(() => {
    console.log('调用实际？？');
});

// Step 3: Attach the hot middleware to the compiler & the server
app.use(webpackHotMiddleware(compilerClient, {
    log: console.log, path: '/__webpack_hmr',
    heartbeat: 10 * 1000,
    reporter: () => { console.log('---------diaoyong???-----------------') }
}));
// (compilation, done) => {
//     hotMiddleware.publish({ action: 'compiling' })
//     done()
//   }

compilerClient.hooks.watchRun.callAsync = (compilation, done) => {
    const { fileTimestamps } = compilation;
    if (fileTimestamps.size > 0) {
        let timesTamps = Array.from(fileTimestamps);
        timesTamps.sort((a, b) => b[1] - a[1]);
        const [filePath, changeTime] = timesTamps[0];
        console.log('webpack 编译：', filePath);

        // compiling([filePath]);

        // startNode(nodePath);//重启node
    }
    done();
}

app.listen(3000, function (err) {
    if (err) {
        return console.error(err);
    }
    console.log('Listening at http://localhost:3000/');
});

app.use((req, res) => {

    // const { devMiddleware } = res.locals.webpack;
    // const outputFileSystem = devMiddleware.outputFileSystem;
    // const jsonWebpackStats = devMiddleware.stats.toJson();
    // const { assetsByChunkName, outputPath } = jsonWebpackStats;

    const assetsByChunkName = res.locals.webpackStats.toJson().assetsByChunkName;
    const fs = res.locals.fs;
    const outputPath = res.locals.webpackStats.toJson().outputPath;
    const { home, index, vendor } = assetsByChunkName;
    const cssModule = home.filter(item => ".css" === path.extname(item));
    const jsModule = [index, vendor].concat(home.filter(item => ".js" == path.extname(item)))
    console.log('req.url', req.url);
    // Then use `assetsByChunkName` for server-side rendering
    // For example, if you have only one main chunk:
    res.send(`
            <html>
            <head>
                <title>My App</title>
                ${
        cssModule.map((path) => `<link href="/${path}" rel="stylesheet"></link>`)
        }
            </head>
            <body>
                <div id="root"></div>
                ${jsModule.map((path) => `<script src="${path}"></script>`)}
            </body>
            </html>
        `);
});