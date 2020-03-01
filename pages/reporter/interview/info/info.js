const app = getApp(),api = require("../../../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	   let self = this;
		app.request({
		    url: api.order+'/6',//+options.id,
		    method: "GET",
		    data: {},
		    success: function(e) {
				console.log(e);
				if(-1 == e.code||e.code==401){self.setData({login:(new Date()).getTime()}); return};
		        if (1 == e.code) {
		          console.log(e);
				  self.setData({
					  info:e.data
				  })
		        } else wx.showModal({
		            title: "提示",
		            content: e.msg,
		            showCancel: !1
		        });
		    },
		    complete: function() {
		        // wx.hideLoading();
		    }
		});
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  call(e){
	  wx.makePhoneCall({
	    phoneNumber: e.currentTarget.dataset.num
	  })
  }
})