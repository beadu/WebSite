var config = require('config');
var cookie = require('cookie');
var db = require('dbProxy').db;
var unload = require('unload');

exports.auth = { get: 'public', post: 'private' };

exports.get = function (bus) {
    if (!bus.identity.isLogin)
        return unload.exec({ code: config.code.info, msg: '用户未登录' });

    return unload.exec({ code: config.code.info, ticket: bus.identity.ticket });
};