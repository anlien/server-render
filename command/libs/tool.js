const fs = require('fs');
const zlib = require('zlib');
const filesize = require('filesize');
const path = require('path');

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

/**
 * 启动node
 */
let nodeHandle = null;
function startNode(path) {
    if (nodeHandle) {
        nodeHandle.kill();
    }
    const { spawn } = require('child_process');
    nodeHandle = spawn('node', [path]);

    function print(data) {
        // const decoder = new StringDecoder('utf8');
        const cent = Buffer.from(data);
        console.log(cent);
    }

    nodeHandle.stdout.on('data', print);
    nodeHandle.stderr.on('data', print);
    process.stdin.pipe(nodeHandle.stdin);
}


module.exports = {
    printFileSizesAfterBuild,
    startNode
}