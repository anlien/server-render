/**client的入口 */
import React from 'react';
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, matchPath } from "react-router-dom";
import routes from './routes';
import PropTypes from 'prop-types';
function Loading() {
    return <div>loading</div>;
}

class RouteComponent extends React.Component {
    constructor(props) {
        super(props);
        const { MachComponent } = props;
        let isloading = false;
        if (MachComponent) {
            this.MachComponent = MachComponent;
        } else {
            this.MachComponent = Loading;
            isloading = true;
        }
        this.state = {
            isloading
        }
    }
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
                console.log(route);
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
    const { hot } = require('react-hot-loader');
    HotApp = hot(module)(App)
}

// const HotApp = App;
//将异步组件变为同步组件
const [machRouter = null] = routes.filter(item => {
    const { isExact = false } = matchPath(location.pathname, item.path) || {};
    return isExact ? item : false;
});


if (machRouter) {
    machRouter.getComponent().then(data => {
        machRouter.MachComponent = data.default; //可以使用组件渲染
    }).then(() => {
        //延迟渲染
        ReactDOM.hydrate(<BrowserRouter><HotApp></HotApp></BrowserRouter>, document.getElementById("root"))
    })
}
