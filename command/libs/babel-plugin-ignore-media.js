// 照着npm中 babel-ignore-css-media 插件写的
// https://github.com/babel/babel/blob/master/packages/babel-types/src/definitions/es2015.js
// 示例：
// https://github.com/babel/babel/blob/2b6ff53459d97218b0cf16f8a51c14a165db1fd2/packages/babel-plugin-transform-flow-comments/src/index.js#L47
exports.default = function () {
    return {
        visitor: {
            ImportDeclaration: {
                exit: function exit(path, state) {
                    let node = path.node;
                    if (/\.(css|scss|less)$/.test(node.source.value)) {
                        path.remove();
                    }
                }
            }
        },
    };
}