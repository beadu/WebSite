var assembly = require('assembly');
var authority = require('authority');
var cache = require('cache');
var drive = require('drive');
var filter = require('filter');
var logger = require('logger');
var router = require('router');
var unload = require('unload');

exports.start = function (bus) {
    //unload.init(bus);
    // 过滤信息
    logger.debug('过滤模块');
    filter.requestFilter(bus);
    // 装配元素
    logger.debug('装配模块');
    assembly.fit(bus, function (bus) {
        //从缓存中获取
        logger.debug('缓存模块');
        cache.get(bus, function (bus) {
            // 路由
            logger.debug('路由模块');
            router.find(bus, function (bus) {
                //从权限认证
                logger.debug('权限模块');
                authority.filter(bus, function (bus) {
                    // 驱动
                    logger.debug('驱动模块');
                    drive.start(bus);
                });
            });
        });
    });
};
