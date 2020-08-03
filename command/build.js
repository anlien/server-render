const envVal = process.env.BUILD_ENV === 'production' ? 'production' : 'development';
process.env.BABEL_ENV = envVal;
process.env.NODE_ENV = envVal;

const filesize = require('filesize');
const path = require('path');
const { runBuildServer } = require('./buildServer');
const { clientConfig } = require('./config');
const webpack = require('../node_modules/webpack');
const webpackConfig = require('./webpack.config');
let compilerClient = webpack(webpackConfig);
const { makeAssetManifest } = require('./libs/compilerClient_hook');

//第一次编译时生成 asset-manifest.json。之后的更新不再生成。
//此方法用于生成  asset-manifest.json
compilerClient.hooks.done.tap('BuildStatsPlugin', stats => {
  makeAssetManifest({
    stats,
    publicPath: webpackConfig.output.publicPath,
  });
});

// const zlib = require('zlib');
// function gzipSize(str) {
//     return zlib.gzipSync(str, { level: 9 }).length;
// }

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
            folder: path.join(path.basename(buildFolder), path.dirname(asset.name)),
            name: path.basename(asset.name),
          };
          if (isGzipSize) {
            // var fileContents = fs.readFileSync(path.join(buildFolder, asset.name));
            // fileMeg.size = gzipSize(fileContents);
          } else {
            fileMeg.size = Number(asset.size);
          }
          fileMeg.sizeLabel = filesize(fileMeg.size);
          return fileMeg;
        }),
    )
    .reduce((single, all) => all.concat(single), []);
  assets.sort((a, b) => b.size - a.size);
  assets.forEach(asset => {
    console.log(
      `\x1b[40m \x1b[32m ${
        '  ' + asset.sizeLabel + '  ' + asset.folder + path.sep + asset.name
      } \x1b[0m`,
    );
  });
}

let buildClient = () => {
  // 编译的钩子，client端编译结束后，编译server
  // server端依赖于 asset-manifest.json
  return new Promise((resolve, reject) => {
    compilerClient.run((err, stats) => {
      if (err) {
        console.log('compilerClient err', err);
        reject(err);
      }
      const compilerMessage = stats.toJson({}, true);
      const { errors = [], warnings = [] } = compilerMessage;
      if (errors.length) {
        //比如parse失败 通常会返回两个同样的错误 一个parse fail一个module build
        //fail 但是内容是一样的；我们只取第一个即可;
        errors.length = 1;
        return reject(new Error(errors.join('\n\n')));
      }
      if (warnings.length) {
        // console.log('Compiled with warnings.\n');
        // console.log(warnings.join('\n\n'));
      } else {
        console.log('Compiled successfully.\n');
      }
      resolve({ stats, compilerClient });
    });
  });
};

console.time('runBuildClient');
buildClient().then(({ stats }) => {
  console.timeEnd('runBuildClient');
  printFileSizesAfterBuild(stats, clientConfig.buildDir, false);
  console.log('编译server端代码');
  runBuildServer();
});
