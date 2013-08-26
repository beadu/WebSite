var common = require('common');
var config = require('config');
var crypto = require('crypto');
var dbProxy = require('dbProxy');
var unload = require('unload');

var checkKey = true;

exports.auth = { get: 'public', post: 'public' };

exports.get = function (bus) {
    var result = {
        code: config.code.info,
        format: {
            key: checkKey,
            name: '',
            pwd: ''
        },
        msg: '用户注册页面'
    };
    unload.execSuccess(result);
};

exports.post = function (bus) {
    var error = '';
    if (!bus.body.regKey && checkKey)
        error += '验证码不正确';
    if (!bus.body.name)
        error += '没有用户名称';
    if (!bus.body.pwd)
        error += '没有填写密码';
    if (error.length > 0)
        return unload.execError(bus, error);

    var hash = crypto.createHash("md5");
    hash.update(new Buffer(bus.body.pwd, "binary"));
    var encode = hash.digest('hex');

    var user = {
        name: bus.body.name,
        pwd: encode,
        cTime: new Date
    };

    dbProxy.insert('sUser', user, function (error, result) {
        if (err) return unload.execError(bus, error);
        var ticket = common.newGuid();
        var inline = { uid: result._id, ticket: ticket, cTime: new Date(), uTime: new Date() };
        dbProxy.insert('sInline', inline, function () {
            if (err) return unload.execError(bus, error);
            unload.execSuccess(bus);
        });
    });
};