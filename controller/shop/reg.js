var unload = require('unload');

exports.auth = { get: 'protected', post: 'protected' };

exports.get = function (bus) {
    var data = {
        code: 200,
        msg: '注册商店'
    };
    unload.exec(data);
};