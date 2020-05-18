/**client的入口 */
import React from 'react';
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, matchPath } from "react-router-dom";
import routes from './routes';
import PropTypes from 'prop-types';

//加载组件的场景动画
function Loading() {
    return <div>loading</div>;
}

//route 下的子组件。route 5较为灵活，可以灵活控制
class RouteComponent extends React.Component {
    constructor(props) {
        super(props);
        const { MachComponent = null } = props;
        let isloading = !MachComponent;//
        this.MachComponent = MachComponent || Loading;
        this.state = {
            isloading
        }
    }
    //子组件的上下文
    getChildContext() {
        const { history, location } = this.props;
        return {
            history,
            location
        }
    }
    componentDidMount() {
        const { getComponent } = this.props;
        if (this.state.isloading) {
            getComponent().then(data => {
                this.MachComponent = data.default
                this.setState({
                    isloading: false
                })
            })
        }
    }

    render() {
        const { MachComponent } = this;
        return <MachComponent />
    }
}

RouteComponent.childContextTypes = {
    history: PropTypes.object,
    location: PropTypes.object
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return <Switch>{
            routes.map((route, index) => {
                const { path, getComponent, MachComponent } = route;
                return <Route path={path} key={`route-${index}`}
                    exact
                    strict
                    render={(routeProps) => <RouteComponent {...routeProps} getComponent={getComponent} MachComponent={MachComponent} />}></Route>
            })
        }</Switch>
    }
}
let HotApp = App;

if (!__ISPROD__) {
    //开发模式时使用热替换
    const { hot } = require('react-hot-loader');
    HotApp = hot(module)(App)
}

//将异步组件变为同步组件
//与路由进行交互
const [machRouter = null] = routes.filter(item => {
    const { isExact = false } = matchPath(location.pathname, item.path) || {};
    return isExact ? item : false;
});


if (machRouter) {
    machRouter.getComponent().then(data => {
        machRouter.MachComponent = data.default; //获得的组件，绑在router上
    }).then(() => {
        //延迟渲染，避免前后端渲染不一致
        ReactDOM.hydrate(<BrowserRouter><HotApp></HotApp></BrowserRouter>, document.getElementById("root"))
    })
}
