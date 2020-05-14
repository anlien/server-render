const fs = require('fs');
const zlib = require('zlib');
const filesize = require('filesize');
const path = require('path');

const buildClient = require('./buildClient').default;
const { runBuildServer } = require('./buildServer');
const { clientConfig } = require('./config');

function gzipSize(str) {
    return zlib.gzipSync(str, { level: 9 }).length;
}

/**
 * 输出文件打包后gzip的大小
 * @param {webpack打包后状态} webpackStats 
 * @param {build目录} buildFolder 
 */
function printFileSizesAfterBuild(webpackStats, buildFolder, isGzipSize) {
    var assets = (webpackStats.stats || [webpackStats])
        .map(stats =>
            stats
                .toJson()
                .assets.filter(asset => /\.(js|css)$/.test(asset.name))
                .map(asset => {
                    let fileMeg = {
                        folder: path.join(
                            path.basename(buildFolder),
                            path.dirname(asset.name)
                        ),
                        name: path.basename(asset.name)
                    };
                    if (isGzipSize) {
                        var fileContents = fs.readFileSync(path.join(buildFolder, asset.name));
                        fileMeg.size = gzipSize(fileContents);
                    } else {
                        fileMeg.size = Number(asset.size);
                    }
                    fileMeg.sizeLabel = filesize(fileMeg.size);
                    return fileMeg;
                })
        )
        .reduce((single, all) => all.concat(single), []);
    assets.sort((a, b) => b.size - a.size);
    assets.forEach(asset => {
        console.log(`\x1b[40m \x1b[32m ${'  ' + asset.sizeLabel + '  ' + asset.folder + path.sep + asset.name} \x1b[0m`)
    });
}

console.time('runBuildClient');
buildClient().then((stats) => {
    console.timeEnd('runBuildClient');
    console.log('File sizes:\n');
    printFileSizesAfterBuild(stats, clientConfig.buildDir, false);
    // console.log('File sizes after gzip:\n');
    // printFileSizesAfterBuild(stats, resolveApp('dist/www'), true);
    console.log('编译server端代码');
    runBuildServer();
})