
const babel = require("@babel/core");
const { writeFile } = require('./files');
const { serverConfigDir } = require('../config');
const babelPluginIgnoreMedia = require('./babel-plugin-ignore-media').default;

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
    "plugins": [babelPluginIgnoreMedia]
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
                writeFile(filePath.replace(serverConfigDir.srcDir, serverConfigDir.buidDir), code);
            }
        });
    });
}

module.exports = {
    compiling
}