const babel = require("@babel/core");
const path = require('path');
const filePath = path.resolve(__dirname, "../src/client/index.js");
console.log('filePath', filePath);

babel.transformFile('start.js', { }, function (err, result) {
    console.log('result', result);
    // result; // => { code, map, ast }
});