// common/header.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type: String,
      value:'',
      observer: function (newval, oldval, changedPath){
	   let self =this;
		wx.getSystemInfo({
			success(res){
				self.setData({
					model:res.model=='iPhone X'?'iphonex':''
				})
			}
		})
        self.setData({
          title: newval ? newval : '家传'
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    title:'',
	model:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    navback(){
      wx.navigateBack({})
    }
  }
})
