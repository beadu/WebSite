var cluster = require('cluster');
var config = require('config');
var dbProxy = require('dbProxy');
var os = require('os');
var http = require('http');
var logger = require('logger');

var app = require('./app');

//服务器响应函数
var fn = function (req, res) {
    res.writeHead(200, { 'content-type': 'application/json;charset=utf-8' });
    logger.debug(req.url);
    //if (req.url === '/favicon.ico') return res.end('no service');

    var bus = {
        basePath: __dirname,
        data: {},
        req: req,
        res: res,
        startTime: new Date()
    };
    logger.debug('启动');
    app.start(bus);
};
//创建服务器
var server = http.createServer(fn);

// 主进程分支
if (cluster.isMaster) {
    // 当一个工作进程结束时，重启工作进程
    cluster.on('exit', function (worker) {
        logger.error('进程"' + worker.process.pid + '"结束！');
        process.nextTick(function () {
            worker = cluster.fork();
            logger.debug('Http重启服务器，新进程：' + worker.process.pid);
        });
    });
    // 初始开启与CPU核心数量相同的工作进程
    var thread = 1;
    if (config.app.thread == 'auto')
        thread = os.cpus().length;
    else if (config.app.thread)
        thread = config.app.thread;
    for (var i = 0; i < thread; i++) {
        var worker = cluster.fork();
    }
} else {// 工作进程分支，启动服务器
    server.listen(config.app.port);//打开服务器监听
    logger.info('服务已经打开' + config.app.port + '端口');
}
// 当主进程被终止时，关闭所有工作进程
process.on('close', function (msg) {
    logger.info(msg);
    for (var pid in workers) {
        process.kill(pid);
    }
    process.exit(0);
});
