const babel = require('@babel/core');
const { writeFile, filterFiles } = require('./files');
const { serverConfigDir } = require('../config');
const babelPluginIgnoreMedia = require('./babel-plugin-ignore-media').default;
const babelPluginReplaceImg = require('./babel-plugin-replace-img').default;
const fs = require('fs');
var Terser = require('terser'); //压缩代码 https://www.npmjs.com/package/terser。 与webpack使用的是一个组件。
//服务端使用的babel编译
//webpack 中的另外配置

const babelNodeConfig = {
  presets: [
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    babelPluginIgnoreMedia,
    babelPluginReplaceImg,
  ],
};

//压缩js代码
function terserCode(code) {
  var result = Terser.minify(code);
  if (!result.error) {
    return result.code;
  }
  return code;
}

// 编译js代码
function compiling(filesList = []) {
  const filterJsFileArr = filterFiles(filesList, 'js');
  const isProd = process.env.BABEL_ENV === 'production';
  let promises = filterJsFileArr.map(filePath => {
    return new Promise((resolve, reject) => {
      //https://misc.flogisoft.com/bash/tip_colors_and_formatting
      console.log(`\x1b[40m \x1b[32m babel编译：${filePath} \x1b[0m`);
      babel.transformFile(filePath, babelNodeConfig, function (err, result) {
        if (err) {
          console.error(err);
          reject(false);
        } else if (result) {
          //有值再写
          const code = isProd ? terserCode(result.code) : result.code;
          writeFile(
            filePath
              .replace(serverConfigDir.srcDir, serverConfigDir.buildDir)
              .replace(/\.(t|j)sx?$/, '.js'),
            code,
            () => {
              resolve(true);
            },
          );
        }
      });
    });
  });

  const filterEjsFileArr = filterFiles(filesList, 'ejs');

  filterEjsFileArr.forEach(filePath => {
    const targetPath = filePath.replace(serverConfigDir.srcDir, serverConfigDir.buildDir);
    writeFile(targetPath); //创建路径
    fs.copyFileSync(filePath, targetPath); //也就一两个
  });
  return Promise.all(promises);
}

module.exports = {
  compiling,
};
