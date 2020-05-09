const Koa = require('koa');
const path = require('path');
const app = new Koa();
import clientRouter from './middleware/clientRouter';

app.use(clientRouter);
app.use(async ctx => {
    ctx.body = 'App';//编译在组件中完成
});

app.listen(8000);