const app = getApp(), api = require("../../../utils/api.js");;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    errshow:false,
    msgshow:false,
    form:{
      phone:'',
      name:'',
      address:''
    },
    guige:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  let self = this;
    console.log(options)
    self.setData({
      guige: options
    });
    console.log(options)
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
  nextStep(){
    let self = this;
    app.request({
      url: api.order,
      method: "POST",
      data: Object.assign({}, self.data.form, self.data.guige), 
      // {
      //   spec: '',//规格
      //   duration: '',//视频记录时长
      //   product_id: '',//商品id
      //   // total_fee: '',//总额，等于视频记录单价乘以时长（此参数去掉了）
      //   name: '',//姓名
      //   phone: '',//手机号
      //   address: ''//详细地址
      // },
      success: function (e) {
        console.log(e)
        if (-1 == e.code || e.code == 401) { self.setData({ login: (new Date()).getTime() }); return };
        if (1 == e.code) {
          wx.requestPayment({
            "timeStamp": e.data.timeStamp.toString(),
            "nonceStr": e.data.nonceStr.toString(),
            "package": e.data.package.toString(),
            "signType": "MD5",
            "paySign": e.data.paySign.toString(),
            "success": function (res) {
              self.setData({
                msgshow: true
              });
            },
            "fail": function (res) {
              console.log(res)
            }
          });
        } else wx.showModal({
          title: "提示",
          content: e.msg,
          showCancel: !1
        });
      },
      complete: function () {
        // this.setData({
        //   errshow: true
        // });
        // setTimeout(() => {
        //   this.setData({
        //     errshow: false
        //   });
        // }, 1500)
        // wx.hideLoading();
      }
    });
	  
  },
  doknow(e){
  	  this.setData({
  		  msgshow:false
  	  });
      wx.switchTab({
        url: '/pages/my/index?tab=3',
      });
  },
  formin(e){
    let self = this;
    let form = self.data.form;
    (e.currentTarget.dataset.type == 'name') && (form.name = e.detail.value);
    (e.currentTarget.dataset.type == 'phone') && (form.phone = e.detail.value);
    (e.currentTarget.dataset.type == 'address') && (form.address = e.detail.value);
    self.setData({ form : form});
  },
  navto(){
    wx.navigateTo({
      url: '/pages/reporter/agreement/index?type=2',
    })
  }
})