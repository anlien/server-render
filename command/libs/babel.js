
const babel = require("@babel/core");
const { writeFile, filterFiles } = require('./files');
const { serverConfigDir } = require('../config');
const babelPluginIgnoreMedia = require('./babel-plugin-ignore-media').default;
const babelPluginReplaceImg = require('./babel-plugin-replace-img').default;
const fs = require("fs");

const babelNodeConfig = {
    "presets": [
        "@babel/preset-react",
        [
            "@babel/preset-env",
            {
                "targets": {
                    "node": "current"
                }
            }
        ]
    ],
    "plugins": ["@babel/plugin-proposal-class-properties", babelPluginIgnoreMedia, babelPluginReplaceImg]
};



// 编译js代码
function compiling(filesList = []) {
    const filterJsFileArr = filterFiles(filesList, 'js');
    filterJsFileArr.forEach(filePath => {
        //https://misc.flogisoft.com/bash/tip_colors_and_formatting
        console.log(`\x1b[40m \x1b[32m babel编译：${ filePath } \x1b[0m`)
        babel.transformFile(filePath, babelNodeConfig, function (err, result) {
            if (err) {
                console.error(err);
            }
            if (result) {//有值再写
                let code = result.code;
                writeFile(filePath.replace(serverConfigDir.srcDir, serverConfigDir.buildDir), code);
            }
        });
    });
    const filterEjsFileArr = filterFiles(filesList, 'ejs');

    filterEjsFileArr.forEach(filePath => {
        const targetPath = filePath.replace(serverConfigDir.srcDir, serverConfigDir.buildDir);
        writeFile(targetPath);
        fs.copyFileSync(filePath, targetPath);
    })
}

module.exports = {
    compiling
}