const app = getApp(),api = require("../../../utils/api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
  comment_content: '',
	model:'',
	tab:1,
  user_list: [],
  user_total: 1,
  user_booktotal:1,
  params_userlist: {
    page: 1,
    page_size: 20
  },//我的讲述的列表参数
  params_userbook: {
    page: 1,
    page_size: 20
  },//我的讲述的列表参数
  params_collects: {
    page: 1,
    page_size: 20
  },//我的讲述的列表参数
	bookList:[{},{},{},{},{}]
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
	app.request({
	    url: api.reporter+'/'+options.id,
	    method: "GET",
	    data: {},
	    success: function(e) {
			console.log(e);
			if(-1 == e.code||e.code==401){self.setData({login:(new Date()).getTime()}); return};
	        if (1 == e.code) {
	          self.setData({
              id:options.id,
              infodel:e.data
            });
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
              console.log(res.data)
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
    this.audioCtx = wx.createAudioContext('myAudio');
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let self = this;
    self.data.id&&app.request({
      url: api.reporter + '/' + self.data.id,
      method: "GET",
      data: {},
      success: function (e) {
        console.log(e);
        if (-1 == e.code || e.code == 401) { self.setData({ login: (new Date()).getTime() }); return };
        if (1 == e.code) {
          self.setData({
            infodel: e.data
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
  imgpre(e) {
    let item = e.currentTarget.dataset.item;
    let list = e.currentTarget.dataset.list.map((item) => { return item.src });
    wx.previewImage({
      current: item, // 当前显示图片的http链接
      urls: list // 需要预览的图片http链接列表
    })
    console.log(item)
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
    tab > 1 && wx.showLoading();
    switch (Number(tab)) {
      case 3:
        //讲述
        let params_userlist = self.data.params_userlist;
        let total = self.data.user_total;
        let user_list = self.data.user_list;
        if (params_userlist.page < total) {
          params_userlist.page++;
          self.setData({
            params_userlist: params_userlist
          });
          self.loadUserlist((res) => {
            self.setData({
              user_list: [...user_list, ...res.data],
              user_total: res.total
            });
          });
        }
        wx.hideLoading()
        break;
      case 4:
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
              user_total: res.total
            });
          });
        }
        wx.hideLoading()
        break;
      case 2:
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
              user_book_total: res.total
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
  onShareAppMessage: function (e) {
    let self = this;
    let item = e.target.dataset.item;
    let index = e.target.dataset.index;
    let list = self.data.user_list;
    item.sharetype = 2;//分享
    app.shareSend(item, () => {
      list[index].share_num++;
      self.setData({
        user_list: list
      });
    });
    return {
      title: item.title,
      path: "/pages/index/index?id=" + item.id,
      imageUrl: item.image
    }
  },
  saveFormId(e){
  	  app.saveFormId(e.detail.formId);
  	  
  },
  back(){
	  wx.navigateBack()
  },
  touchTab(e){
	  this.setData({
		  tab:e.currentTarget.dataset.tab
	  })
  },
  loadUserbook(cb) {
    let self = this;
    app.request({
      url:  api.reporter_books,
      method: "GET",
      data:Object.assign({}, self.data.params_userbook, { reporter_id: self.data.id }),//reporter_id,,
      success: function (e) {
        console.log(e);
        if (-1 == e.code || e.code == 401) { self.setData({ login: (new Date()).getTime() }); return };
        if (1 == e.code) {
          cb(e);
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
  },
  loadUserlist(cb) {
    let self = this;
    app.request({
      url:  api.reporter_tells ,
      method: "GET",
      data:Object.assign({}, self.data.params_userlist, { reporter_id: self.data.id }),//reporter_id
      success: function (e) {
        // console.log(e);
        if (-1 == e.code || e.code == 401) { self.setData({ login: (new Date()).getTime() }); return };
        if (1 == e.code) {
          cb(e);
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
  },
  loadUserCollects(cb) {
    let self = this;
    app.request({
      url: api.reporter_collects ,
      method: "GET",
      data: Object.assign({}, self.data.params_collects, { reporter_id: self.data.id }) ,//reporter_id,
      success: function (e) {
        // console.log(e);
        if (-1 == e.code || e.code == 401) { self.setData({ login: (new Date()).getTime() }); return };
        if (1 == e.code) {
          cb(e);
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
  },
  saveFormId(e) {
    app.saveFormId(e.detail.formId);

  },
  closeComment(e) {
    this.setData({
      commentshow: false
    })
  },
  openComment(target) {
    let self = this;
    console.log(target)
    let item = target.currentTarget.dataset.item;
    self.setData({
      commentshow: true,
      curcomment: item,
      curcommentIndex: target.currentTarget.dataset.index,
      commentsParams: {
        tell_id: item.id,
        page: 1,
        page_size: 10
      }
    });
    app.request({
      url: api.comments,
      method: "GET",
      data: self.data.commentsParams,
      success: function (e) {
        if (-1 == e.code || e.code == 401) { self.setData({ login: (new Date()).getTime() }); return };
        if (1 == e.code) {
          self.setData({
            commentsList: e.data,
            commentAllpage: e.total
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
  returns() { return; },
  logincomplete(e) {
    wx.reLaunch({
      url: '/pages/index/index'
    });
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
    if (type == 'user_list') {
      list = self.data.user_list;
    } else if (type == 'user_collects') {
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