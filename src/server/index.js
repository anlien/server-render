const Koa = require('koa');
const path = require('path');
const app = new Koa();
import { a } from './libs/a';

import App from '../client/index';

app.use(async ctx => {
    ctx.body = App;//编译在组件中完成
});

app.listen(8000);