/**client的入口 */
import React from 'react';
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, matchPath } from "react-router-dom";
import routes from './routes';


//将异步组件变为同步组件
const [machRouter = null] = routes.filter(item => {
    const matchResult = matchPath(location.pathname, item.path);
    if (matchResult.isExact) return item;
    return false;
});



function ComNul() {
    return <div>null</div>
}
class App extends React.Component {
    render() {
        return <Switch>{
            routes.map((route, index) => {
                const Com = route.Component || ComNul;
                console.log(Com);
                return <Route path={route.path} key={`route-${index}`}><Com></Com></Route>
            })
        }</Switch>
    }
}

if (machRouter) {
    machRouter.getComponent().then(data => {
        machRouter.Component = data.default; //可以使用组件渲染
    }).then(() => {
        //延迟渲染
        ReactDOM.hydrate(<BrowserRouter><App></App></BrowserRouter>, document.getElementById("root"))
    })
}
