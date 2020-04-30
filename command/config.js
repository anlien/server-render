
const path = require('path');
//返回相对地址
function getRelativePath(dirPath) {
    let parsePath = path.parse(__dirname);
    const relativePath = path.relative(__dirname, parsePath.dir) || '.';
    return path.resolve(__dirname, `${relativePath}/${ dirPath }`);
}

const serverConfigDir = {
    srcDir: 'src',
    buildDir: 'dist/server'
}

const clientConfig = {
    srcDir: getRelativePath('src/client'),
    buildDir: getRelativePath('dist/www'),
    entryJs: getRelativePath('src/client/index.js')
}


module.exports = {
    serverConfigDir,
    clientConfig
}