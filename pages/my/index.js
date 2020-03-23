const app = getApp(),api = require("../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    signature:'',//签名
    lang_area:'',//方言
    xueli:'',//学历
    infodesc:'',//个人简介
    videoshow: false,
    videoitem: {},
  rtab:0,
	commentshow:false,
	user_list:[],
	user_total:1,
	params_userlist:{
		page:1,
		page_size:20
	},//我的讲述的列表参数
	params_userbook:{
		page:1,
		page_size:20
	},//我的讲述的列表参数
	params_collects:{
		page:1,
		page_size:20
	},//我的讲述的列表参数
	tab:1,
	login:'',
	jangshu:1,
	haoting:1,
	zizhuang:1,
	isreporte:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	let self =this;
    if (options.tab&&(options.tab==3)){
      self.setData({tab:3})
    }
	wx.getSystemInfo({
		success(res){
			self.setData({
				model:res.model=='iPhone X'?'iphonex':''
			})
		}
	});
	app.request({
	    url: api.user,
	    method: "GET",
	    data: {},
	    success: function(e) {
			if(-1 == e.code||e.code==401){self.setData({login:(new Date()).getTime()}); return};
	        if (1 == e.code) {
            self.setData({
               reporter:e.data,
               lang_area: e.data.lang_area,
               xueli: e.data.education,
               infodesc: e.data.intro,
               signature: e.data.signature
            });
           
            // "nickname": "涸泽渔人",  // 昵称
            // "age": 20,              // 年龄
            // "gender": 1,            // 性别,0:未知,1:男,2:女
            // "city": "杭州",         // 城市
            // "symbol": 2             // 1:用户,2:普通记者,3:资深记者
  
            (e.data.symbol>1)&&app.request({
              url: api.reporter_info + '/' + e.data.id,
              method: "GET",
              data: {},
              success: function (e) {
                if (-1 == e.code || e.code == 401) { 
                  self.setData({ login: (new Date()).getTime() }); return
                };
                if (1 == e.code) {
                  self.setData({
                    reporter: e.data
                  });

                } else wx.showModal({
                  title: "提示",
                  content: e.msg,
                  showCancel: !1
                });
              },
              complete: function () {
                // wx.hideLoading();
              }
            });//记者信息

            if (!wx.getStorageSync('access_token')){
              self.setData({
                user_list: [],
                user_total: 1,
                user_book: [],
                user_booktotal: 1,
                user_collects: [],
                user_collectstotal: 1
              });
              return
            }
            self.loadUserlist((res) => {
              self.setData({
                user_list: res.data,
                user_total: res.total
              });
            });
            self.loadUserbook((res) => {
              self.setData({
                user_book: res.data,
                user_booktotal: res.total
              });
            });
            self.loadUserCollects((res) => {
              self.setData({
                user_collects: res.data,
                user_collectstotal: res.total
              });
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
	});//用户信息
	
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
    let self =this;
    app.request({
      url: api.user,
      method: "GET",
      data: {},
      success: function (e) {
        if (-1 == e.code || e.code == 401) { self.setData({ login: (new Date()).getTime() }); return };
        if (1 == e.code) {
          self.setData({
            reporter: e.data,
            lang_area: e.data.lang_area,
            xueli: e.data.education,
            infodesc: e.data.intro,
            signature: e.data.signature
          });
          
          // "nickname": "涸泽渔人",  // 昵称
          //   "age": 20,              // 年龄
          //     "gender": 1,            // 性别,0:未知,1:男,2:女
          //       "city": "杭州",         // 城市
          //         "symbol": 2             // 1:用户,2:普通记者,3:资深记者
          (e.data.symbol > 1) && app.request({
            url: api.reporter_info + '/' + e.data.id,
            method: "GET",
            data: {},
            success: function (e) {
              if (-1 == e.code || e.code == 401) {
                self.setData({ login: (new Date()).getTime() }); return
              };
              if (1 == e.code) {
                self.setData({
                  reporter: e.data,
                  lang_area: e.data.lang_area,
                  xueli: e.data.education,
                  infodesc: e.data.intro,
                  signature: e.data.signature
                });
              } else wx.showModal({
                title: "提示",
                content: e.msg,
                showCancel: !1
              });
            },
            complete: function () {
              // wx.hideLoading();
            }
          });//记者信息

        } else wx.showModal({
          title: "提示",
          content: e.msg,
          showCancel: !1
        });
      },
      complete: function () {
        // wx.hideLoading();
      }
    });//用户信息
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
    let tab = self.data.tab;
    let rtab = self.data.rtab;
    rtab>0&&wx.showLoading();
    switch (((self.data.reporter.symbol > 1))?Number(rtab):Number(tab)) {
      case 1:
        let params_userlist = self.data.params_userlist;
        let total = self.data.user_total;
        let user_list = self.data.user_list;
        if (params_userlist.page < total){
           params_userlist.page++;
           self.setData({
             params_userlist: params_userlist
           });
          self.loadUserlist((res) => {
            self.setData({
              user_list: [...user_list,...res.data],
              user_total: res.total
            });
          });
        }
        wx.hideLoading()
        break;
      case 2:
        let params_collects = self.data.params_collects;
        let total2 = self.data.user_collectstotal;
        let user_collects = self.data.user_collects;
        if (params_collects.page < total2) {
          params_collects.page++;
          self.setData({
            params_collects: params_collects
          });
          self.loadUserCollects((res) => {
            self.setData({
              user_collects: [...user_collects, ...res.data],
              user_collectstotal: res.total
            });
          });
        }
        wx.hideLoading()
        break;
      case 3:
        let params_userbook = self.data.params_userbook;
        let total3 = self.data.user_booktotal;
        let user_book = self.data.user_book;
        if (params_userbook.page < total3) {
          params_userbook.page++;
          self.setData({
            params_userbook: params_userbook
          });
          self.loadUserbook((res) => {
            self.setData({
              user_book: [...user_book, ...res.data],
              user_booktotal: res.total
            });
          });
        }
        wx.hideLoading()
        break;
      default:
        console.log(tab)
        wx.hideLoading();
        break;
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  valueIn(e){
    let type = e.currentTarget.dataset.i;
    if (type==1){
      this.setData({
        lang_area: e.detail.value
      })
    }
    if (type == 2) {
      this.setData({
        xueli: e.detail.value
      })
    }
    if (type == 3) {
      this.setData({
        infodesc: e.detail.value
      })
    }
    if (type == 4) {
      this.setData({
        signature: e.detail.value
      })
    }
    // console.log(e)
  },
  updateinfo(){
    let self = this;
    app.request({
      url: api.reporter_update,
      method: "PUT",
      data: { 
        lang_area: self.data.lang_area,
        education: self.data.xueli,
        signature: self.data.signature,
        intro: self.data.infodesc
      },//reporter_id
      success: function (e) {
        // console.log(e);
        if (-1 == e.code || e.code == 401) { self.setData({ login: (new Date()).getTime() }); return };
        if (1 == e.code) {
          
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
    
    console.log(this.data.lang_area)
  },
  loadUserlist(cb){
	let self = this;
	app.request({
      url: (self.data.reporter.symbol > 1)?api.reporter_tells:api.user_list,
	    method: "GET",
    data: (self.data.reporter.symbol > 1) ? Object.assign({}, self.data.params_userlist, { reporter_id: self.data.reporter.id}):self.data.params_userlist,//reporter_id
	    success: function(e) {
			// console.log(e);
			if(-1 == e.code||e.code==401){self.setData({login:(new Date()).getTime()}); return};
	        if (1 == e.code) {
			    cb(e);
          wx.hideLoading();
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
  loadUserCollects(cb){
  	let self = this;
  	app.request({
        url: (self.data.reporter.symbol > 1) ? api.reporter_collects : api.user_collects,
  	    method: "GET",
      data: (self.data.reporter.symbol > 1) ? Object.assign({}, self.data.params_collects, { reporter_id: self.data.reporter.id }) : self.data.params_collects,//reporter_id,
  	    success: function(e) {
  			// console.log(e);
  			if(-1 == e.code||e.code==401){self.setData({login:(new Date()).getTime()}); return};
  	        if (1 == e.code) {
  			    cb(e);
            wx.hideLoading();
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
  loadUserbook(cb){
  	let self = this;
  	app.request({
      url: (self.data.reporter.symbol > 1) ? api.reporter_books : api.user_books,
  	    method: "GET",
      data: (self.data.reporter.symbol > 1) ? Object.assign({}, self.data.params_userbook, { reporter_id: self.data.reporter.id }) : self.data.params_userbook,//reporter_id,,
  	    success: function(e) {
  			console.log(e);
  			if(-1 == e.code||e.code==401){self.setData({login:(new Date()).getTime()}); return};
  	        if (1 == e.code) {
  			      cb(e);
              wx.hideLoading();
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
  logincomplete(e){
  	  wx.reLaunch({
  		  url:'/pages/my/index'
  	  });
  },
  tabselect(e){
	  let self = this;
    let user_list = self.data.user_list;
    let user_collects = self.data.user_collects;
    let user_book = self.data.user_book;
    user_list.map((item,index)=>{
      item.isplay=false;
    });
    user_collects.map((item, index) => {
      item.isplay = false;
    })
    user_book.map((item, index) => {
      item.isplay = false;
    })
	  self.setData({
		  tab:e.currentTarget.dataset.ta,
      user_list: user_list,
      user_collects: user_collects,
      user_book: user_book
	  });
	  
  },
  navto(e){
    let self =this;
    if (!wx.getStorageSync('access_token')){
      self.loadUserlist((res) => {
        self.setData({
          user_list: res.data,
          user_total: res.total
        });
      });
      self.loadUserbook((res) => {
        self.setData({
          user_book: res.data,
          user_booktotal: res.total
        });
      });
      self.loadUserCollects((res) => {
        self.setData({
          user_collects: res.data,
          user_collectstotal: res.total
        });
      });
      return
    }
	  wx.navigateTo({
		  url:e.currentTarget.dataset.url
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
  			 page_size:20
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
  rtabseet(e){
    let self = this;
    self.setData({
      rtab: e.currentTarget.dataset.v
    })
  },
  selectItem(e) {
    let self = this;
    let list = self.data.user_list;
    let index = e.currentTarget.dataset.index;
    let item = e.currentTarget.dataset.item;
    app.request({
      url: api.collect,
      method: "POST",
      data: {
        target_id: item.id,
        status: item.is_collect ? 0 : 1
      },
      success: function (e) {
        console.log(e);
        if (-1 == e.code || e.code == 401) { self.setData({ login: (new Date()).getTime() }); return };
        if (1 == e.code) {
          list[index].is_collect = !list[index].is_collect;
          !item.is_collect ? list[index].collect_num++ : list[index].collect_num--;
          self.setData({
            user_list: list
          });
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
  loadComment(e) {
    let self = this;
    let commentAllpage = self.data.commentAllpage;
    let commentsList = self.data.commentsList;
    let commentsParams = self.data.commentsParams;
    if (commentAllpage > commentsParams.page) {
      commentsParams.page++;
      self.setData({
        commentsParams: commentsParams
      });
      wx.showLoading();
      app.request({
        url: api.comments,
        method: "GET",
        data: self.data.commentsParams,
        success: function (e) {
          if (-1 == e.code || e.code == 401) { self.setData({ login: (new Date()).getTime() }); return };
          if (1 == e.code) {
            self.setData({
              commentsList: [...commentsList, ...e.data],
              commentAllpage: e.total
            });
            wx.hideLoading()
          } else wx.showModal({
            title: "提示",
            content: e.msg,
            showCancel: !1
          });
        },
        complete: function () {
          setTimeout(function () { wx.hideLoading() }, 2000);
        }
      });
    }

  },
  comment() {
    let self = this;
    let comment_content = self.data.comment_content;
    let curcomment = self.data.curcomment;
    comment_content ? "" : wx.showToast({ title: '请先输入', icon: 'none' });
    let commentsList = self.data.commentsList;
    let curcommentIndex = self.data.curcommentIndex;
    let user_info = wx.getStorageSync('user_info');
    comment_content && wx.showLoading({ title: '正在提交...' });
    comment_content && app.request({
      url: !curcomment.back ? api.comment : api.reply,
      method: "POST",
      data: curcomment.back ? {
        id: self.data.curcomment.item.id,
        content: self.data.comment_content
      } : {
          tell_id: self.data.curcomment.id,
          content: self.data.comment_content
        },
      success: function (e) {
        if (-1 == e.code || e.code == 401) { self.setData({ login: (new Date()).getTime() }); wx.hideLoading(); return };
        if (1 == e.code) {
          wx.hideLoading();
          !curcomment.back ? commentsList.unshift({
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
          }) : commentsList[curcomment.index].children.push({
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
          curcomment.back = false;
          let list = self.data.user_list;
          list[curcommentIndex].comment_num++;
          curcomment.user = commentsList[curcommentIndex].user;
          self.setData({
            comment_content: '',
            commentsList: commentsList,
            user_list: list
          });
          setTimeout(()=>{
            self.loadUserlist((res) => {
              self.setData({
                user_list: res.data,
                user_total: res.total
              });
            });
            self.loadUserbook((res) => {
              self.setData({
                user_book: res.data,
                user_booktotal: res.total
              });
            });
            self.loadUserCollects((res) => {
              self.setData({
                user_collects: res.data,
                user_collectstotal: res.total
              });
            });
          },1200)
         
        } else wx.showModal({
          title: "提示",
          content: e.msg,
          showCancel: !1
        });
      },
      complete: function () {
        setTimeout(() => {
          wx.hideLoading()
        }, 2000);
      }
    });
  },
  commentcontent(e) {
    // console.log(e);
    this.setData({
      comment_content: e.detail.value
    })
  },
  imgpre(e){
    let item = e.currentTarget.dataset.item;
    let list = e.currentTarget.dataset.list.map((item)=>{return item.src});
    wx.previewImage({
      current: item, // 当前显示图片的http链接
      urls: list // 需要预览的图片http链接列表
    })
    console.log(item)
  },
  backcomment(e) {
    let self = this;
    let item = e.currentTarget.dataset.item;
    let index = e.currentTarget.dataset.index;
    let curcomment = self.data.curcomment;
    curcomment.user = item.user;
    curcomment.item = item;
    curcomment.index = index;
    curcomment.back = true;
    console.log(item, index)
    item.id && self.setData({
      curcomment: curcomment
    })
  },
  videoplay(e) {
    let self = this;
    let item = e.target.dataset.item;
    let index = e.target.dataset.index;
    let type = e.target.dataset.type;
    let videoshow = self.data.videoshow;
    console.log(e)
    let list = [];
    if (type == 'user_list'){
      list= self.data.user_list;
    } else if (type == 'user_collects'){
      list = self.data.user_collects
    }
   
    list.map((item, i) => {
      (i == index) && (item.isplay = !item.isplay);
      (i != index) && (item.isplay = false);
    });
    if (type == 'user_list') {
      self.setData({
        user_list: list,
        videoitem: item,
      });
    } else if (type == 'user_collects') {
      self.setData({
        user_collects: list,
        videoitem: item.tell, 
      });
    }
    
    self.setData({
      videoshow: !videoshow,
      action: {
        method: 'setCurrentTime',
        data: 0
      }
    });
    console.log(item)
    self.data.videoshow && wx.hideTabBar({});
    !self.data.videoshow && wx.showTabBar({});
    // self.audioCtx = wx.createAudioContext('myAudio');
    self.data.videoshow && self.audioCtx.play();
    !self.data.videoshow && self.audioCtx.pause();
  },
  bindplay(e) {
    let self = this;
    let item = e.target.dataset.item;
    let index = e.target.dataset.index;
    let list = self.data.user_list;
    console.log(item);
    item.sharetype = 1;//播放
    app.shareSend(item, () => {
      list[index].share_num++;
      self.setData({
        user_list: list
      });
    });
  },
  fixbug() { wx.reLaunch({ url: "/pages/my/index" }) },
  warnin(e) {
    wx.showActionSheet({
      itemList: ['举报'],
      success(res) {
        wx.navigateTo({
          url: '/pages/index/against/against?tell_id=' + e.currentTarget.dataset.item.id,
        });

      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
})