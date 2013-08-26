var config = require('config');
var dbProxy = require('dbProxy');
var unload = require('unload');

exports.auth = { get: 'protected', post: 'protected' };

exports.get = function (bus) {
    var result = {
        code: config.code.info,
        format: {
            oldPwd: '',
            newPwd: ''
        },
        msg:'重置密码页面'
    }
    unload.exec(result);
};

exports.post = function (bus) {
    var error = '';
    if (!bus.body.oldPwd)
        error += '请提供旧密码';
    if (!bus.body.newPwd)
        error += '新密码不能为空';
    dbProxy.findOne('sUser', { '_id': bus.identity._id, pwd: bus.body.oldPwd }, function (err, result) {
        if (err)
            return unload.exec({ code: config.code.error, msg: err });
        if (!result)
            return unload.exec({ code: config.code.missed, msg: '旧密码不正确' });
        dbProxy.update('sUser', { '_id': bus.identity._id, pwd: bus.body.newPwd }, function (err, result) {
            if (err)
                return unload.exec({ code: config.code.error, msg: err });
            return unload.exec({ code: config.code.success, msg: '成功更改密码，请牢记新密码' });
        });
    });
};