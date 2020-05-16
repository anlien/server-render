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

let buildClient = () => {
    // 编译的钩子，client端编译结束后，编译server
    // server端依赖于 asset-manifest.json 
    return new Promise((resolve, reject) => {
        compilerClient.run((err, stats) => {

            if (err) {
                console.log('compilerClient err', err);
                reject(err);
            }
            const compilerMessage = stats.toJson({}, true);
            const { errors = [], warnings = [] } = compilerMessage;
            if (errors.length) {
                //比如parse失败 通常会返回两个同样的错误 一个parse fail一个module build
                //fail 但是内容是一样的；我们只取第一个即可;
                errors.length = 1;
                return reject(new Error(errors.join('\n\n')));
            }
            if (warnings.length) {
                console.log('Compiled with warnings.\n');
                console.log(warnings.join('\n\n'));
            } else {
                console.log('Compiled successfully.\n');
            }
            resolve({ stats })
        });
    });
}
function webpackWatch() {
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

            startNode(nodePath);//重启node
        }
    });
}