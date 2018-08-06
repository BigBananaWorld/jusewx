// pages/record1/record1.js
const app = getApp()
import * as echarts from '../../ec-canvas/echarts';
const configHost = require('../../config.js');


function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {

  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    select: 'diet',
    time_now: '',
    text_num: '15',
    settings: [
      {
        imgurl: 'https://zmlwx.oss-cn-shenzhen.aliyuncs.com/Bust.png',
        text: '胸围',
        id: 'bust',
        num: ''
      },
      {
        imgurl: 'https://zmlwx.oss-cn-shenzhen.aliyuncs.com/The%20waist.png',
        text: '腰围',
        id: 'waist',
        num: ''
      },
      {
        imgurl: 'https://zmlwx.oss-cn-shenzhen.aliyuncs.com/Hipline_.png',
        text: '臀围',
        id: 'hipline',
        num: ''
      },
      {
        imgurl: 'https://zmlwx.oss-cn-shenzhen.aliyuncs.com/Arm%20circumference.png',
        text: '手臂围',
        id: 'arm',
        num: ''
      },
      {
        imgurl: 'https://zmlwx.oss-cn-shenzhen.aliyuncs.com/Thigh%20circumference_.png',
        text: '大腿围',
        id: 'thigh',
        num: ''
      },
      {
        imgurl: 'https://zmlwx.oss-cn-shenzhen.aliyuncs.com/Calf%20circumferencei_.png',
        text: '小腿围',
        id: 'calf',
        num: ''
      }
    ],
    maxlength: 150,
    len: '0',
    weightData: "",
    weightDef: [50, ".", 0, '公斤'],
    weight: '',
    tiweiData: '',
    tiweiDef: [40, '.', 0, '厘米'],
    btn1: false,
    btn2: false,
    btn3: false,
    Bust: '',
    Waist: '',
    Hipline: '',
    Arm: '',
    Thigh: '',
    Calf: '',
    hidden: true,//控制打卡规则显示隐藏
    diet: '',
    isShare: false,
    screenZ: '',
    sharePhoto:'',
    diet_text:''
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.init();
    that.checkfirst();

    that.pickerInit();

    wx.getStorageInfo({
      success: function (e) {
        console.log(e, "所有缓存数据")
      }
    })
    wx.getSystemInfo({ //屏幕尺寸
      success: function (res) {
        that.setData({
          screenZ: res.screenWidth / 750
        })
      }
    })
    wx.authorize({ //请求保存图片权限
      scope: 'scope.writePhotosAlbum',
      fail() { }
    })

  },

  init: function () {
    let that = this;
    let time = new Date().Format('yyyy-MM-dd hh:mm')
    let resettings = [
      {
        imgurl: 'https://zmlwx.oss-cn-shenzhen.aliyuncs.com/Bust.png',
        text: '胸围',
        id: 'bust',
        num: ''
      },
      {
        imgurl: 'https://zmlwx.oss-cn-shenzhen.aliyuncs.com/The%20waist.png',
        text: '腰围',
        id: 'waist',
        num: ''
      },
      {
        imgurl: 'https://zmlwx.oss-cn-shenzhen.aliyuncs.com/Hipline_.png',
        text: '臀围',
        id: 'hipline',
        num: ''
      },
      {
        imgurl: 'https://zmlwx.oss-cn-shenzhen.aliyuncs.com/Arm%20circumference.png',
        text: '手臂围',
        id: 'arm',
        num: ''
      },
      {
        imgurl: 'https://zmlwx.oss-cn-shenzhen.aliyuncs.com/Thigh%20circumference_.png',
        text: '大腿围',
        id: 'thigh',
        num: ''
      },
      {
        imgurl: 'https://zmlwx.oss-cn-shenzhen.aliyuncs.com/Calf%20circumferencei_.png',
        text: '小腿围',
        id: 'calf',
        num: ''
      }
    ]
    that.setData({
      settings: resettings,
      time_now: time,
      diet:'',
      diet_text:''
    })

  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 判断是否是第一次进入
  checkfirst(){
    let that=this;
    wx.request({
      url:configHost.service.host +'/zmlSignin/clocks?openid='+app.getOpenid(),
      method:'get',
      success(res){
        if(res.data.sing==false){
          that.setData({
            hidden:false
          })
        }
      }
    })
  },

  btn_draw: function (option, initData) {
    let that = this;
    //  console.log(option);
    let theType = initData || option.currentTarget.dataset.type;
    if (theType == 'body' || theType == 'diet') {
      that.setData({
        select: theType
      })
    } else {
      that.setData({
        select: 'weight'
      })
    }
  },
  pickerInit: function () { //初始化picker组件值
    let theWeight = [],
      tiwei = [];
    theWeight[0] = [];
    tiwei[0] = [];
    for (let i = 30; i <= 300; i++) { //体重
      theWeight[0].push(i)
    }
    for (let i = 0; i < 200; i++) { //体围
      tiwei[0].push(i)
    }
    theWeight[1] = ".";
    tiwei[1] = '.';
    theWeight[2] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    tiwei[2] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    theWeight[3] = ["公斤"]
    tiwei[3] = ["厘米"]

    this.setData({
      weightData: theWeight,
      tiweiData: tiwei
    })
  },
  // 添加体重
  addWeight: function (option) {
    let that = this;
    let theNum = option.detail.value[0] + 30 + option.detail.value[2] * 0.1;
    that.setData({
      weight: theNum,
      btn1: true
    })
  },
  // 添加体围
  addTiwei: function (option) {
    let that = this;
    let theNum = option.detail.value[0] + option.detail.value[2] * 0.1;
    let index = option.currentTarget.dataset.index;
    let id = option.currentTarget.dataset.id;
    let copynum = `settings[${index}].num`;
    console.log(id, theNum);
    that.setData({
      [copynum]: theNum,
      btn2: true
    })
  },
  // 关闭模态框
  closeModal: function () {
    let that=this;
    that.setData({
      hidden: true
    })
  },
  // 异常饮食输入
  diet_input: function (e) {
    let that = this;
    let len = parseInt(e.detail.value.length);
    let diet = e.detail.value;
    len > 0 ? that.setData({ btn3: true }) : that.setData({ btn3: false })
    console.log(len)
    that.setData({
      len,
      diet
    })
  },
  // 控制显示隐藏分享
  showShare(param) {
    let that = this;
    that.setData({
      isShare: param
    })
  },
  // 关闭分享
  closeShare() {
    console.log(1)
    let that=this;
    that.showShare(false)
  },
  // 提交体重
  tosubmit1: function () {
    console.log(0)
    let that = this;
    if (that.data.btn1 == true) {
      console.log(1);
      wx.request({
        url: configHost.service.host + '/zmlHome/updateSignin',
        method: 'post',
        data: {
          openId:app.getOpenid(),
          data: JSON.stringify({
            weight: that.data.weight
          })
        },
        success(res) {
          console.log(res)
          that.showShare(true)
          that.share()
          that.init()
        }
      })
    }
  },
  //提交体围
  tosubmit2() {
    let that = this;
    if (that.data.btn2 == true) {
      console.log(that.data.settings)
      //将已设置的数据保存到新数组data
      let data = {};
      that.data.settings.forEach((item, index) => {
        if (item.num !== "") {
          data[item.id] = item.num
        }
      })
      wx.request({
        url: configHost.service.host + '/zmlHome/updateSignin',
        method: 'post',
        data: {
          openId: app.getOpenid(),
          data: JSON.stringify(data)
        },
        success(res) {
          console.log(res)
          that.showShare(true)
          that.share()
          that.init()
        },
        fail(res) {
          console.log(res)
        }
      })
    }
  },
  // 提交异常饮食
  tosubmit3() {
    let that = this;
    let createdate = new Date();
    if (that.data.btn3 == true) {
      wx.request({
        url: configHost.service.host + '/zmlHome/addfoodrecord',
        method: 'post',
        data: {
          openid: app.getOpenid(),
          foodname: that.data.diet,
          createdate
        },
        success(res) {
          console.log(res)
          that.showShare(true)
          that.share()
          that.init()
        },
        fail(res) {
          console.log(res)
        }
      })
    }
  },
  // 显示规则
  toShowRule() {
    let that = this;
    that.setData({
      hidden: false
    })
  },



  //下载用户图像
  downloadFile: function (url) {
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url: url, //下载地址
        success: function (res) {
          resolve(res);
        },
        fail: function (err) {
          reject(err)
        }
      })
    })
  },
  //获取canvas临时图片路径
  canvasToTempFilePath: function (canvasId) {
    return new Promise((resolve, reject) => {
      wx.canvasToTempFilePath({
        canvasId: canvasId,
        success: function (res) {
          resolve(res);
        },
        fail: function (err) {
          reject(err)
        }
      })
    })
  },
  //上传图片
  uploadFile: function (url, filePath, name, formData) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: url, //仅为示例，非真实的接口地址
        filePath: filePath,
        name: name,
        formData: formData,
        success: function (res) {
          resolve(res)
        },
        fail: function (err) {
          reject(err)
        }
      })
    })
  },
  
  //获取分享图片
  getShareImg(){
    let that = this;
    let userinfo = wx.getStorageSync('userinfo');
    return new Promise(function(resolve,reject){
      wx.request({
        url:configHost.service.host + '/zmlSignin/challengePostet',
        method:'get',
        data:{
          openid:userinfo.openId
        },
        success(res){
          resolve(res);
        },
        fail(res){
          reject();
        }
      })
    })
  },
  // 获取分享二维码
  getShareCode(){
    let that = this;
    let userinfo = wx.getStorageSync('userinfo');
    let activity_id = wx.getStorageSync('activity_id');
    return new Promise(function(resolve,reject){
      wx.request({
        url:configHost.service.host +"/activitymanage/qrcode",
        method:'get',
        data:{
          openId:userinfo.openId,
          activity_id:activity_id
        },
        success(res){
          resolve(res);
        },
        fail(res){
          console.log(res);
          reject();
        }

      })
    })
  },

  // 分享
  share(e) {
    console.log('进入分享')
    let that = this;
    let userinfo = wx.getStorageSync('userinfo');
    let activity_id = wx.getStorageSync('activity_id');
    let z = that.data.screenZ;
    let iconUrl = userinfo.avatarUrl || "https://xcx.zmelo.com/xcxzml/defaultImg.png";
    const ctx = wx.createCanvasContext('myCanvas');
    wx.showLoading({
      title: '拼命加载中',
      mask: true
    });
    that.getShareImg().then(img=>{
      console.log(img)
      let title=img.data.title;
      let nav=img.data.nav;
      let imgurl=img.data.poster.poster_imgURL;
      console.log(imgurl)
      // that.getShareCode().then(code=>{
      //   console.log(code)
      //   that.downloadFile(imgurl).then(imgurld=>{//图片下载后的地址
      //     return that.downloadFile(code).then(coded=>{//二维码下载后的地址
      //       ctx.drawImage(imgurld)
      //     })
      //   })
      // })
      that.downloadFile(imgurl).then(imgurld=>{
        return that.downloadFile(configHost.service.host + '/activitymanage/qrcode?openId=' + userinfo.openId + '&&activity_id=' + activity_id).then(coded=>{
          wx.hideLoading();
          console.log(coded)
          ctx.drawImage(imgurld.tempFilePath,0,0,750*z,810*z);
          ctx.save();
          ctx.drawImage(coded.tempFilePath,512*z,660*z,200*z,200*z);
          ctx.setFillStyle('#ff5a5a');
          ctx.setTextBaseline('top')
          ctx.setTextAlign('left');
          ctx.setFontSize(36 * z);
          ctx.fillText(title, 520 * z, 860 * z);
          // ctx.setFillStyle('#999');
          // ctx.setTextBaseline('top')
          // ctx.setTextAlign('left');
          // ctx.setFontSize(30 * z);
          // ctx.fillText(nav, 45 * z, 950 * z);
          ctx.draw(false, function () {
            wx.canvasToTempFilePath({ //保存canvas上画的图
              canvasId: 'myCanvas',
              success: function (res) {
                that.setData({
                  sharePhoto: res.tempFilePath
                })
                // 清空表单
                that.init();
              },
              fail: function (res) {
                console.log(res, 'then')
              }
            })
          })
        })
      }).catch(err=>{
        console.log(err)
      })
    })
  },
  // 保存挑战令
  shareSave(){
    console.log(111)
    let that=this;
    let sharePhoto=that.data.sharePhoto;
    if(sharePhoto){
      wx.saveImageToPhotosAlbum({
        filePath: sharePhoto + "",
        success(res){
          wx.showToast({
            title:"保存成功...",
            icon:'success'
          })
        },
        fail(){
          wx.getSetting({ // 查询用户权限设置情况
            success: function (res) {
              if (!res.authSetting['scope.writePhotosAlbum']) {
                wx.showModal({
                  title: '提示',
                  content: '未能获得保存权限,是否前往设置权限?',
                  success: function (data) {
                    if (data.confirm) {
                      wx.openSetting({
                        success: function (res) {
                          wx.saveImageToPhotosAlbum({
                            filePath: sharePhoto + "",
                            fail: function () {
                              wx.showToast({
                                title: '保存失败',
                                icon: 'none'
                              })
                            }
                          })
                        }
                      })
                    } else {
                      wx.showToast({
                        title: '保存失败..',
                        icon: "none"
                      })
                    }
                  }
                })
              }
            }
          })
        }
      })
    }
  },

  onShareAppMessage: function (res) {       //发送挑战令给好友
    let that = this;
    let shareImg = that.data.shareImg;
    let userinfo = wx.getStorageSync('userinfo');
    let activity_id = wx.getStorageSync('activity_id');
    if (!shareImg) {
      that.canvasToTempFilePath('myCanvas').then(path => {
        let filepath = [];
        filepath.push(path.tempFilePath);
        return that.uploadFile(configHost.service.host + '/upload/img', filepath[0], 'img', {}).then(datas => {
          that.setData({
            shareImg: JSON.parse(datas.data).ImgUrl
          });
          return JSON.parse(datas.data).ImgUrl
        })
      }).then(url => {
        return {
          title: '快来挑战我吧',
          path: 'pages/record/record?openId=' + userinfo.openId + '&&activity_id=' + activity_id,
          imageUrl: url,
          success: function (res) {
            // 转发成功
          },
          fail: function (res) {
            // 转发失败
          }
        }
      }).catch(err => {
        console.log(err)
      })
    } else {
      return {
        title: '快来挑战我吧',
        path: 'pages/record/record?openId=' + userinfo.openId + '&&activity_id=' + activity_id,
        imageUrl: shareImg,
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }
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
    let that = this;
    that.init();
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