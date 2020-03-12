const app = getApp(),api = require("../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoshow:false,
    videoitem:{},
	comment_content:'',
	model:'',
	commentshow:false,
	login:'',
	params:{
	  page:1,
	  page_size:3
	},
	list:[],
	allpage:1,
    action:{
      method: 'setCurrentTime',
      data: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	let self =this;
	wx.getSystemInfo({
		success(res){
			// console.log(res.model);
			self.setData({
				model:res.model=='iPhone X'?'iphonex':''
			})
		}
	});
	app.request({
	    url: api.tells,
	    method: "GET",
	    data: self.data.params,
	    success: function(e) {
			// console.log(e);
			if(-1 == e.code||e.code==401){self.setData({login:(new Date()).getTime()}); return};
	        if (1 == e.code) {
			  let list = e.data;
			  // list.map((item,index)=>{
			  //   item.audio=JSON.parse(item.audio);
					// item.timestr=0;
					// item.audio.map((item_,index_)=>{
					// 	item.timestr=item.timestr+item_.time;
					// });
			  // });
        
            list.map((item,index)=>{item.isplay=false})
	          self.setData({
				  list:list,
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
	let self = this;
	app.request({
	    url: api.tells,
	    method: "GET",
	    data: {
			page:1,
			page_size:10
		},
	    success: function(e) {
			// console.log(e);
			if(-1 == e.code||e.code==401){self.setData({login:(new Date()).getTime()}); return};
	        if (1 == e.code) {
	          let list = e.data;
	   //        list.map((item,index)=>{
	   //          item.audio=JSON.parse(item.audio);
				// item.timestr=0;
				// item.audio.map((item_,index_)=>{
				// 	item.timestr=item.timestr+item_.time;
				// });
	   //        });
            list.map((item, index) => { item.isplay = false })
	          self.setData({
			    list:list,
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
  navto(e){
    console.log(e)
    if (!wx.getStorageSync('access_token')) {
      this.selectItem({ currentTarget: { dataset: { index: 0, item: {} } } })
      return;
    }
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.audioCtx && this.audioCtx.pause();
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
	 let list = self.data.list;
	 let allpage =self.data.allpage;
	 let params= self.data.params;
	 if(params.page<allpage){
		params.page++;
		self.setData({
			params:params
		})
		self.loadData(); 
	 }
  },
  loadData(){
	 let self = this;
	 wx.showLoading({title:'正在加载...'});
 	 app.request({
 	     url: api.tells,
 	     method: "GET",
 	     data: self.data.params,
 	     success: function(e) {
 	 		// console.log(e);
 	 		if(-1 == e.code||e.code==401){self.setData({login:(new Date()).getTime()}); return};
 	         if (1 == e.code) {
			   let list = e.data;
			 //   list.map((item,index)=>{
			 //        item.audio=JSON.parse(item.audio);
			 //    	item.timestr=0;
				// 	console.log(item.audio);
			 //    	item.audio.map((item_,index_)=>{
				// 	item.timestr=item.timestr+item_.time;
				// });
			 //   });
               list.map((item, index) => { item.isplay = false })
 	           self.setData({
 	 			  list:self.data.list.concat(list),
 	 			  allpage:e.total
 	 		  });
			  
               setTimeout(() => { wx.hideLoading();},1000)
 	         } else wx.showModal({
 	             title: "提示",
 	             content: e.msg,
 	             showCancel: !1
 	         });
 	     },
 	     complete: function() {
			 setTimeout(function() {wx.hideLoading()}, 2000);
 	         // wx.hideLoading();
 	     }
 	 });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
	let self = this;
	let item =e.target.dataset.item;
	let index =e.target.dataset.index;
	let list = self.data.list;
	item.sharetype=2;//分享
	app.shareSend(item,()=>{
		list[index].share_num++;
		self.setData({
			list:list
		});
	});
	return{
		title:item.title,
		path: "/pages/index/index?id=" + item.id,
		imageUrl:item.image
	}
	
  },
  
  videoplay(e){
    let self = this;
    let item =e.target.dataset.item;
    let index =e.target.dataset.index;
    let list = self.data.list;
    let videoshow = self.data.videoshow;
    list.map((item,i)=>{
      (i == index) && (item.isplay=!item.isplay);
      (i!=index)&&(item.isplay=false);
    });
    self.setData({
      list: list,
      videoitem:item,
      videoshow: !videoshow
    });
    self.setData({
      action: {
        method: 'setCurrentTime',
        data: 0
      }
    });
    console.log(item)
    self.data.videoshow&&wx.hideTabBar({});
    !self.data.videoshow && wx.showTabBar({});
    // self.audioCtx = wx.createAudioContext('myAudio');
    self.data.videoshow&&self.audioCtx.play();
    !self.data.videoshow&&self.audioCtx.pause();

    // self.videoContext = wx.createVideoContext('video'+index)//视频管理组件
    // self.audioCtx = wx.createAudioContext('video' + index);
    // self.audioCtx.setSrc(item.audio);
    // list[index].isplay&&self.audioCtx.play();

  },
  audioPlay: function () {
    this.audioCtx.play()
  },
  audioPause: function () {
    this.audioCtx.pause()
  },
  bindplay(e){
	  let self = this;
	  let item =e.target.dataset.item;
	  let index =e.target.dataset.index;
	  let list = self.data.list;
	  console.log(item);
	  item.sharetype=1;//播放
	  app.shareSend(item,()=>{
	  	list[index].share_num++;
	  	self.setData({
	  		list:list
	  	});
	  });
  },
  speakin(){
    if (!wx.getStorageSync('access_token')) {
      this.selectItem({ currentTarget: { dataset: { index: 0, item: {} } } })
      return;
    }
    wx.navigateTo({
      url: '/pages/index/speak/speak',
    })
  },
  warnin(e){
    if (!wx.getStorageSync('access_token')){
      this.selectItem({currentTarget:{dataset:{index:0,item:{}}}})
      return;
    }
    wx.showActionSheet({
      itemList: ['举报'],
      success(res) {
        wx.navigateTo({
          url: '/pages/index/against/against?tell_id='+e.currentTarget.dataset.item.id,
        });
        
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  saveFormId(e){
	  app.saveFormId(e.detail.formId);
	  
  },
  closeComment(e){
	  this.setData({
		  commentshow:false
	  })
  },
  openComment(target){
	  let self = this;
	  let item = target.currentTarget.dataset.item;
	  self.setData({
	  	 commentshow:true,
		 curcomment:item,
		 curcommentIndex:target.currentTarget.dataset.index,
		 commentsParams:{
			 tell_id : item.id,
			 page:1,
			 page_size:10
		 }
	  });
	  app.request({
	      url: api.comments,
	      method: "GET",
	      data: self.data.commentsParams,
	      success: function(e) {
	  		if(-1 == e.code||e.code==401){self.setData({login:(new Date()).getTime()}); return};
	          if (1 == e.code) {
	              self.setData({
					  commentsList:e.data,
					  commentAllpage:e.total
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
  returns(){return;},
  logincomplete(e){
	  wx.reLaunch({
		  url:'/pages/index/index'
	  });
  },
  selectItem(e){
	  let self = this;
	  let list = self.data.list;
	  let index = e.currentTarget.dataset.index;
	  let item = e.currentTarget.dataset.item;
	  app.request({
	      url: api.collect,
	      method: "POST",
	      data: {
			  target_id:item.id,
			  status:item.is_collect?0:1
		  },
	      success: function(e) {
	  		console.log(e);
	  		if(-1 == e.code||e.code==401){self.setData({login:(new Date()).getTime()}); return};
	          if (1 == e.code) {
				list[index].is_collect=!list[index].is_collect;
				!item.is_collect?list[index].collect_num++:list[index].collect_num--;
	            self.setData({
	  			  list:list
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
  loadComment(e){
	  let self = this;
	  let commentAllpage = self.data.commentAllpage;
	  let commentsList = self.data.commentsList;
	  let commentsParams = self.data.commentsParams;
	  if(commentAllpage > commentsParams.page){
		  commentsParams.page++;
		  self.setData({
			commentsParams:commentsParams
		  });
		  wx.showLoading();
		  app.request({
		      url: api.comments,
		      method: "GET",
		      data: self.data.commentsParams,
		      success: function(e) {
		  		if(-1 == e.code||e.code==401){self.setData({login:(new Date()).getTime()}); return};
		          if (1 == e.code) {
		              self.setData({
						  commentsList:[...commentsList,...e.data],
						  commentAllpage:e.total
					  });
					  wx.hideLoading()
		          } else wx.showModal({
		              title: "提示",
		              content: e.msg,
		              showCancel: !1
		          });
		      },
		      complete: function() {
		         setTimeout(function() {wx.hideLoading()}, 2000);
		      }
		  });
	  }
	  
  },
  comment(){
	  let self = this;
	  let comment_content= self.data.comment_content;
	  let curcomment =self.data.curcomment;
	  comment_content?"":wx.showToast({title:'请先输入',icon:'none'});
	  let commentsList = self.data.commentsList;
	  let curcommentIndex= self.data.curcommentIndex;
	  let user_info = wx.getStorageSync('user_info');
	  comment_content&&wx.showLoading({title:'正在提交...'});
	  comment_content&&app.request({
	      url: !curcomment.back?api.comment:api.reply,
	      method: "POST",
	      data:curcomment.back?{
			   id:self.data.curcomment.item.id,
			   content:self.data.comment_content
		  }:{
			  tell_id:self.data.curcomment.id,
			  content:self.data.comment_content
		  },
	      success: function(e) {
	  		if(-1 == e.code||e.code==401){self.setData({login:(new Date()).getTime()});wx.hideLoading(); return};
	          if (1 == e.code) {
	             wx.hideLoading();
				 !curcomment.back?commentsList.unshift({
					 children: [],
					 content: self.data.comment_content,
					 id: '',
					 parent_id: 0,
					 path: null,
					 user: {
						 avatar: user_info.avatar,
						 id: user_info.id,
						 nickname: user_info.nickname
					 },
					 user_id: user_info.id
				 }):commentsList[curcomment.index].children.push({
					 children: [],
					 content: self.data.comment_content,
					 id: '',
					 parent_id: 0,
					 path: null,
					 user: {
						 avatar: user_info.avatar,
						 id: user_info.id,
						 nickname: user_info.nickname
					 },
					 user_id: user_info.id
				 });
				 curcomment.back=false;
				 let list=self.data.list;
				 list[curcommentIndex].comment_num++;
				 curcomment.user = commentsList[curcommentIndex].user;
				 self.setData({
					 comment_content:'',
					 commentsList:commentsList,
					 list:list
				 });
	          } else wx.showModal({
	              title: "提示",
	              content: e.msg,
	              showCancel: !1
	          });
	      },
	      complete: function() {
	          setTimeout(()=>{
				  wx.hideLoading() 
			  },2000);
	      }
	  });
  },
  commentcontent(e){
	  // console.log(e);
	  this.setData({
		  comment_content:e.detail.value
	  })
  },
  backcomment(e){
	  let self = this;
	  let item = e.currentTarget.dataset.item;
	  let index = e.currentTarget.dataset.index;
	  let curcomment = self.data.curcomment;
	  curcomment.user = item.user;
	  curcomment.item = item;
	  curcomment.index=index;
	  curcomment.back = true;
	  console.log(item,index)
	  item.id&&self.setData({
		  curcomment:curcomment
	  })
  },
  fixbug(){wx.redirectTo({url:"/pages/my/index"})}
})