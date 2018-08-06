// pages/index1/index1.js
import * as echarts from '../../ec-canvas/echarts';
const getOption = require('./option.js');
const configHost = require('../../config.js');//configHost
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 500,
    rows: [],
    top4: [],
    topfif: [],
    isrecord: false,
    my: {},
    ec: {
      lazyLoad: true
    },
    isgetuserinfo: false
  },

  // 下载用户图像
  downloadFile(url) {
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url,
        success(res) {
          resolve(res);
        },
        fail(err) {
          reject(err)
        }
      })
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.getcal();
    console.log(app.globalData)
    that.lineComponment = that.selectComponent('#mychart-dom-multi-line'); //注册echarts组件
    // app.loadGlobalData();
    app.getActivity()
      .then(app.initUserInfo)
      .then(app.isUserExist).then(that.init)
    // that.init();

  },
  getcal() {
    let that = this;
    // 获取轮播数据
    wx.request({
      url: configHost.service.host + '/zmlHome/activityManageList',
      method: 'POST',
      success: function (res) {
        if (res.data.code == 200) {
          let rows = res.data.data.rows;
          if (rows.length > 4) {
            rows = rows.slice(0, 4)
          }
          that.setData({
            rows: rows
          })
        }
      }
    })
    console.log(that.data.rows)
  },
  init() {
    let that = this;
    that.setData({
      isgetuserinfo: true
    })
    that.draw()//绘制图表

    // 获取排名数据
    wx.request({
      url: configHost.service.host + '/zmlSignin/singshare',
      method: 'POST',
      data: {
        openid: app.getOpenid()
      },
      success: function (res) {
        console.log(res)
        let rows = res.data.data.rows;
        let isrecord = res.data.signins.signins;
        let topfif = {};
        if (rows.length > 4) {


          let topfif_all = rows.slice(4, 5);

          let topfif_array = topfif_all[0].userinfo;


          for (let key in topfif_array) {
            topfif[key] = topfif_array[key]
          }
          topfif.num = topfif_all[0].num
          // console.log(topfif)
        }
        let my = res.data.mysing
        // console.log(my)
        // console.log(my, my.num)
        that.setData({
          my
        })
        if (my.num < 5) {
          that.setData({
            topfif,
            isrecord
          })
        } else {
          that.setData({
            topfif: my
          })
        }
        that.setData({
          top4: rows.slice(0, 4)
        })
      }
    })
  },

  //获取授权情况
  getset(){
    return new Promise((r,j)=>{
      wx.getSetting({
        success(e){
          r(e)
        }
      })
    })
    
  },


  getUserInfo(e) {
    let that = this;
    if(e){
      app.initgetsetting()
    }
  },
  // 跳转到打卡排名
  torecordp: function () {
    let that=this;
    let e=that.getset();
    that.getset().then(res=>{
      console.log(res)
      if(res.authSetting['scope.userInfo']==true){
        wx.navigateTo({
          url: '../record/record',
          success: function (e) {
            console.log(e)
          },
          fail: function (e) {
            console.log(e)
          }
        })
      }
    })

  },
  // 首页轮播图跳转
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
    let that=this;
    app.getActivity()
      .then(app.initUserInfo)
      .then(app.isUserExist).then(that.init)
  },

  

  // 跳转到打卡页面
  torecord: function () {

    let that = this;
    that.getset().then(res=>{
      if(res.authSetting['scope.userInfo']==true){
        if (that.data.isrecord == false) {
          wx.switchTab({
            url: '../record1/record1'
          })
        }
      }
    })
    console.log(that.data.isrecord)

    // let that=this;
    // that.setData({
    //   isrecord:true
    // })
  },

  // echarts所有
  draw: function () { //echarts图表
    let msg=wx.getStorageSync('activity_id')
    // console.log(msg1)
    // console.log(app.globalData.actvity)
    // let msg = app.globalData.actvity[0].uuid;
    let that = this;
    _getData().then(res => {
      let day = [''];  //x轴上的日期
      let data = [''];  //y轴上的数据
      let signin_weight = []
      for (let i = 0; i < res.rows.length; i++) { //处理数据
        day.push(res.rows[i].week);                   //图表日期
        signin_weight.push(res.rows[i].signin_weight); //打卡情况
        if (res.rows[i].signin_weight == 1) {
          data.push((res.rows[i].weight) * 1);          //图表数据(有数据)
        } else {
          data.push('-');                                //图表数据(没有数据)
        }
      }
      data[data.length] = '-';
      day[day.length] = '';
      that.initChart({   //绘制图表
        data: data,
        day: day,
        signin_weight
      })
    })
    function _getData() {  //请求图表的数据
      let promise = new Promise((r, j) => {
        wx.request({
          url: configHost.service.host + '/zmlSignin/getSing',
          method: 'POST',
          data: {
            type: 'weight',
            openid: app.getOpenid(),             //#这里的openid是写死的 获取权限做好后请替换为获取的openid#
            activity_id: msg
          },
          success: function (res) {
            if (res.data.code == 200) { r(res.data.data) }
          },
          fail: function (res) { j(res) }
        })
      })
      return promise
    }
  },
  initChart: function (res) { //初始化charts
    let that = this,
      z = that.screenZoom||screenzoom();  //获取缩放系数
    let theChar = that.lineComponment.init((canvas, width, height) => {
      const lineChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      that.data.lineData
      lineChart.setOption(getOption({ z: z, day: res.day, data: res.data, signin_weight: res.signin_weight, modify: res.modify }))
      return lineChart
    })
    function screenzoom() {  //屏幕尺寸系数
      let screen = wx.getSystemInfoSync();
      let zoom = screen.screenWidth / 750;
      that.setData({  //保存缩放系数
        screenZoom:zoom
      })
      return zoom
    }
  }
})