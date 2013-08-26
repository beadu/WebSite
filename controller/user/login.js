var common = require('common');
var config = require('config');
var cookie = require('cookie');
var dbProxy = require('dbProxy');
var logger = require('logger');
var unload = require('unload');

exports.auth = { get: 'public', post: 'public' };

exports.get = function (bus) {
    var result = {
        code: config.code.info,
        format: {
            name: '',
            pwd: ''
        },
        msg: '用户登录页面'
    };
    unload.exec(result);
};

exports.post = function (bus) {
    var error = '';
    if (!bus.body.name)
        error += '用户名称不能为空;';
    if (!bus.body.pwd)
        error += '密码不能为空;';
    if (error.length > 0)
        return unload.execError(bus, error);

    dbProxy.findOne('sUser', { name: bus.body.name, pwd: bus.body.pwd }, function (error, result) {
        if (error) return unload.execError(bus, error);

        if (!result) return unload.execError(bus, "用户名或密码错误");
        var ticket = common.newGuid();
        logger.debug(JSON.stringify(result));
        var inline = { uid: result._id, ticket: ticket, cTime: new Date(), uTime: new Date() };
        dbProxy.insert('sInline', inline, function (error, result) {
            if (error) return unload.execError(bus, error);

            bus.data.success = true;
            bus.data.msg = '登录成功';
            bus.data.ticket = ticket;
            if (bus.body.url) {
                bus.data.code = unload.code.skip;
                bus.data.skip = bus.body.vPath;
            }
            unload.exec(bus);
        });
        cookie.set('ticket', ticket);
    });
};