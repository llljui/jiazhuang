const app = getApp(),api = require("../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
	params:{
		page:1,
		page_size:20
	},  
	login:'',
	list:[1,2,5,4,6,6,6,6,6],
  allpage:1
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
	self.loadData((res)=>{
    self.setData({
      list: res.data,
      allpage: res.total
    })
  });
  },
  loadData(cb){
	  let self = this;
	  app.request({
	      url: api.reporters,
	      method: "GET",
	      data: self.data.params,
	      success: function(e) {
	  		console.log(e);
	  		if(-1 == e.code||e.code==401){self.setData({login:(new Date()).getTime()}); return};
	          if (1 == e.code) {
	            cb(e);
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
   let self =this;
   let params = self.data.params;
    if (self.data.allpage >params.page){
      params.page++;
   }
   self.setData({
     params:params
   });
    self.loadData((res)=>{
      self.setData({
        list: [...self.data.list,...res.data],
        allpage: res.total
      })
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  logincomplete(e){
  	  wx.reLaunch({
  		  url:'/pages/reporter/index'
  	  });
  },
  applyoutbook(){
    let self = this;
    app.request({
      url: api.reporter_match,
      method: "GET",
      data: {},
      success: function (e) {
        if (-1 == e.code || e.code == 401) { self.setData({ login: (new Date()).getTime() }); return };
        if (1 == e.code) {
          wx.navigateTo({
            url: '/pages/reporter/readme/readme?id=' + e.data.product_id + '&reporter_id=' + e.data.reporter_id,
          })
        } else wx.showModal({
          title: "提示",
          content: e.msg,
          showCancel: !1
        });
      },
      complete: function () {
        // wx.hideLoading();
      }
    });
  },
  navto(e){
    if(!wx.getStorageSync('access_token')){
      this.applyoutbook();
      return;
    }
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
    // console.log(e.currentTarget.dataset.url)
  }
})