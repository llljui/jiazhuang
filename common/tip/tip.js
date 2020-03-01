// common/tip/tip.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
	tipshow:{
		type:String,
		value:'',
		observer: function(newval, oldval, changedPath){
			this.setData({
				show:!this.data.show,
				toast:newval.split('---')[0]
			});
			setTimeout(()=>{
				this.setData({
					show:false
				})
			},2000)
			console.log(this.data.toast);
		}
	}
  },

  /**
   * 组件的初始数据
   */
  data: {
	show:false,
	toast:''
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
