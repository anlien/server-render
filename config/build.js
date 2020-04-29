const babel = require("@babel/core");
const path = require('path');
const { readFileList,filterFiles,writeFile } = require('./libs/files');
const config = {
    readDir: path.resolve(__dirname,'../src'),
    writeDir: path.resolve(__dirname,'../dist')
};

// const filePath = path.resolve(__dirname, "../src/client/index.js");



let filesList = [];
readFileList(config.readDir,filesList);
const filterFileArr = filterFiles(filesList,'js');

filterFileArr.map((item) => {
    babel.transformFile(item, {
    }, function (err, result) {
        if(result){
            let code = result.code;
            writeFile(item.replace('src','dist'),code);
        }
    });
})



