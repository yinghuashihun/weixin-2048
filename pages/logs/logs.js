// pages/logs/logs.js

var app = getApp();
Page({
  data: {
    logs: [],
    greets:[]
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(function (log)    {
        return app.formatTime(new Date(log))
      }),
      greets: [
        "我希望有个如你一般的人",
        "如山间清爽的风，如古城温暖的光" ,
        "从清晨到夜晚，由山野到书房",
        "只要最后是你，就好"]
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  
})

