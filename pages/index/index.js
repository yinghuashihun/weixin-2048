// pages/index/index.js
var app = getApp();
Page({
 data: {
    motto: '',
    userInfo: {},
    imgSrc: '',
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../2048/2048'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo,
        imgSrc :''
      })
    })
  },
  onReady:function(){
    // 页面渲染完成
   
  },
  onShow:function(){
    // 页面显示
    console.log("show")
     this.setData({
        imgSrc :""
      })
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  click: function(e) {
   
    this.setData({
      imgSrc: "../../img/qrcode.jpg"      
    })
  }
})