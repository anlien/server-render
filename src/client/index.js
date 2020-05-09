/**client的入口 */
import React from 'react';
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import routes from './routes';

class App extends React.Component {
    render() {
        return <Switch>{
            routes.map((route, index) => {
                return <Route path={route.path} render={(props) => (<route.component {...props} routes={route.routes} />)}></Route>
            })
        }</Switch>
    }
}

ReactDOM.render(<BrowserRouter></BrowserRouter>, document.body)