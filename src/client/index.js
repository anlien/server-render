/**client的入口 */
import React from 'react';
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import routes from './routes';

class App extends React.Component {
    render() {
        return <Switch>{
            routes.map((route, index) => {
                return <Route path={route.path} render={(props) =>{
                    const PageComponent = route.getComponent();
                    console.log(PageComponent);
                    return <PageComponent></PageComponent>
                }}></Route>
            })
        }</Switch>
    }
}

ReactDOM.render(<BrowserRouter><App></App></BrowserRouter>, document.getElementById("root"))