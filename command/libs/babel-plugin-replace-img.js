
//在线：https://astexplorer.net/#/Z1exs6BWMq
//https://www.babeljs.cn/docs/babel-core
//暂时只支持 require(media)
// 参考：https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md
const _path = require('path');
exports.default = function ({ types: t }) {
    return {
        visitor: {
            CallExpression: {
                exit: function exit(path, state) {
                    try {
                        // A Path is an object representation of the link between two nodes.
                        let node = path.node;
                        const [requireVal = {}] = node.arguments;
                        if (/\.(png|gif|jpg)$/.test(requireVal.value)) {
                            //asset-manifest 中的资源不支持同名
                            const clientConfig = require('../../dist/asset-manifest.json');
                            const { base: pathVal } = _path.parse(requireVal.value);
                            const replacePath = clientConfig[`media/${pathVal}`];
                            if (replacePath) {
                                path.replaceWithSourceString(`'${replacePath}'`);
                            } else {
                                console.log('未找到图片：',pathVal);
                            }
                        }
                    }catch(e){
                        console.log("---------------babel-plugin-replace-img-----未找到文件---------");
                    }
               
                }
            }
        },
    };
}