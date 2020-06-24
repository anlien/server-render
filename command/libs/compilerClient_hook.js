const fs = require('fs');
const { writeFile, resolvePath } = require('./files');
const path = require('path');
const { clientConfig, serverConfigDir } = require('../config');

function make_asset_manifest({ stats, callback, publicPath }) {
    const { assetsInfo } = stats.compilation;
    const assetsInfoToArr = [];

    if (assetsInfo) {
        assetsInfo.forEach((value, key) => {
            if (!value.hotModuleReplacement) {//过滤 非热更新数据
                assetsInfoToArr.push(key)
            }
        })
    }

    // 生成 asset-manifest.json 中的数据
    // 格式位webpack.config中filename: 'js/[name].[hash].js'
    // 多媒体的目录：media
    let manifest = {};
    assetsInfoToArr.forEach(item => {
        let parseFile = path.parse(item);
        const { dir, name, ext } = parseFile;
        if (dir === "js" || dir === "css") {
            const filename = name.split('.')[0];
            manifest[`${filename}${ext}`] = publicPath + item;
        } else if (dir === "media") {
            const filename = name.split('.')[0];
            manifest[`media/${filename}${ext}`] = publicPath + item;
        }
    });
    writeFile(resolvePath(`../${serverConfigDir.rootDir}/${clientConfig.assetManifestName}.json`), manifest, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        if (callback) callback()
    })
}

module.exports = {
    makeAssetManifest: make_asset_manifest
}