const path = require('path');
const { readFileList, filterFiles } = require('./libs/files');
const { compiling } = require('./libs/babel');
const { serverConfigDir } = require('./config');

// console.log('__dirname',__dirname);

let parsePath = path.parse(__dirname);
const relativePath = path.relative(__dirname, parsePath.dir) || '.';
const config = {
    readDir: path.resolve(__dirname, `${relativePath}/${serverConfigDir.srcDir}`),
    writeDir: path.resolve(__dirname, `${relativePath}/${serverConfigDir.buildDir}`)
};


function runBuildServer() {
    let filesList = [];
    readFileList(config.readDir, filesList);
    // 编译文件
   return compiling(filesList);
}

module.exports = {
    runBuildServer
}


