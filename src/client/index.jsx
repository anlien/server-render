/**client的入口 */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, matchPath } from 'react-router-dom';
import RouteComponent from './components/RouteComponent/index';
import routes from './routes';
import App from './App';
import Result from './components/Result/index';
//将异步组件变为同步组件
//与路由进行交互
const [machRouter = null] = routes.filter(item => {
  const { isExact = false } = matchPath(location.pathname, item.path) || {};
  return isExact ? item : false;
});

let rootDom = document.getElementById('root');
let renderPromise = new Promise(resolve => {
  if (machRouter) {
    const pageData = document.getElementById('pageData');
    machRouter
      .getComponent()
      .then(data => {
        machRouter.MachComponent = data.default; //获得的组件，绑在router上
        machRouter.totalData = JSON.parse(pageData.innerText);
      })
      .then(() => {
        resolve();
      });
  } else {
    resolve();
  }
});

renderPromise.then(() => {
  ReactDOM.hydrate(
    <Router>
      <App>
        <Switch>
          {/*与服务端有相似，没必要抽出*/}
          {routes.map((route, index) => {
            const { path, getComponent, MachComponent, totalData } = route;
            return (
              <Route
                path={path}
                key={`route-${index}`}
                exact
                strict
                render={routeProps => (
                  <RouteComponent
                    {...routeProps}
                    getComponent={getComponent}
                    totalData={totalData}
                    MachComponent={MachComponent}
                  />
                )}
              ></Route>
            );
          })}
          <Route>
            {/*此处仅 客户端用到，服务端不需要*/}
            <Result
              status="404"
              title="404"
              subTitle="Sorry, the page you visited does not exist"
            ></Result>
          </Route>
        </Switch>
      </App>
    </Router>,
    rootDom,
  );
});
