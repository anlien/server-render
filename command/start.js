const fs = require('fs');
const zlib = require('zlib');
const filesize = require('filesize');
const path = require('path');

const buildClient = require('./buildClient').default;
const { runBuildServer } = require('./buildServer');
const { clientConfig } = require('./config');
const { compiling } = require('./libs/babel');

function gzipSize(str) {
    return zlib.gzipSync(str, { level: 9 }).length;
}

/**
 * 输出文件打包后gzip的大小
 * @param {webpack打包后状态} webpackStats 
 * @param {build目录} buildFolder 
 */
function printFileSizesAfterBuild(webpackStats, buildFolder, isGzipSize) {
    var assets = (webpackStats.stats || [webpackStats])
        .map(stats =>
            stats
                .toJson()
                .assets.filter(asset => /\.(js|css)$/.test(asset.name))
                .map(asset => {
                    let fileMeg = {
                        folder: path.join(
                            path.basename(buildFolder),
                            path.dirname(asset.name)
                        ),
                        name: path.basename(asset.name)
                    };
                    if (isGzipSize) {
                        var fileContents = fs.readFileSync(path.join(buildFolder, asset.name));
                        fileMeg.size = gzipSize(fileContents);
                    } else {
                        fileMeg.size = Number(asset.size);
                    }
                    fileMeg.sizeLabel = filesize(fileMeg.size);
                    return fileMeg;
                })
        )
        .reduce((single, all) => all.concat(single), []);
    assets.sort((a, b) => b.size - a.size);
    assets.forEach(asset => {
        console.log(`\x1b[40m \x1b[32m ${'  ' + asset.sizeLabel + '  ' + asset.folder + path.sep + asset.name} \x1b[0m`)
    });
}

function startNode() {
    console.log(process.cwd());
    const { spawn } = require('child_process');
    const ls = spawn('node', ['./dist/server/server/index.js']);

    ls.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    ls.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    ls.on('close', (code) => {
        console.log(`子进程退出，使用退出码 ${code}`);
    });
}


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
            console.log('webpack 编译：',filePath);
            compiling([filePath]);
        }
    });
}

