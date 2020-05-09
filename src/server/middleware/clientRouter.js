import React from 'react';
import routes from '../../client/routes';
import { matchRoutes, renderRoutes } from "react-router-config";
import { renderToString } from 'react-dom/server';

async function clientRouter({ req, res }, next) {
    console.log('req.url', req.url);
    const branch = matchRoutes(routes, req.url);
    // Each item in the array contains two properties: routes and match.
    const { route, match } = branch[0];
    // console.log('match', match);
    // console.log('route', route);
    // console.log('res.body',res.body);
    route.component.then(component => {
        const App = component.default;
        const pageHtml = null;
        try {
            pageHtml = renderToString(<App />);
            res.end(pageHtml);
        } catch (e) {
            //报错做其他处理
            console.log('render err', e);
        }
    })

    await next();
}



export default clientRouter;