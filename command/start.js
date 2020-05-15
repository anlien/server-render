const fs = require('fs');
const zlib = require('zlib');
const filesize = require('filesize');
const path = require('path');

const buildClient = require('./buildClient').default;
const { runBuildServer } = require('./buildServer');
const { clientConfig } = require('./config');
const { compiling } = require('./libs/babel');

console.time('runBuildClient');
buildClient().then(({ stats, compilerClient }) => {
    console.timeEnd('runBuildClient');
    console.log('File sizes:\n');
    printFileSizesAfterBuild(stats, clientConfig.buildDir, false);
    // console.log('File sizes after gzip:\n');
    // printFileSizesAfterBuild(stats, resolveApp('dist/www'), true);

    console.log('编译server端代码');
    runBuildServer();
    console.log('启动node服务');
    startNode();
    console.log('webpack 继续监听');
    webpackWatch(compilerClient);
});


function webpackWatch(compilerClient) {
    //监听事件
    compilerClient.watch({
        ignored: /node_modules/,
        aggregateTimeou: 300,
        pull: 1000  // 单位：ms
    }, (err, stats) => {
        const { fileTimestamps } = stats.compilation;
        if (fileTimestamps.size > 0) {
            let timesTamps = Array.from(fileTimestamps);
            timesTamps.sort((a, b) => b[1] - a[1]);
            const [filePath, changeTime] = timesTamps[0];
            console.log('webpack 编译：', filePath);

            compiling([filePath]);

            startNode();//重启node
        }
    });
}

