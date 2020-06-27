import ejs from 'ejs';
import path from 'path';
const configData = require('../config');
const assetManifest = require(`../../../${configData.manifest}.json`);
const templatePath = path.join(__dirname, '../template/index.ejs');

export default async function sendHTML({ req, res }, renderData) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    const pageHtml = await renderPage(renderData);
    res.setHeader('Content-Length', Buffer.byteLength(pageHtml));
    res.statusCode = 200;
    res.end(req.method === 'HEAD' ? null : pageHtml)
}
async function renderPage({ html, totalData, assetName }) {
    let baseVendorArr = configData['baseVendor'].map(item => {
        return assetManifest[item];//基础数据
    });

    let moduleJsArr = [`${assetName}.js`].map(item => {
        return assetManifest[item];// 获取js
    }).filter(Boolean);
    let moduleCssArr = [`${assetName}.css`].map(item => {
        return assetManifest[item];// 获取css
    }).filter(Boolean);

    let pageHtml = '';
    const data = {
        tdk: configData.tdk,
        content: html,
        baseVendorArr,
        moduleJsArr,
        moduleCssArr,
        totalData: JSON.stringify(totalData)
    }
    ejs.renderFile(templatePath, data, (err, str) => {
        if (err) {
            console.log('报错', err)
        }
        pageHtml = str
    })
    return pageHtml
}
