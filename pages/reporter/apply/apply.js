const app = getApp(),api = require("../../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
	msgshow:false,
	status:null,
	checked:false,
    applyname:'',
    applymobile:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	this.getstatus()
  },
  getstatus(){
	  let self = this;
	  app.request({
	      url: api.apply_state,
	      method: "GET",
	      data: {},
	      success: function(e) {
	  		console.log(e);
	  		if(-1 == e.code||e.code==401){self.setData({login:(new Date()).getTime()}); return};
	          if (1 == e.code) {
	  		  self.setData({
	  			  status:e.data?e.data.status:null
	  		  });
	            // console.log(e.data);
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
  saveFormId(e){
  	  app.saveFormId(e.detail.formId);
  	  
  },
  navto(){
	wx.navigateTo({
		url:'/pages/reporter/agreement/index?type=1'
	})  
  },
  submit(e){
	  let self = this;
    if (!self.data.checked){wx.showModal({
      title: '提示',
      content: '请先阅读协议并确定',
      showCancel:!1
    });return;}
	  app.request({
	      url: api.apply,
	      method: "POST",
	      data: {
			  works:self.data.works,
          contact: self.data.applyname + self.data.applymobile
		  },
	      success: function(e) {
	  		console.log(e);
	  		if(-1 == e.code||e.code==401){self.setData({login:(new Date()).getTime()}); return};
	          if (1 == e.code) {
	  		    self.setData({
	  		    	msgshow:true
	  		    });
            setTimeout(()=>{
              self.getstatus();
            },2000);
	            // console.log(e.data);
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
  doknow(e){
	  this.setData({
		  msgshow:false,
		  status:2
	  });
    wx.switchTab({
      url: '/pages/bookshelf/index',
    })
  },
  resubmit(){
	  this.setData({
		  status:null
	  })
  },
  works_txt(e){
    console.log(e.detail.value)
	  this.setData({
		  works:e.detail.value
	  })
  },
  putmobile(e){
    console.log(e.detail.value)
	  this.setData({
	  	  applyname:e.detail.value
	  })
  },
  putmobile2(e){
    this.setData({
      applymobile: e.detail.value
    })
  },
  checked(e){
	  this.setData({
		  checked:!this.data.checked
	  });
  }
})