const fs = require('fs');

/**
 * @function 
 * @description 注册URL
 * @param {} router koa-router
 * @param {String} mapping controllers下目录名
 */
function addMapping(router, mapping) {
  for (var url in mapping) {

    // 注册 GET
    if (url.startsWith('GET ')) {
      var path = url.substring(4);
      // path          /index
      // mapping[url]  async (ctx, next) => {}
      router.get(path, mapping[url]);
      console.log(`register URL mapping: GET ${path}`);
    }

    // 注册 POST
    else if (url.startsWith('POST ')) {
      var path = url.substring(5);
      router.post(path, mapping[url]);
      console.log(`register URL mapping: POST ${path}`);
    } else {
      console.log(`invalid URL: ${url}`);
    }
  }
}

/**
 * @function 
 * @description 处理每个js文件
 * @param {} router koa-router
 * @param {String} mapping controllers下目录名
 */
function addControllers(router, controllers_dir) {
  var files = fs.readdirSync(__dirname + controllers_dir);

  var js_files = files.filter((f) => {
    return f.endsWith('.js');
  });

  for (var f of js_files) {
    console.log(`process controller: ${f}...`);
    let mapping = require(__dirname + controllers_dir + '/' + f);
    addMapping(router, mapping);
  }
}


/**
 * @function
 * @description
 * @param {String} dir 要注册url的controller目录
 */
module.exports = function (dir) {
  dir = dir || '';
  let
    controllers_dir = '/controllers/' + dir, // 如果不传参数，扫描目录默认为'controllers'
    router = require('koa-router')();
  //注册URL
  addControllers(router, controllers_dir);
  return router.routes();
};