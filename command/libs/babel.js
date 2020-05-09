
const babel = require("@babel/core");
const { writeFile } = require('./files');
const { serverConfigDir } = require('../config');
const babelPluginIgnoreMedia = require('./babel-plugin-ignore-media').default;
const babelPluginReplaceImg = require('./babel-plugin-replace-img').default;

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
    "plugins": [babelPluginIgnoreMedia, babelPluginReplaceImg]
};



// 编译js代码
function compiling(filesList = []) {
    filesList.forEach(filePath => {
        babel.transformFile(filePath, babelNodeConfig, function (err, result) {
            if (err) {
                console.log(err);
            }
            if (result) {//有值再写
                let code = result.code;
                // console.log('result.code',result.code); ///若无法替换，则在此使用
                writeFile(filePath.replace(serverConfigDir.srcDir, serverConfigDir.buildDir), code);
            }
        });
    });
}

module.exports = {
    compiling
}