import React from 'react';
import routes from '../../client/routes';
import { matchRoutes } from 'react-router-config';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { withRouter } from 'react-router';
import App from '../../client/App';
import Result from '../../client/components/Result/index';

import sendHTML from './sendHTML';
const url = require('url');

//此处需要记录 异常
async function clientRouter({ req, res }, next) {
  const urlObj = url.parse(req.url);
  const branch = matchRoutes(routes, urlObj.pathname);
  // let hasError = false;
  let componentObj = {};
  let MachComponent = {};
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
        //client 与 server不同相同的原因，关键在此处！在服务端时没必要再匹配一次页面
        componentObj = await route.getComponent();
        MachComponent = componentObj.default; //页面组件
        if (MachComponent.fetchComponentData) {
          //页面需要的数据
          totalData.pageData = await MachComponent.fetchComponentData(); //用route 获得数据
        }
        let WithRouterApp = withRouter(MachComponent);
        html = renderToString(
          <StaticRouter location={req.url} context={context}>
            <App>
              <WithRouterApp
                pageData={totalData.pageData}
                commonData={totalData.commonData}
              ></WithRouterApp>
            </App>
          </StaticRouter>,
        );
      } catch (e) {
        //出现错误
        html = renderToString(
          <StaticRouter location={req.url}>
            <Result status="500"></Result>
          </StaticRouter>,
        );
        console.log('报错', e);
      }
    }
    await sendHTML({ req, res }, { html, totalData, assetName: route.name });
  } else {
    //未匹配到路由
    html = renderToString(
      <StaticRouter location={req.url}>
        <App>
          <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist"
          ></Result>
        </App>
      </StaticRouter>,
    );
    //此处可能有样式问题，遇到再解决
    await sendHTML({ req, res }, { html, totalData });
  }
  await next();
}
export default clientRouter;
