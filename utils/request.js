module.exports = function(t) {
  // console.log(t.header)
    t.data || (t.data = {});
    var a = wx.getStorageSync("access_token");
    // a && (t.data.access_token = a),
	 wx.request({
        url: t.url,
        header: t.header || {
            "content-type": "application/x-www-form-urlencoded",
			"Authorization":'Bearer '+a
        },
        data: t.data || {},
        method: t.method || "GET",
        dataType: t.dataType || "json",
        success: function(a) {
			// console.log(a);
			t.success && t.success(a.data);
			// a.data.code==1?t.success && t.success(a.data):wx.showModal({
			// 	title:a.data.msg
			// });
            // -1 == a.data.code ? getApp().login() : -2 == a.data.code ? wx.redirectTo({
            //     url: "/pages/store-disabled/store-disabled"
            // }) : t.success && t.success(a.data);
        },
        fail: function(a) {
            console.warn("--- request fail >>>"), console.warn("--- " + t.url + " ---"), console.warn(a), 
            console.warn("<<< request fail ---");
            var e = getApp();
            e.is_on_launch ? (e.is_on_launch = !1, wx.showModal({
                title: "网络请求出错",
                content: a.errMsg,
                showCancel: !1,
                success: function(a) {
                    a.confirm && t.fail && t.fail(a);
                }
            })) : (wx.showToast({
                title: a.errMsg,
				icon:"none"
                // image: "/images/icon-warning.png"
            }), t.fail && t.fail(a));
        },
        complete: function(e) {
            if (200 != e.statusCode && e.data.code && 500 == e.data.code) {
                var a = e.data.data.message;
                wx.showModal({
                    title: "系统错误",
                    content: a + ";\r\n请将错误内容复制发送给我们，以便进行问题追踪。",
                    cancelText: "关闭",
                    confirmText: "复制",
                    success: function(a) {
                        a.confirm && wx.setClipboardData({
                            data: JSON.stringify({
                                data: e.data.data,
                                object: t
                            })
                        });
                    }
                });
            }
            t.complete && t.complete(e);
        }
    });
};