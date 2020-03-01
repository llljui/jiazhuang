// pages/index/against/against.js
const app = getApp(),api = require("../../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
	reason_id:'',
	model:'',
	message:'',
    items: [
      { name: 'USA', value: '违法违禁' },
      { name: 'CHN', value: '色情低俗', checked: 'true' },
      { name: 'BRA', value: '血腥暴力' },
      { name: 'JPN', value: '人身攻击' },
      { name: 'ENG', value: '侵犯版权' },
      { name: 'TUR', value: '其他问题' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	let self =this;
	wx.getSystemInfo({
		success(res){
			console.log(res.model);
			self.setData({
				model:res.model=='iPhone X'?'iphonex':''
			})
		}
	});
	self.setData({
		tell_id:options.tell_id
	})
	app.request({
	    url: api.reasons,
	    method: "GET",
	    data: {},
	    success: function(e) {
			console.log(e);
			if(-1 == e.code||e.code==401){self.setData({login:(new Date()).getTime()}); return};
	        if (1 == e.code) {
	          self.setData({
				  items:e.data
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
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  submit(){
	 let self = this;
	 app.request({
	     url: api.report,
	     method: "POST",
	     data: {
			 reason_id:self.data.reason_id,
			 tell_id:self.data.tell_id,
			 explain:self.data.explain
		 },
	     success: function(e) {
	 		console.log(e);
	 		if(-1 == e.code||e.code==401){self.setData({login:(new Date()).getTime()}); return};
	         if (1 == e.code) {
			  self.setData({
			  		 message:'信息已提交'+'---'+(new Date).getTime()
			  });
			  setTimeout(()=>{
				  wx.navigateBack()
			  },2000)
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
  radioChange(e){
	  let self = this;
	  self.setData({
		 reason_id:e.detail.value 
	  });
  },
  bindTextAreaBlur(e){
	  this.setData({
		  explain:e.detail.value
	  })
  }
})