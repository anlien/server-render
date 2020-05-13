const Koa = require('koa');
const path = require('path');
const app = new Koa();
import clientRouter from './middleware/clientRouter';
const koaStatic = require('koa-static');

app.use(koaStatic(path.join(__dirname,"../../www")));
app.use(async (ctx,next)=>{
    if(ctx.req.method === 'HEAD' ){
        ctx.res.end(null );
    }  
    if (/\.ico$/i.test(ctx.url)) {
        ctx.res.statusCode = 404
        ctx.res.end('404 - Not Found');
    }
    next();
})

app.use(clientRouter);

app.use(async ctx => {
    ctx.body = 'App';//编译在组件中完成
});

app.listen(8000);