const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const Config = require('./config/config');
const onerror = require('koa-error');
var model = require('./model');
const controller = require('./controller');
var app = new Koa();
const isProduction = process.env.NODE_ENV === 'development';


// 错误信息处理
onerror(app);


// 控制台打印URL以及页面执行时间：
app.use(async (ctx, next) => {
  var
    start = new Date().getTime(),
    execTime;
  await next();
  execTime = new Date().getTime() - start;
  ctx.response.set('X-Response-Time', `${execTime}ms`);
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...  ${execTime}ms`);
});

//处理静态文件：
if (!isProduction) {
  let staticFiles = require('./static-files');
  app.use(staticFiles('/static/', __dirname + '/static'));
}

// 解析POST请求：,响应json
// koa-json中间件，它会自动将我们返回的数据转换为json格式
// app.use(json());
// app.use(koabody());
app.use(bodyParser());

// add controllers:
// 处理URL路由：
// app.use(Router);
app.use(controller('user')); //   controllers/user
app.use(controller('userFavorites'));
app.use(controller('favorites'));
app.use(controller('favoritesSite'));
app.use(controller('site'));
app.use(controller()); //   controllers


app.listen(Config.node.port);
console.log('app started at port ' + Config.node.port + '...');