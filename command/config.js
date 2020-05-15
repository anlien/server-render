
const path = require('path');
//返回相对地址
function getRelativePath(dirPath) {
    let parsePath = path.parse(__dirname);
    const relativePath = path.relative(__dirname, parsePath.dir) || '.';
    return path.resolve(__dirname, `${relativePath}/${dirPath}`);
}
// // Make sure any symlinks in the project folder are resolved:
// // https://github.com/facebookincubator/create-react-app/issues/637
// const appDirectory = fs.realpathSync(process.cwd());
// const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

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
        index: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000&overlay=false', getRelativePath('src/client/index.js')]
    },
    assetManifest: getRelativePath('dist/www/asset-manifest.json')
}


module.exports = {
    serverConfigDir,
    clientConfig
}