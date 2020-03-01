
let location = 'https://www.jiazhuan.com.cn'; //测试
var _api_root = location + "/api/", api = {
    login: _api_root + "login",
	tells: _api_root + "tells",//首页
    collect:_api_root + "collect",//喜欢收藏
	increase:_api_root + "increase",//分享
	comments:_api_root + "comments",//评论列表
	comment:_api_root + "comment",//评论
	reply:_api_root + "reply",//回复评论
	reasons:_api_root + "reasons",//举报原因
	report:_api_root + "report",//举报
	upload:_api_root + "upload",//上传文件
	
	books:_api_root + "books",//书架列表
	
	reporters:_api_root + "reporters",//记者列表
  reporter_info: _api_root+'reporter',//记者详情
	user:_api_root + "user",//我的
	user_list:_api_root+"user/tells",//我的讲述
	user_collects:_api_root+"user/collects",//我的好听
	user_books:_api_root+"user/books",//我的自传
	product:_api_root+"product",//商品详情
	order:_api_root+"order",//下单post,get采访详情 出书
	apply:_api_root+"apply",//申请做记者
	apply_state:_api_root+"apply/state",//申请做记者审核状态
	reporter_photos:_api_root+"reporter/photos",//照片列表,或reporter/photos/{id}方法Delete
	reporter:_api_root+"reporter",//获取记者信息
  reporter_update: _api_root + "reporter",//修改记者信息put
  reporter_match: _api_root + 'reporter/match',//找记者出书，不是从记者介绍页进去的调用此接口获取商品id
  withdraw_return: _api_root + 'withdraw',//提取稿费 post
  reporter_books: _api_root +'reporter/books',//记者作品
  reporter_tells: _api_root + 'reporter/tells',//记者讲述
  reporter_collects: _api_root + 'reporter/collects',//记者好听


	orders:_api_root+"orders",//采访列表get
  orders_detail: _api_root + "order",//采访详情get order/{id}
  agreement: _api_root + "agreement"//协议get type 1:记者手册,2:出版协议 (默认1)
	
};

module.exports = api;