var config = require('config');
var cookie = require('cookie');
var dbProxy = require('dbProxy');
var unload = require('unload');

exports.auth = { get: 'private', post: 'protected' };

exports.get = function (bus) {
    dbProxy.remove('sInline', { uid: bus.identity.uid }, function (err, result) {
        if (err) return unload.execError(bus, err);
        cookie.remove('ticket');
        bus.data = {
            code: config.code.success,
            msg: '安全退出系统'
        };
        unload.execSuccess(bus);
    });
};