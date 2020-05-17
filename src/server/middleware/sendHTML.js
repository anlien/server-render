import ejs from 'ejs';
import path from 'path';
const assetManifest = require("../../../asset-manifest.json");

export default async function sendHTML({ req, res }, renderData) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    const pageHtml = await renderPage(renderData);
    res.setHeader('Content-Length', Buffer.byteLength(pageHtml));
    res.statusCode = 200;
    res.end(req.method === 'HEAD' ? null : pageHtml)
}
async function renderPage({ html, pageData, assetName }) {
    let baseVendorArr = ["index.js", "vendor.js"].map(item => {
        return assetManifest[item];//基础数据
    });

    let moduleJsArr = [`${assetName}.js`].map(item => {
        return assetManifest[item];// 获取js
    }).filter(Boolean);
    let moduleCssArr = [`${assetName}.css`].map(item => {
        return assetManifest[item];// 获取css
    }).filter(Boolean);
    console.log('--------------------moduleCssArr---------------------------', moduleCssArr);
    let pageHtml = '';
    const data = {
        tdk: '测试网站',
        content: html,
        baseVendorArr,
        moduleJsArr,
        moduleCssArr,
        pageData: JSON.stringify(pageData)
    }
    ejs.renderFile(path.join(__dirname, '../template/index.ejs'), data, (err, str) => {
        if (err) {
            console.log('报错', err)
        }
        pageHtml = str
    })
    return pageHtml
}
