//app.js
var request = require("./utils/request.js"), api = require("./utils/api.js");
App({
  onLaunch: function () {
    // 登录
    !wx.getStorageSync('opentime')&&wx.clearStorage({
      success(){
        wx.setStorageSync('opentime', (new Date()).getTime())
      }
    });
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onShow(){
    console.log('show', ((new Date()).getTime() - wx.getStorageSync('opentime')))//
    if (((new Date()).getTime() - wx.getStorageSync('opentime')) >= 86400000){//时间一天过期
      wx.clearStorage({
        success(){
          wx.setStorageSync('opentime', (new Date()).getTime())
          console.log('success')
        }
      });
    }
  },
  globalData: {
    userInfo: null
  },
  saveFormId(e){
	  console.log('保存formId')
  },
  request: request,
  api: api,
  shareSend(item,cb){
	  let self = this;
	  let url =api.increase+"/"+item.id;
	  request({
		  url: url,
		  method: "PUT",
		  data: {
			type:item.sharetype
		  },
		  success: function(e) {
		      if (1 == e.code) {
		  		cb();
		      } else wx.showModal({
		          title: "提示",
		          content: e.msg,
		          showCancel: !1
		      });
		  },
		  complete: function() {
		      // wx.hideLoading();
		  }
	  })
  }
})