
const app = getApp(),api = require("../../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
	bookvalue:0,
    tbodylist: [
       ['100', '2万', '32', '200/500', '否', '1.5/1.8'], 
       ['175', '5万', '32', '200/500', '否', '2.5/3'],
      //  ['250', '8万', '32', '200/500', '否', '2.2/2.8'], 
       ['300', '10万', '32', '200/500', '否', '8/10'], 
       ['300', '10万', '32', '2000', '是', '18'], 
      ['60', '5K(画册)', '16','50/100','否','1.5/2']],
    booknum: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	let self = this;
	wx.getSystemInfo({
		success(res){
			console.log(res.model);
			self.setData({
				model:res.model=='iPhone X'?'iphonex':''
			})
		}
	});
  console.log(options)
	app.request({
	    url: api.product+'/'+options.id,
	    method: "GET",
	    data:{},
	    success: function(e) {
			if(-1 == e.code||e.code==401){self.setData({login:(new Date()).getTime()}); return};
	        if (1 == e.code) {
            let booknum = e.data;
            booknum.map((item, index) => {
              item.s = false;
            });
	         self.setData({
             product_id: options.id,
             reporter_id: options.reporter_id,
             booknum: booknum
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
  valin(e){
	this.setData({
	  bookvalue:Number(e.detail.value)
	});  
  },
  cut(){
	let self = this;
	self.setData({
		bookvalue:self.data.bookvalue==0?self.data.bookvalue:self.data.bookvalue-1
	});
  },
  add(){
	let self = this; 
	self.setData({
		bookvalue:self.data.bookvalue+1
	});
  },
  select(e){
	  let self = this;
	  let booknum = self.data.booknum;
	  booknum.map((item,index)=>{
		 item.s=false;
		 e.currentTarget.dataset.index==index?(item.s=true):'';
	  });
	  self.setData({
		booknum:booknum
	  });
  },
  saveFormId(e){
  	  app.saveFormId(e.detail.formId);
  	  
  },
  soonBook(e){
	  let self = this;
	  let booknum = self.data.booknum;
	  let spec='';
	  let duration=self.data.bookvalue;
    
	  booknum.map((item,index)=>{
      item.s ? spec = item.spec_id:'';
	  });
	  (!duration&&!spec)?wx.showModal({
		  title:'提示',
		  content:'请选择规格或时长',
		  showCancel:!1
	  }):'';
    if (!duration && !spec) return;
    wx.navigateTo({
      url: '/pages/reporter/outbook/outbook?spec_id=' + spec + '&duration=' + duration + '&product_id=' + self.data.product_id + '&reporter_id=' + self.data.reporter_id
	  });
	  
  }
})