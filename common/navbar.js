// common/navbar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
	navtab:{
		type:String,
		value:'/pages/index/index',
		observer:function(newVal, oldVal, changedPath) {
			this.setData({
				tab:newVal
			})
			console.log(newVal, oldVal,changedPath)
        // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 通常 newVal 就是新设置的数据， oldVal 是旧数据
     }
	}
  },

  /**
   * 组件的初始数据
   */
  data: {
	tab:'/pages/index/index'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    redictTo(e){
	  if(e.currentTarget.dataset.url==this.data.tab){return};
      wx.redirectTo({
        url: e.currentTarget.dataset.url
      });
	  this.setData({
		  tab:e.currentTarget.dataset.url
	  })
    }
  }
})
