// pages/bookshelf/detail/detail.js
// var WxParse = require('../../../utils/wxParse/wxParse.js');
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
	let self =this;
  console.log(options)
	wx.getSystemInfo({
	  	success(res){
	  		console.log(res.model);
	  		self.setData({
	  			model:res.model=='iPhone X'?'iphonex':''
	  		})
	  	}
	});
	self.setData({
		book:options.book,
		img:options.img,
    name:options.name
	});
	self.loadbook(options);
	// var article = '<div>我是HTML代码</div>';
	/**
	* WxParse.wxParse(bindName , type, data, target,imagePadding)
	* 1.bindName绑定的数据名(必填)
	* 2.type可以为html或者md(必填)
	* 3.data为传入的具体数据(必填)
	* 4.target为Page对象,一般为this(必填)
	* 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
	*/
	// WxParse.wxParse('article', 'html', article, self, 5);
	
  },
  loadbooks(){
	  wx.openDocument({
	    filePath: this.data.file,
	    success: function (res) {
	      console.log('打开文档成功');
	    }
	  })
  },
  loadbook(options){
	let self =this;
	wx.showLoading({title:'正在打开0%'});
	const downloadTask = wx.downloadFile({
	  // 示例 url，并非真实存在
	  url:self.data.book+'?time='+(new Date()).getTime(),
	  success: function (res) {
	    const filePath = res.tempFilePath
	    wx.openDocument({
	      filePath: filePath,
	      success: function (res) {
	        console.log('打开文档成功');
			self.setData({
				file:filePath
			});
			wx.hideLoading()
	      }
	    })
	  }
	});
 
	downloadTask.onProgressUpdate((res)=>{
		wx.showLoading({
			title:'正在打开'+res.progress+'%'
		})
	})
  },
  navback() {
    wx.navigateBack({
      success(res){
        console.log(res)
      },
      fail(err){
        console.log(err)
        wx.switchTab({
          url: '/pages/bookshelf/index',
        })
      }
    })
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
    return {
      title: this.data.name,
      path: '/pages/bookshelf/detail/detail?book=' + this.data.book + '&img=' + this.data.img + '&name='+this.data.name,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '转发成功!',
          icon:'none'
        });
        console.log(res)
      },
      fail: function (res) {
        // 转发失败
      },
      complate(res){
        console.log(res)
      }
    }
  }
})