const path = require('path');
const fs = require('fs');


//读取文件目录
function readFileList(dir, filesList) {
    const files = fs.readdirSync(dir);
    if (files.length) {
        files.forEach((item, index) => {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                readFileList(fullPath, filesList);
            } else {
                filesList.push(fullPath);
            }
        })
    }
    return filesList;
}

//过滤文件
function filterFiles(filesList = [], extname) {
    let extnameList = {
        js: ['.es6', '.js'],
        img: ['.png', '.gif', '.jpeg', '.jpg'],
        ejs: [".ejs"]
    };
    return filesList.filter(item => {
        const itemExtname = path.extname(item);
        return extnameList[extname].indexOf(itemExtname) !== -1
    })
}

//node 只支持创建一级目录，多级目录需要递归调用
function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}
//process.cwd()  与命令的运行位置有关系
//写文件
function writeFile(_path, data) {
    let relativePath = _path;
    if (path.isAbsolute(_path)) {
        //绝对路径抓为相对路径
        relativePath = path.relative(process.cwd(), _path);
    }
    let dirPath = path.dirname(relativePath);

    if (!fs.existsSync(dirPath)) {
        mkdirsSync(dirPath);
    }
    if (data) {
        fs.writeFile(relativePath, data, function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
}

module.exports = {
    readFileList,
    filterFiles,
    writeFile
}