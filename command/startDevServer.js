const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const compiler = webpack(require('./webpack.config'));
const devServerConfig = require('./webpack.deserver.config');
const { runBuildServer } = require('./buildServer');
const { compiling } = require('./libs/babel');
const port = 3001;

const devServer = new WebpackDevServer(compiler, devServerConfig);

compiler.hooks.watchRun.callAsync = (compilation, done) => {
    const { fileTimestamps } = compilation;
    if (fileTimestamps.size > 0) {
        let timesTamps = Array.from(fileTimestamps);
        timesTamps.sort((a, b) => b[1] - a[1]);
        const [filePath, changeTime] = timesTamps[0];
        console.log('babel 编译：', filePath);
        compiling([filePath]);
        // startNode();//重启node
    }
    done();
}

devServer.invalidate(() => {
    console.log('-----------------------编译后执行--------------------------');
    console.time('build server');
    runBuildServer();
    console.timeEnd('build server');
    console.log('启动node服务');
    startNode();
});

let nodeHandle = null;
function startNode() {
    if (nodeHandle) {
        nodeHandle.kill();
    }
    const { spawn } = require('child_process');
    nodeHandle = spawn('node', ['./dist/server/server/index.js']);

    function print(data) {
        // const decoder = new StringDecoder('utf8');
        // const cent = Buffer.from(data);
        console.log(data);
    }

    nodeHandle.stdout.on('data', print);
    nodeHandle.stderr.on('data', print);
    process.stdin.pipe(nodeHandle.stdin);
}


devServer.listen(port, (error) => {
    if (error) console.log('启动失败');
})