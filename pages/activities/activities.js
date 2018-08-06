// pages/activities/activities.js
const configHost = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rows:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    wx.request({
      url:configHost.service.host+'/zmlHome/activityManageList',
      method:'POST',
      success:function(res){

        console.log(res)
        if(res.data.code==200){
          let rows=res.data.data.rows;
          if(rows.length>4){
            rows=rows.slice(0,4)
          }
          that.setData({
            rows:rows
          })
        }
      }      
    })
  },
  // 图跳转
  towebview: function (e) {
    console.log(e)
    if (e.currentTarget.dataset.web == '2') {//跳转到图片
      let img = e.currentTarget.dataset.img
      wx.navigateTo({
        url: `../../pages/carouselimg/carouselimg?url=${img}`
      })
    } else if (e.currentTarget.dataset.web == '3') {//跳转到url
      let url = e.currentTarget.dataset.url;
      wx.navigateTo({
        url: `../../pages/webview/webview?url=${url}`
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
  
  }
})