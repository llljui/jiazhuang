const app = getApp(),api = require("../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
	login:'',
	bookList:[1,1,1,1,1],
	params:{
		page:1,
		page_size:10
	}
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
	self.loadData()
  },
  logincomplete(e){
  	  wx.reLaunch({
  		  url:'/pages/bookshelf/index'
  	  });
  },
  loadData(cb){
	  let self = this;
	  app.request({
	      url: api.books,
	      method: "GET",
	      data: self.data.params,
	      success: function(e) {
	  		if(-1 == e.code||e.code==401){self.setData({login:(new Date()).getTime()}); return};
	          if (1 == e.code) {
	            self.setData({
	  			  list:e.data,
	  			  allpage:e.total,
				  listLength:Math.ceil(e.data.length/3) 
	  		  });
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
	let self = this;
	let allpage =self.data.allpage;
	let params = self.data.params;
	let list = self.data.list;
	if(allpage>params.page){
		params.page++;
		app.request({
		    url: api.books,
		    method: "GET",
		    data: params,
		    success: function(e) {
				if(-1 == e.code||e.code==401){self.setData({login:(new Date()).getTime()}); return};
		        if (1 == e.code) {
		          self.setData({
					  list:[...list,...e.data],
					  params:params,
					  allpage:e.total,
					  listLength:Math.ceil([...list,...e.data].length/3) 
				  });
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  applyoutbook() {
    let self = this;
    app.request({
      url: api.reporter_match,
      method: "GET",
      data: {},
      success: function (e) {
        if (-1 == e.code || e.code == 401) { self.setData({ login: (new Date()).getTime() }); return };
        if (1 == e.code) {
          wx.navigateTo({
            url: '/pages/reporter/readme/readme?id=' + e.data.product_id,
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
  }
})