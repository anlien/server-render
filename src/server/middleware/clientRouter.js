import React from 'react';
import routes from '../../client/routes';
import { matchRoutes } from 'react-router-config';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { withRouter } from 'react-router';

import sendHTML from './sendHTML';
const url = require('url');
//此处需要记录 异常
async function clientRouter({ req, res }, next) {
  const urlObj = url.parse(req.url);
  const branch = matchRoutes(routes, urlObj.pathname);
  // let hasError = false;
  let componentObj = {};
  let App = {};
  let html = '';
  let totalData = {
    pageData: {},
    commonData: {},
  };
  let context = {}; //组件中的信息

  if (branch.length > 0) {
    //没有匹配到路由时的处理
    const { route, match } = branch[0];
    if (match.isExact) {
      try {
        componentObj = await route.getComponent(); //
        App = componentObj.default; //页面组件
        if (App.fetchComponentData) {
          //页面需要的数据
          totalData.pageData = await App.fetchComponentData(); //用route 获得数据
        }
        let WithRouterApp = withRouter(App);
        html = renderToString(
          <StaticRouter location={req.url} context={context}>
            <WithRouterApp
              pageData={totalData.pageData}
              commonData={totalData.commonData}
            ></WithRouterApp>
          </StaticRouter>,
        );
      } catch (e) {
        console.log('报错', e);
      }
    }
    await sendHTML({ req, res }, { html, totalData, assetName: route.name });
  }
  await next();
}
export default clientRouter;
