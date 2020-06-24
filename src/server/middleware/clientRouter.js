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
            if (App.fetchComponentData) {
                data = await App.fetchComponentData();//用route 获得数据
            }

            let context = {};
            let WithRouterApp = withRouter(App);
            try {
                let html = renderToString(<StaticRouter location={req.url} context={context}><WithRouterApp data={data}></WithRouterApp></StaticRouter>);
                await sendHTML({ req, res }, { html, pageData: [], assetName: route.name });
            } catch (e) {
                //报错做其他处理
                console.log('-------------------render err-----------', e);
            }
        }
    }
    await next();
}
export default clientRouter;