// pages/reporter/photo/photo.js
const app = getApp(),api = require("../../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
	params:{
		page:1,
		page_size:10
	},
	delids:[],
	actionShow:false,
	imglist:[{pic:'../../../static/add.png'},{pic:'../../../static/add.png'},{pic:'../../../static/add.png'},{pic:'../../../static/add.png'}]
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
    self.imglistshow();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  imglistshow(){
    let self =this;
    app.request({
      url: api.reporter_photos,
      method: "GET",
      data: self.data.params,
      success: function (e) {
        console.log(e);
        if (-1 == e.code || e.code == 401) { self.setData({ login: (new Date()).getTime() }); return };
        if (1 == e.code) {
          let imglist = e.data;
          imglist.map((item,index)=>{
            item.show=false;
          })
          self.setData({
            imglist: imglist,
            allpage: e.total
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
  deleteimg(id,index,cb){
	  let self = this;
	  let imglist = self.data.imglist;
	   app.request({
	       url: api.reporter_photos+"/"+id,
	       method: "DELETE",
	       data: {},
	       success: function(e) {
	   		// console.log(e);
	   		if(-1 == e.code||e.code==401){self.setData({login:(new Date()).getTime()}); return};
	           if (1 == e.code) {
				//  imglist.splice(index,1);
	      //        self.setData({
        //         imglist:imglist
        //        });
        self.imglistshow();
				cb();
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
  select(e){
	  let self = this;
	  let eitem=e.currentTarget.dataset.item;
	  let eindex=e.currentTarget.dataset.index;
	  let imglist=self.data.imglist;
	  let seletnum=0;
	  let delids=self.data.delids;
	  imglist.map((item,index)=>{
		 eindex==index?(item.show=!item.show):'',
		 item.show==true&&(item.seletnum=seletnum+1)&&seletnum++;
	  });
	  self.setData({
		 imglist:imglist,
		 seletnum:seletnum//总共删除的张数
	  })
	  console.log(seletnum);
  },
  saveFormId(e){
  	  app.saveFormId(e.detail.formId);
  	  
  },
  deleteshow(e){
	  let self = this;
	  if(self.data.seletnum==0)return;
	  self.setData({
		  actionShow:true
	  })
  },
  canceldel(){
	  let imglist=this.data.imglist;
	  imglist.map((item,index)=>{
		  item.show=false;
	  });
	  this.setData({
		  delids:[],
		  actionShow:false,
		  imglist:imglist,
		  seletnum:0
	  });
  },
  delimg(e){
	  let self = this;
	  let imglist=self.data.imglist;
    let idarr = imglist.map((item, index) => {return item.show?(item.id):''});
    function del(n) {
      n && self.deleteimg(n, n, (res) => {
        
      });
    }
    for (let x = 0; x < idarr.length;x++){
      del(idarr[x]);
      if (x == idarr.length - 1) {
        wx.showToast({
          title: '删除了'
        });
        self.canceldel();
        return;
      }
    }
  },
  selectimg(e){
    let self = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        console.log(res)
        tempFilePaths.map((item,index)=>{
          wx.showLoading({
            title: '上传中...',
          });
          wx.uploadFile({
            url: api.upload,
            filePath: item,
            name: 'file',
            header: {
              Authorization: 'Bearer ' + wx.getStorageSync('access_token')
            },
            success(reb) {
              // console.log(reb.data)
              app.request({
                url: api.reporter_photos,
                method: "post",
                data: {
                  src: JSON.parse(reb.data).data[0]
                },
                success: function (e) {
                  console.log(e);
                  if (-1 == e.code || e.code == 401) { self.setData({ login: (new Date()).getTime() }); return };
                  if (1 == e.code) {
                    self.imglistshow();
                    wx.hideLoading();
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
              // console.log(JSON.parse(reb.data));
              // self.setData({
              //   itembg: JSON.parse(reb.data).data[0]
              // })
            }
          })
          
        })
      }
    })
  }
})