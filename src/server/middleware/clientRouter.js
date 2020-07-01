import React from 'react';
import routes from '../../client/routes';
import { matchRoutes } from "react-router-config";
import { renderToString } from 'react-dom/server';
import { StaticRouter } from "react-router";
import { withRouter } from "react-router";

import sendHTML from './sendHTML';
const url = require('url');

async function clientRouter({ req, res }, next) {
    const urlObj = url.parse(req.url);
    const branch = matchRoutes(routes, urlObj.pathname);

    if (branch.length > 0) {//没有匹配到路由时的处理
        const { route, match } = branch[0];
        if (match.isExact) {
            const componentObj = await route.getComponent();//
            const App = componentObj.default;//页面组件
            let data = {};
            try {
                if (App.fetchComponentData) {
                    //页面需要的数据
                    data = await App.fetchComponentData();//用route 获得数据
                }
            } catch (e) {
                data = {};
                console.error('服务端请求接口 出了错误');//记录日志
            }
            let context = {};
            let WithRouterApp = withRouter(App);
            let totalData = {
                pageData: data,
                commonData: {}
            }
            let html = '';
            try {
                html = renderToString(<StaticRouter location={req.url} context={context}>
                    <WithRouterApp pageData={totalData.pageData} commonData={totalData.commonData}></WithRouterApp>
                </StaticRouter>);
            } catch (e) {
                html = ''
                console.error('渲染组件出了错误');//记录日志
            }
            await sendHTML({ req, res }, { html, totalData, assetName: route.name });
        }
    }
    await next();
}
export default clientRouter;