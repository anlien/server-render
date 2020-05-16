
const { resolvePath } = require('./libs/files');
// // Make sure any symlinks in the project folder are resolved:
// // https://github.com/facebookincubator/create-react-app/issues/637
// const appDirectory = fs.realpathSync(process.cwd());
// const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const serverConfigDir = {
    srcDir: 'src',
    buildDir: 'dist/server',
    watchNodeDir: resolvePath('src/server', __dirname)
}

const clientConfig = {
    srcDir: resolvePath('src/client', __dirname),
    buildDir: resolvePath('dist/www', __dirname),
    entryJs: {
        index: resolvePath('src/client/index.js', __dirname)
    }
}

module.exports = {
    serverConfigDir,
    clientConfig
}