
const path = require('path');
//返回相对地址
function getRelativePath(dirPath) {
    let parsePath = path.parse(__dirname);
    const relativePath = path.relative(__dirname, parsePath.dir) || '.';
    return path.resolve(__dirname, `${relativePath}/${dirPath}`);
}

const serverConfigDir = {
    srcDir: 'src',
    buildDir: 'dist/server'
}

const clientConfig = {
    srcDir: getRelativePath('src/client'),
    buildDir: getRelativePath('dist/www'),
    // entryJs: {
    //     home: getRelativePath('src/client/pages/home/index.js'),
    //     detail: getRelativePath('src/client/pages/detail/index.js')
    // }
    entryJs: {
        index: getRelativePath('src/client/index.js')
    },
    assetManifest: getRelativePath('dist/www/asset-manifest.json')
}


module.exports = {
    serverConfigDir,
    clientConfig
}