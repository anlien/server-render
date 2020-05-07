
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
    //     home: { import: './src/client/pages/home/index.js', filename: 'pages/[name][ext]' }
    //     // detail: { import: 'src/client/pages/detail/index.js', filename: 'pages/[name][ext]' }
    // }
    entryJs: {
        home: getRelativePath('src/client/pages/home/index.js'),
        detail: getRelativePath('src/client/pages/detail/index.js')
    }
}


module.exports = {
    serverConfigDir,
    clientConfig
}