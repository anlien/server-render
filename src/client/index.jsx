/**client的入口 */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, matchPath } from 'react-router-dom';
import RouteComponent from './RouteComponent';
import routes from './routes';
//route 下的子组件。route 5较为灵活，可以灵活控制

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Switch>
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
      </Switch>
    );
  }
}

//将异步组件变为同步组件
//与路由进行交互
const [machRouter = null] = routes.filter(item => {
  const { isExact = false } = matchPath(location.pathname, item.path) || {};
  return isExact ? item : false;
});

if (machRouter) {
  const pageData = document.getElementById('pageData');
  machRouter
    .getComponent()
    .then(data => {
      machRouter.MachComponent = data.default; //获得的组件，绑在router上
      machRouter.totalData = JSON.parse(pageData.innerText);
    })
    .then(() => {
      //延迟渲染，避免前后端渲染不一致
      ReactDOM.hydrate(
        <BrowserRouter>
          <App></App>
        </BrowserRouter>,
        document.getElementById('root'),
      );
    });
} else {
  console.log('异常处理');
}
export default App;
