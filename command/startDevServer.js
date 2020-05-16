const { StringDecoder } = require('string_decoder');
const path = require('path');
const chokidar = require('chokidar');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config');
const compiler = webpack(webpackConfig);
const devServerConfig = require('./webpack.deserver.config');
const { runBuildServer } = require('./buildServer');
const { compiling } = require('./libs/babel');
const { writeFile, resolvePath, mkdirsSync } = require('./libs/files');
const { serverConfigDir } = require('./config');


let isInit = false;//是否初始

const devServer = new WebpackDevServer(compiler, devServerConfig);
// console.log(devServer.app.use);

compiler.hooks.watchRun.callAsync = (compilation, done) => {
    const { fileTimestamps } = compilation;
    if (fileTimestamps.size > 0) {
        let timesTamps = Array.from(fileTimestamps);
        timesTamps.sort((a, b) => b[1] - a[1]);
        const [filePath] = timesTamps[0];
        console.log('babel 编译：', filePath);
        compiling([filePath]);
    }
    done();
}

//第一次编译时生成 asset-manifest.json。之后的更新不再生成。
//此方法用于生成  asset-manifest.json
compiler.hooks.done.tap('BuildStatsPlugin', (stats) => {
    if (!isInit) return;
    const { assetsInfo } = stats.compilation;
    const assetsInfoToArr = [];
    const publicPath = webpackConfig.output.publicPath;

    if (assetsInfo) {
        assetsInfo.forEach((value, key) => {
            if (!value.hotModuleReplacement) {//过滤 非热更新数据
                assetsInfoToArr.push(key)
            }
        })
    }

    //生成 asset-manifest.json 中的数据
    // 格式位webpack.config中filename: 'js/[name].[hash].js'
    let manifest = {};
    assetsInfoToArr.forEach(item => {
        let parseFile = path.parse(item);
        const { dir, name, ext } = parseFile;
        if (dir === "js" || dir === "css") {
            const filename = name.split('.')[0];
            manifest[`${filename}${ext}`] = publicPath + item;
        } else if (dir === "media") {
            const filename = name.split('.')[0];
            manifest[`media/${filename}${ext}`] = publicPath + item;
        }
    });
    writeFile(resolvePath('../dist/asset-manifest.json'), manifest, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        startNode();
    })
});
//webpack-dev-middle
devServer.invalidate(() => {
    isInit = true;//初始完
    console.time('build server');
    runBuildServer().then(data => {
        if (data.every(item => item)) {
            console.log('启动node服务');
            startNode();
        }
    });
    console.timeEnd('build server');
});


let nodeHandle = null;
function startNode() {
    if (nodeHandle) {
        nodeHandle.kill();
    }
    const { spawn } = require('child_process');
    nodeHandle = spawn('node', ['./dist/server/server/index.js']);

    function print(data) {
        const decoder = new StringDecoder('utf8');//解码
        const cent = Buffer.from(data);
        console.log(decoder.write(cent));
    }

    nodeHandle.stdout.on('data', print);
    nodeHandle.stderr.on('data', print);
    process.stdin.pipe(nodeHandle.stdin);
}

//启动服务 监听在路由中的文件
devServer.listen(devServerConfig.port, (error) => {
    if (error) console.log('启动失败');
})

//监听服务端，不在路由中的文件
const watcher = chokidar.watch(resolvePath('../src/server'), {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
});


let compilingHandle = null;
// Add event listeners.
watcher.on('change', filePath => {
    console.log(`File ${filePath} has been change`);
    if (!compilingHandle) {
        compilingHandle = setTimeout(() => {
            compiling([filePath]);
            compilingHandle = null;
        }, 500);
    }
}).on('unlink', filePath => {
    console.log(`File ${filePath} has been removed`);
}).on('addDir', filePath => {
    console.log('创建目录：', path.normalize(filePath.replace(serverConfigDir.srcDir, serverConfigDir.buildDir)));
    mkdirsSync(path.normalize(filePath.replace(serverConfigDir.srcDir, serverConfigDir.buildDir)));//创建目录
});

['SIGINT', 'SIGTERM'].forEach(function (sig) {
    process.on(sig, function () {
        devServer.close();
        process.exit();
    });
});