const app = getApp(),api = require("../../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
	params:{
		page:1,
		page_size:10
	}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	let self = this;
	wx.getSystemInfo({
		success(res){
			self.setData({
				model:res.model=='iPhone X'?'iphonex':'',
				user_info:wx.getStorageSync('user_info')
			})
		}
	});
	app.request({
	    url: api.orders,
	    method: "GET",
	    data: self.data.params,
	    success: function(e) {
			console.log(e);
			if(-1 == e.code||e.code==401){self.setData({login:(new Date()).getTime()}); return};
	        if (1 == e.code) {
	          self.setData({
				  list:e.data,
				  allpage:e.total
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
  loadData(){
	  let self = this;
	  let allpage=self.data.allpage;
	  let params=self.data.params;
	  let list = self.data.list;
	  if(allpage>params.page){
		  params.page++;
		  app.request({
		      url: api.orders,
		      method: "GET",
		      data: self.data.params,
		      success: function(e) {
		  		console.log(e);
		  		if(-1 == e.code||e.code==401){self.setData({login:(new Date()).getTime()}); return};
		          if (1 == e.code) {
		            self.setData({
		  			    list:[...list,...e.data],
                params:params,
                  allpage:e.total
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
	  }
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
	let self = this;
	self.loadData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  interview(e){
	  wx.navigateTo({
		  url:'/pages/reporter/interview/info/info?id='+e.currentTarget.dataset.item.id
	  })
  }
})