const path = require('path');
const { readFileList, resolvePath } = require('./libs/files');
const { compiling } = require('./libs/babel');
const { serverConfigDir } = require('./config');

const readDir = resolvePath(serverConfigDir.srcDir, __dirname);

function runBuildServer() {
    let filesList = [];
    readFileList(readDir, filesList);
    return compiling(filesList);//编译文件
}

module.exports = {
    runBuildServer
}


