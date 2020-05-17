const Koa = require('koa');
const path = require('path');
const app = new Koa();
const koaStatic = require('koa-static');// 静态资源包
import clientRouter from './middleware/clientRouter';//client url
import { staticDir } from './config.js';

console.log(staticDir);

app.use(clientRouter);
app.use(koaStatic(path.join(__dirname, staticDir)));
app.use(async (ctx, next) => {
    if (ctx.req.method === 'HEAD') {
        ctx.res.end(null);
    }
    if (/\.ico$/i.test(ctx.url)) {
        ctx.res.statusCode = 404
        ctx.res.end('404 - Not Found');
    }
    next();
});
app.use(async ctx => {
    ctx.body = 'App';//编译在组件中完成
});

app.listen(9000);