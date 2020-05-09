import ejs from 'ejs';//待优化，此处有坑，压测的话可能过不去
import path from 'path';
import { assetManifest } from '../asset.js';

export default async function sendHTML({ req, res }, renderData) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    const pageHtml = await renderPage(renderData, req);
    res.setHeader('Content-Length', Buffer.byteLength(pageHtml))
    res.statusCode = 200;
    res.end(req.method === 'HEAD' ? null : pageHtml)
}
async function renderPage({ html, context, modules }, req) {
    const assetUrl = assetManifest();
    let baseVendorArr = ["index.js", "vendor.js"].map(item => {
        return assetUrl[item];//基础数据
    });
    const [homeName] = modules;
    let moduleJsArr = [`${homeName}.js`].map(item => {
        return assetUrl[item];// 获取js
    });
    let moduleCssArr = [`${homeName}.css`].map(item => {
        return assetUrl[item];// 获取css
    });

    let pageHtml = '';
    const data = {
        tdk: '测试网站',
        content: html,
        baseVendorArr,
        moduleJsArr,
        moduleCssArr,
        pageData: JSON.stringify(context.data)
    }
    ejs.renderFile(path.join(__dirname, '../temple/index.ejs'), data, (err, str) => {
        if (err) {
            console.log('报错', err)
        }
        pageHtml = str
    })
    return pageHtml
}
