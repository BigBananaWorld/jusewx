const app = getApp()
const configHost = require('../../config.js');
const ctx = wx.createCanvasContext('myCanvas');
const configHead = require('../../config.js');
let url_activityManageList = configHost.service.host + "/zmlHome/activityManageList"
let url_indexData = configHost.service.host + "/zmlHome/getCal"
let url_update = configHost.service.host + "/userCenter/updatinfo"

Page({
  /*页面的初始数据*/
  data: {
    thisday: app.globalData.req_.timeStamp(Date.parse(new Date())), //显示在页面中的
    thisdayVal: '', //实际需要的
    calorie: 0, //卡路里
    remainWeight: 0, //还需减少的体重
    weight: 0, //当前体重
    targetWeight: 80, //目标体重
    currentWeight: 80,
    persent: 0, // 任务完成比
    conti: 1, //连续签到
    totalDay: 1, //总共签到天数
    foodDay: 1, //异常饮食
    isShare: false,
    signText: "打卡",
    shareImg: '',
    defAvatarUrl: "/img/defaultImg.png"
  },
  toAbnormalAiet: function () { //异常饮食
    wx.navigateTo({
      url: '../../pages2/abnormalAiet/abnormalAiet'
    })
  },
  toWeight: function () { //目标体重
    wx.navigateTo({
      url: '../../pages2/weight/weight',
    })
  },
  toSign: function () { //打卡记录 
    let userinfo = wx.getStorageSync('userinfo');
    let activityId = wx.getStorageSync('activity_id');
    let that = this;
    wx.request({
      url: configHead.service.host + '/zmlHome/createClock',
      data: { openid: userinfo.openId, activity_id: activityId },
      method: 'POST',
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            conti: res.data.data.continuitysigncount,
            totalDay: res.data.data.totalsigncount
          })
          that.setData({
            signText: "已打卡"
          })
          that.sign.show()
        } else {
          that.setData({
            signText: "已打卡"
          })
          wx.showToast({
            title: res.data.mes,
            icon: 'none'
          })
        }
      },
      fail: function (res) { },
    })
  },
  bindShowCala: function (e) {
    wx.navigateTo({
      url: '/pages/record/calendar2/calendar2?type=single&from=index'
    })
  },
  share: function (e) { //点击分享
    let that = this;
    that.setData({
      isShare: true
    })
    let userinfo = wx.getStorageSync('userinfo');
    let activity_id = wx.getStorageSync('activity_id');
    let z = that.data.screenZ;
    let iconUrl = userinfo.avatarUrl || "https://xcx.zmelo.com/xcxzml/defaultImg.png";
    wx.showLoading({
      title: '拼命加载中..',
      mask: true
    })
    this.downloadFile(configHost.service.host + '/activitymanage/qrcode?id=' + userinfo.openId + '&&activity_id=' + activity_id)
      .then(data => {
        return this.downloadFile(iconUrl).then(ico => {
          wx.hideLoading();
          let theText = that.conversion((e.target.dataset.cal) * 1)
          ctx.save()
          ctx.setFillStyle('#FFFFFF')
          ctx.fillRect(0, 0, 600 * z, 700 * z)
          ctx.restore()
          //头像
          const grd = ctx.createLinearGradient(430 * z, 62 * z, 430 * z, 100 * z)
          grd.addColorStop(0, '#EC6764')
          grd.addColorStop(1, '#F2A66A')

          ctx.save();
          let r = 50 * z;
          let cx = (87 * z) + r
          let cy = (56 * z) + r
          ctx.beginPath()
          ctx.arc(cx, cy, r, 0, 2 * Math.PI)
          ctx.closePath()
          ctx.clip()
          ctx.drawImage(ico.tempFilePath, cx - r, cy - r, r * 2, r * 2);
          ctx.restore()
          //头像结束
          ctx.setFillStyle('black')
          ctx.setTextBaseline('top')
          ctx.setTextAlign('left');
          ctx.setFontSize(30 * z);
          ctx.fillText("今天消耗了", 232 * z, 60 * z)
          ctx.save();
          ctx.setFillStyle(grd);
          ctx.fillText(e.target.dataset.cal, 394 * z, 62 * z);
          ctx.fillText('Cal', 464 * z, 62 * z)

          ctx.save();
          ctx.setFillStyle('#999999')
          ctx.fillText(theText, 234 * z, 110 * z);
          ctx.restore()
          ctx.setLineDash([6 * z, 2 * z], 5 * z);
          ctx.setStrokeStyle('#F1F1F1');
          ctx.beginPath();
          ctx.moveTo(87 * z, 172 * z);
          ctx.lineTo(517 * z, 172 * z);
          ctx.stroke();

          ctx.setFillStyle('#000000');
          ctx.setFontSize(26 * z)
          ctx.fillText('并在减肥计划中已连续打卡      天', 100 * z, 198 * z)

          ctx.setFillStyle('#ff6666');
          ctx.fillText(e.target.dataset.conti, 425 * z, 198 * z);
          // 二维码
          ctx.drawImage(data.tempFilePath, 128 * z, 290 * z, 360 * z, 360 * z)
          // 二维码结束
          ctx.draw(false, function () {
            wx.canvasToTempFilePath({ //保存canvas上画的图
              canvasId: 'myCanvas',
              success: function (res) {
                that.setData({
                  sharePhoto: res.tempFilePath
                })
              },
              fail: function (res) {
                console.log(res, 'then')
              }
            })
          })
        })
      }).catch(err => {
        console.log('catch', err)
      })
  },
  conversion: function (cal) {/*  */
    let theText = '相当于一只棒棒糖';
    if (cal == 0) {
      theText = '相当于一杯白开水';
    } else if ((cal * 1) >= 25 && (cal * 1) <= 50) {
      theText = '相当于一只棒棒糖';
    } else if ((cal * 1) > 50 && (cal * 1) <= 100) {
      theText = '相当于一罐可乐';
    } else if ((cal * 1) > 100 && (cal * 1) <= 150) {
      theText = '相当于一只鸡腿';
    } else if ((cal * 1) > 150 && (cal * 1) < 280) {
      theText = '相当于一碗回锅肉';
    } else if ((cal * 1) > 280 && (cal * 1) <= 400) {
      theText = '相当于一个鸡肉卷'
    } else if ((cal * 1) > 400 && (cal * 1) <= 600) {
      theText = '相当于一只烤猪蹄'
    } else if ((cal * 1) > 600 && (cal * 1) <= 800) {
      theText = '相当于一只鸡肉汉堡'
    } else if ((cal * 1) > 800 && (cal * 1) <= 1200) {
      theText = '相当于一只烤鸡'
    } else if ((cal * 1) > 1200 && (cal * 1) <= 2000) {
      theText = '相当于一块生日蛋糕'
    } else if ((cal * 1) > 2000 && (cal * 1) <= 3000) {
      theText = '相当于一只全聚德烤鸭'
    } else if ((cal * 1) > 3000) {
      theText = '你超神了!'
    }
    return theText
  },
  closeShare: function () { //关闭分享弹框
    let that = this;
    that.setData({
      isShare: false
    })
  },
  shareSave: function () { //保存挑战令
    let that = this;
    let sharePhoto = that.data.sharePhoto;
    if (sharePhoto) {
      wx.saveImageToPhotosAlbum({
        filePath: sharePhoto + "",
        success(res) {
          wx.showToast({
            title: '保存成功....',
            icon: "success"
          })
        },
        fail() {
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
  shareSend: function () { //发送挑战令给微信好友
    let that = this;
    let shareImg = that.data.shareImg;
    if (!shareImg) {
      that.canvasToTempFilePath('myCanvas').then(path => {
        let filepath = [];
        filepath.push(path.tempFilePath);
        return that.uploadFile(configHost.service.host + '/upload/img', filepath[0], 'img', {}).then(datas => {
          console.log(JSON.parse(datas.data).ImgUrl);
          that.setData({
            shareImg: JSON.parse(datas.data).ImgUrl
          })
        })
      }).catch(err => {
        console.log(err)
      })
    } else {
      console.log(shareImg)
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.sign = that.selectComponent('#sign');
    wx.removeStorageSync("temp_date")
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
    this.sign = this.selectComponent("#sign");
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let me = this;
    // this.getActivityFromGlobalDataByName()
    // wx.setStorageSync("temp_date_index",me.data.thisday)
    app.initUserInfo().then(() => {
      let openid = wx.getStorageSync('userinfo').openId;
      app.getWeRunData(openid)
    }).then(me.getInfoOfIndex).then(me.fillData)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: "努力加载中...",
      mask: true
    })
    let me = this
    //获取日历日期
    wx.getStorage({
      key: "temp_date_index",
      success: (e) => {
        // if (e.data.currentData === this.data.thisdayVal) {

        // } else {
        me.setData({
          thisday: app.globalData.req_.changeTime(e.data.currentData),
          thisdayVal: e.data.currentData
        })

        me.getInfoOfIndex(me.data.thisday).then(me.fillData)
        // }
      },
      fail: function (e) {

        me.setData({
          thisday: me.data.thisday
        })
        me.getInfoOfIndex(me.data.thisday).then(me.fillData)
      }
    })
  },

  /**
   * 设置新目标,对目标和当前体重做出判断，目标>体重 则弹出对话框提示
   * @return {[type]} [description]
   */
  bindNewTarget: function (e) {
    wx.navigateTo({
      url: "/pages/completeData/step3/step3?change=1"
    })
  },

  /**
   * 获取活动数据
   * @return {[type]} [description]
   */
  getActivity: function () {
    let me = this
    return new Promise(function (resolve, reject) {
      wx.request({
        url: url_activityManageList,
        data: {},
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          resolve(res)
          wx.setStorageSync('activity_id', res.data.data.rows[0].uuid)
        }
      })
    })
  },

  getInfoOfIndex: function (date) {
    let activityId = wx.getStorageSync('activity_id');
    let me = this
    return new Promise(function (resolve, reject) {
      wx.request({
        url: url_indexData,
        data: {
          openid: app.globalData.userInfo.openId,
          activity_id: activityId,
          times: date ? date : null //app.globalData.req_.timeStamp(Date.parse(new Date()))
        },
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          resolve(res)
        }
      })
    })
  },

  /**
   * 装配加载首页数据
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  fillData: function (result) {
    if (result.data.code == 201) return;
    if (result.data.homedata.data) {
      let data = result.data
      let calorie = Math.ceil(data.homedata.data.signin.steps / 20)
      let weight = parseFloat(data.homedata.data.signin.weight)
      let targetWeight = parseFloat(data.homedata.data.userinfo.target)
      let currentWeight = parseFloat(data.homedata.data.userinfo.current)
      let conti = data.homedata.data.continuitysigncount //连续签到
      let totalDay = data.homedata.data.totalsigncount //总共签到天数
      let foodDay = data.homedata.foodrecord //异常饮食
      let remainWeight = weight - targetWeight;//今日是否打卡
      let persent = (currentWeight - weight) * 100 / (currentWeight - targetWeight)
      // let remainWeight = 50
      let sign = data.homedata.data.sign == true ? "已打卡" : '打卡';

      if (persent <= 0 || persent > 100) {
        persent = 0
      }

      this.setData({
        calorie: calorie, //卡路里
        remainWeight: remainWeight.toFixed(1), //还需减少的体重
        weight: weight, //当前体重
        currentWeight: currentWeight,
        targetWeight: targetWeight, //目标体重
        conti: conti, //连续签到
        totalDay: totalDay, //总共签到天数
        foodDay: foodDay,//异常饮食
        signText: sign,//今日是否打卡
        persent: persent
      })
    } else {
      this.setData({
        calorie: 0, //卡路里
      })
    }
    wx.hideLoading()
  },

  getActivityFromGlobalDataByName: function (name) {
    let result = {}
    app.globalData.actvity.forEach(function (val, index) {
      if (val.activity_name == name) {
        result = val
      }
    })
    return result
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
  }
})