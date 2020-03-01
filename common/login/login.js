const app=getApp(),api = require("../../utils/api.js") ;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
	login:{
		type:String,
		value:'',
		observer:function(newval, oldval, changedPath){
      wx.hideTabBar({});
			newval&&this.setData({
				islogin:false
			});
		}
	}
  },

  /**
   * 组件的初始数据
   */
  data: {
	 islogin:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
		getUserInfo: function(n) {
			let self = this;
		    "getUserInfo:ok" == n.detail.errMsg && (wx.showLoading({
		        title: "正在登录",
		        mask: !0
		    }), wx.login({
		        success: function(e) {
		            var t = e.code;
		            app.request({
		                url: api.login,
		                method: "POST",
		                data: {
		                    code: t,
		                    user_info: n.detail.rawData,
		                    encrypted_data: n.detail.encryptedData,
		                    iv: n.detail.iv,
		                    signature: n.detail.signature
		                },
		                success: function(e) {
							console.log(e);
		                    if (1 == e.code) {
		                        wx.setStorageSync("access_token", e.data.access_token), wx.setStorageSync("user_info", e.data.user),self.setData({
									islogin:true
								});
                wx.showTabBar({})
								self.triggerEvent('logincomplete', 'pageRelanch', (new Date).getTime())
		                    } else wx.showModal({
		                        title: "提示",
		                        content: e.msg,
		                        showCancel: !1
		                    });
		                },
		                complete: function() {
		                    wx.hideLoading();
		                }
		            });
		        },
		        fail: function(e) {}
		    }));
		}
	}
})
