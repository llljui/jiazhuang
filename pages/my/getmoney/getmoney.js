const app = getApp(), api = require("../../../utils/api.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
	maxnum:0,
	num:'',
	status:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	let self =this;
	wx.getSystemInfo({
		success(res){
			self.setData({
				model:res.model=='iPhone X'?'iphonex':''
			})
		}
	});
  self.setData({
    maxnum:Number(options.money)
  });
  
    console.log(Number(options.money))
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
  allget(e){
	  this.setData({
		 num:this.data.maxnum 
	  });
	  // console.log(e);
  },
  getout(e){
    let self = this;
    app.request({
      url: api.withdraw_return,
      method: "post",
      data: { money:self.data.num},
      success: function (e) {
        if (-1 == e.code || e.code == 401) {
          self.setData({ login: (new Date()).getTime() }); return
        };
        if (1 == e.code) {
          wx.showToast({
            title: '提取成功'
          });
          self.setData({
            status: 2
          });
        } else wx.showModal({
          title: "提示",
          content: e.msg,
          showCancel: !1
        });
      },
      complete: function () {
        // wx.hideLoading();
      }
    });//用户信息
	 
	  
  },
  numin(e){
	  this.setData({
		  num:e.detail.value
	  })
  }
})