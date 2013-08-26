//var host = "http://localhost:51656";
var host = '';
var post = function (url, data, fn) {
    $.ajax({
        cache: false,
        data: data,
        type: 'post',
        url: host + url,
        error: function (response, textStatus, errorThrown) {
            if (response.status == 500) {
                alert('服务器异常，请重试或者联系管理员');
            } else if (response.status == 404) {
                alert('请求路径找不到，请重试或者联系管理员');
            } else if (response.status == 0) {
                alert('服务器已停止，请重试或者联系管理员');
            } else {
                alert('请求异常，请重试或者联系管理员');
            }
        },
        success: function (data, textStatus, jqXHR) {
            if (fn == null)
                alert(jqXHR.responseJSON.msg);
            else
                fn(data, textStatus, jqXHR);
        }
    });
};