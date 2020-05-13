import React from 'react';
import routes from '../../client/routes';
import { matchRoutes } from "react-router-config";
import { renderToString } from 'react-dom/server';
import sendHTML from './sendHTML';

async function clientRouter({ req, res }, next) {
    console.log('req.url', req.url);
    const branch = matchRoutes(routes, req.url);
    const { route, match } = branch[0];
    route.component.then(component => {
        const App = component.default;
        let html = null;
        try {
            html = renderToString(<App />);
            sendHTML({ req, res }, { html, pageData: [], assetName: route.name });
        } catch (e) {
            //报错做其他处理
            console.log('render err', e);
        }
    })
    await next();
}
export default clientRouter;