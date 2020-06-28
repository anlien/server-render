
const { resolvePath } = require('./libs/files');
// // Make sure any symlinks in the project folder are resolved:
// // https://github.com/facebookincubator/create-react-app/issues/637
// const appDirectory = fs.realpathSync(process.cwd());
// const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const serverConfigDir = {
    srcDir: 'src',
    rootDir: 'dist',
    buildDir: 'dist/server',
    watchNodeDir: '../src/server'
}

const clientConfig = {
    srcDir: resolvePath('src/client', __dirname),
    buildDir: resolvePath('dist/www', __dirname),
    entryJs: {
        //根据 浏览器不同加载 不同资源，可以从此处入手
        index: [resolvePath('command/polyfills.js', __dirname), resolvePath('src/client/index.js', __dirname)]
    },
    assetManifestName: 'asset-manifest'
}

module.exports = {
    serverConfigDir,
    clientConfig
}