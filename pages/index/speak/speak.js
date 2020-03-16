const app = getApp(),api = require("../../../utils/api.js");
// const addpic = require('');
Page({

  /**
   * 页面的初始数据
   */
  data: {
 
  curaudio:'',//试听
	src:'',
	width:375,//宽度
	height: 173,//高度
	islisten:false,
	title:'',//标题
	itembg:'',//背景
	num:0,
	status:1,
	record_list:[],//录音
	timeover:300000,
	recordtime:0,
	time_m:5,
	time_s:0,
	closeSpeak:false,
	lastrecord:[],//{file:'http://mpge.5nd.com/2014/2014-12-29/65396/1.mp3' ,time:0}
	audiosrc:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
	 //获取到image-cropper对象
	  let rpx=1; 
    wx.getSystemInfo({
      success(res){
        // console.log(res);
        const ctx = wx.createCanvasContext('itembgs');
        rpx = res.windowWidth/375;
        self.setData({rpx:rpx,dWidth:res.windowWidth});
        self.getImgurl('https://culture-1300191527.cos.ap-shanghai.myqcloud.com/miniProgram/34311d4f3d1c2faa1f09d715ce9a1d31.png',(res_)=>{
        console.log(res_);
        ctx.drawImage(res_.path, 0, 0, 375*rpx, 194*rpx);
        ctx.draw();
        });
        self.setData({
          width:res.screenWidth,
          height:res.screenHeight,
          model:res.model=='iPhone X'?'iphonex':''
        });
        
      }
    })
    let recorderManager = wx.getRecorderManager();
      recorderManager.onError((res) => {
        console.log(res)
      })
    recorderManager.onStop((res) => {
      let tempFilePath = res.tempFilePath;// 文件临时路径
      // let temp = tempFilePath.replace('.mp3', '');
      self.uploadAudio(tempFilePath,(reb)=>{
        self.setData({
          record_list:self.data.record_list.concat({file:reb.data[0],time:self.data.recordtime}),
          status:1
        });
      });
      clearInterval(self.data.timeGo);
      console.log(res)
    });
    recorderManager.onError((err)=>{
      console.log(err);
    });
	
   

  },
  getImgurl(preview,cb){
  	   wx.getImageInfo({
  			 src: preview ,
  			 success: function (res) {
  			 cb(res);
  	     }
  	   }) 
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.audioCtx = wx.createAudioContext('myAudio');
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
    clearInterval(this.data.timeGo);
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
  uploadimg(e){
	  let self = this;
	  const ctx = wx.createCanvasContext('itembgs');
    const ctx_o = wx.createCanvasContext('itembgs_o');
  
	  let rpx = self.data.rpx;
	  wx.chooseImage({
		  count:1,
		  success(res){
			  let tempFilePaths= res.tempFiles[0].path;
			  self.getImgurl(tempFilePaths,(res_)=>{
				 console.log(res_);
          let w = ((res_.width) * (194 * rpx) / (res_.height))
				//  ctx.drawImage(tempFilePaths,  (res_.width>750*rpx)?((res_.width - 750*rpx)/2):0  ,  ((res_.height>388*rpx))?((res_.height - 388*rpx)/2):0  ,  res_.width<750*rpx?res_.width:750*rpx  ,  ((res_.height>388*rpx))?(388*rpx):res_.height  ,   0, 0,375*rpx,194*rpx);
         ctx.drawImage(tempFilePaths, (w < 375 * rpx) ? ((375 * rpx - w) / 2) : 0 , 0, w, 194 * rpx);
        //  ctx_o.drawImage(tempFilePaths, 0, 0, res_.width, res_.height);
         ctx.draw(false,function(){
					 wx.canvasToTempFilePath({
                canvasId: 'itembgs',
					 					   // fileType:'jpg',
					      success: function (resto) {
                  // console.log(tempFilePaths);
                  wx.getFileSystemManager().readFile({
                    filePath: tempFilePaths, //选择图片返回的相对路径
                    encoding: "base64",//这个是很重要的
                    success: resss => { //成功的回调
                      //返回base64格式
                      // console.log('data:image/png;base64,' + resss.data);
                      wx.uploadFile({
                        url: api.upload,
                        filePath: tempFilePaths,
                        name: 'file',
                        header: {
                          Authorization: 'Bearer ' + wx.getStorageSync('access_token')
                        },
                        success(reb) {
                          console.log(JSON.parse(reb.data));
                          self.setData({
                            itembg: JSON.parse(reb.data).data[0]
                          })
                        }
                      })
                    }
                  })
					        
					       }
					     })
				 }); 
				 console.log(res_.width,750*rpx,res_.height,346*rpx);
				 console.log((res_.width>750*rpx)?((res_.width - 750*rpx)/2):0);
				 console.log(((res_.height>346*rpx)&&res_.height>750*rpx)?((res_.height - 346*rpx)/2):((750*rpx-346*rpx)/2));
				 console.log(res_.width<750*rpx?res_.width:750*rpx);
				 console.log(((res_.height>346*rpx)&&res_.height>750*rpx)?(346*rpx):750*rpx);
				 
				 
				
			  })
			 
			  
		  }
	  })
  },
  uploadAudio(tempFilePaths,cb){
	let self = this;
	console.log(tempFilePaths);
	wx.uploadFile({
	  url:api.upload,
	  filePath: tempFilePaths,
	  name: 'file',
	  header:{
		  Authorization:'Bearer '+wx.getStorageSync('access_token')
	  },
	  success(reb){
		  cb(JSON.parse(reb.data));
	  }
	})  
  },
  record(e){
	  let self = this;
	  let recorderManager = wx.getRecorderManager();
	  let timeover = self.data.timeover;
	  let recordtime = 0;
    self.audioCtx.pause();
    self.setData({
      islisten: false
    });
	  timeover<=0&&wx.showModal({
		  title:'提示',
		  content:'最多录制5分钟哦~'
	  });
	  if(timeover <= 0) return;
	  const options = {
	    duration:300000,
	    sampleRate: 16000,
	    numberOfChannels: 1,
	    encodeBitRate: 96000,
	    format: 'mp3'
	    // frameSize: 50
	  }
	  recorderManager.start(options);
	  self.setData({
		  status:2,
		  recorderManager:recorderManager,
		  timeGo:setInterval(()=>{
			  timeover = timeover - 1000;
			  recordtime = recordtime +	1000
			  self.setData({
				  time_m:Math.floor(timeover/60000),
				  time_s:(timeover%60000)/1000,
				  timeover:timeover,
				  recordtime:recordtime
			  });
        if (timeover<=0){
          self.recordStop();
          clearInterval(self.data.timeGo)
        }
			  console.log(timeover)
		  },1000)
		  
	  });
  },
  recordStop(e){
	  let self = this;
	  let recorderManager =  self.data.recorderManager;
	  recorderManager.stop();
  },
  cancelrecord(){
	  let self = this;
	  let record_list = this.data.record_list;
	  wx.showModal({
		  title:'取消上一句录音吗?',
		  success(res){
			  let deltime = record_list[record_list.length-1].time;
			  res.confirm&&record_list.pop()&&self.setData({
				record_list:record_list,
				timeover:self.data.timeover + deltime,
				time_m:Math.floor((self.data.timeover + deltime)/60000),
				time_s:((self.data.timeover + deltime)%60000)/1000,
			  });
		  }
	  });
  },
  complete(cb){
	  let self = this;
	  let lasttime='',timenum=0;
    console.log(self.data.status)
	  self.data.record_list.map((item,index)=>{
		  console.log(item);
		  timenum=timenum+item.time;
	  });
	  console.log(timenum,+Math.floor(timenum/600000),(timenum%60000));
	  lasttime='0'+Math.floor(timenum/60000)+':'+((timenum%60000)>=10000?((timenum%60000)/1000):('0'+((timenum%60000)/1000)));
	  console.log(lasttime);
    self.setData({
      lasttime: lasttime,
      timeover: 300000,
      time_m: 5,
      time_s: 0,
      lastrecord: self.data.record_list,
      record_list: [],
      speakShow: false
    });
    cb();
	  // wx.showModal({
		//   title:'提示',
		//   content:'确定完成录音吗?',
		//   success(res){
		// 	  res.confirm&&self.setData({
		// 		lasttime:lasttime,
		// 		timeover:300000,
		// 		time_m:5,
		// 		time_s:0,
		// 		lastrecord:self.data.record_list,
		// 		record_list:[],
		// 		speakShow:false
		// 	  });
		//   }
	  // })
	  console.log(22)
  },
  closeSpeak(){
	  this.setData({
		  speakShow:false
	  });
  },
  openSpeak(){
	  this.setData({
	  	  speakShow:true
	  });
  },
  listenSpeak(){
	  let self = this;
    (self.data.status==2)&&self.recordStop();
    setTimeout(()=>{
      let islisten = self.data.record_list;
      // console.log(self.data.status)
      if (self.data.status == 2) { return }
      console.log(islisten);
      self.data.record_list.length == 0 && wx.showModal({
        title: '提示',
        content: '请先录音',
        showCancel: !1,
        success(res) {
          console.log(res);
          // res.confirm&&self.setData({
          //   speakShow:true
          // })
        }
      });
      if (self.data.record_list.length == 0) return;
      let InnerAudioContext = wx.createInnerAudioContext();
      let delay = 0;
      self.setData({
        islisten: true
      });
      self.data.record_list.map((item, index) => {
        if (index == 0) {
          self.setData({
            curaudio: item.file
          })
          console.log(delay, '播放着', item, index)
          self.audioCtx.play()
          // console.log()
        } else {
          setTimeout(() => {
            self.setData({
              curaudio: item.file
            })
            self.audioCtx.play()
            console.log(delay, '播放着', item, index)
          }, delay)
        }
        delay = Number(item.time) + delay;
      });
      setTimeout(() => {
        self.setData({
          islisten: false
        });
      }, delay)
    },200)
   
  },
  tells(){
	  let self = this;
	  wx.showLoading();
	  console.log(self.data.lastrecord);
    this.complete(()=>{
      app.request({
        url: api.tells,
        method: "POST",
        data: {
          title: self.data.title,
          image: self.data.itembg,
          audio: JSON.stringify(self.data.lastrecord)
        },
        success: function (e) {
          console.log(e);
          if (-1 == e.code || e.code == 401) { self.setData({ login: (new Date()).getTime() }); return };
          if (1 == e.code) {
            wx.hideLoading();
            wx.showModal({
              title: '提示',
              content: '已提交,后台会对语音进行处理,等待3分钟之后,刷新首页!',
              showCancel: !1,
              success(res) {
                wx.navigateBack();
              }
            })
          } else wx.showModal({
            title: "提示",
            content: e.msg,
            showCancel: !1
          });
        },
        complete: function () {
          setTimeout(() => {
            wx.hideLoading();
          }, 2000)
          // wx.hideLoading();
        }
      });
    });
	  
  },
  bindTextAreaBlur(e){
	  // console.log(e);
	  this.setData({
		  title:e.detail.value
	  })
  }
})