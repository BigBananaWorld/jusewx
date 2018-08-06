import reqs from './common/request.js'
const qcloud = require("./wafer2-client-sdk/index.js");
const configHost = require("./config.js");
const util = require("./utils/util.js");

const url_getUserInfo = configHost.service.host + "/userCenter/findBasicinfo"

/**
 * 程序主程序主要作用是判断使用用户是否为新用户，并且初始化用户数据(openid等基本信息)
 */
App({
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function (e) {
    // 日期格式化
    let that=this;
    that.initgetsetting();

    wx.clearStorageSync()
    qcloud.setLoginUrl(configHost.service.loginUrl)

    //打开调试
    wx.setEnableDebug({
      enableDebug: true
    })

    qcloud.setLoginUrl(configHost.service.loginUrl)

  },
  initgetsetting() {
    let me = this;
    wx.getSetting({
      success: function (e) {
        console.log(e)
        //判断是否获取用户权限，没有则隐藏tabbar
        if (!e.authSetting["scope.userInfo"]) {
          wx.hideTabBar()
        }else{
          wx.showTabBar()
        }

        me.globalData.authorities = e.authSetting;
      }
    })
  },


  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  },


  /**
   * 获取活动数据
   * @return {[type]} [description]
   */
  getActivity: function () {
    let me = this;
    let url_activityManageList = configHost.service.host + "/zmlHome/activityManageList"
    return new Promise(function (resolve, reject) {
      wx.request({
        url: url_activityManageList,
        data: {},
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res)
          resolve()
          me.globalData.actvity = res.data.data.rows
          // wx.setStorageSync('activity_id', res.data.data.rows[0].uuid)
        },
        fail: function () {
          console.log("fail")
        }
      })
    })
  },

  /*
   * 进入程序获取用户信息,信息保存进缓存，并且赋值给全局变量
   */
  initUserInfo: function () {
    wx.showLoading({
      title: "努力加载中...",
      mask: true
    })
    let me = this
    return new Promise(function (resolve, reject) {
      qcloud.login({
        success: function (result) { //并不知道result是什么鬼
          if (result) {
            qcloud.request({
              url: configHost.service.requestUrl,
              login: false,
              success: function (result) {
                if (result.data.loginState == 0) { }
              },
              fail: function (error) {
                console.log(error)
              },
              complete: function () {
                wx.getStorage({
                  key: "userinfo",
                  success: function (e) {
                    me.globalData.userInfo = e.data //这里获取openid
                    wx.hideLoading()
                    resolve()
                  }
                })
              }
            })
          } else {
            wx.getStorage({
              key: "userinfo",
              success: function (e) {
                me.globalData.userInfo = e.data
                wx.hideLoading()
                resolve()
              }
            })

          }
        },
        fail: function (error) {
          util.showModel('登录失败', error)
          wx.hideLoading()
          reject()
        }
      })
    })
  },

  /**
   * 判断是否为已有用户
   * @return {Boolean} [description]
   */
  isUserExist: function () {
    var me = this
    return new Promise(function (resolve, reject) {
      let openId = me.globalData.userInfo.openId;
      // me.getWeRunData(openId); //获取运动数据
      wx.request({
        url: url_getUserInfo, //仅为示例，并非真实的接口地址
        data: {
          openid: openId
        },
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.data.code == 201) { //如果没有用户信息
            wx.redirectTo({
              url: "/pages/completeData/step1/step1"
            })
          } else {
            me.globalData.userCenter = res.data.userinfo
            resolve()
            wx.hideLoading()
          }
        },
        fail: function (err) {
          console.log(err)
          wx.hideLoading()
        }
      })
    })

  },

  /**
   * 获取微信运动数据
   * @param  {[type]} openId [description]
   * @return {[type]}        [description]
   */
  getWeRunData: function (openId) {
    return new Promise(function (resolve, reject) {
      wx.login({
        success: function (login) {
          wx.getWeRunData({
            success: res => {
              let data = {
                encryptedData: res.encryptedData,
                iv: res.iv,
                openId,
                code: login.code
              }
              wx.request({
                url: configHost.service.host + '/zmlHome/getWeRunData',
                method: "post",
                data: data,
                success: function (ress) {
                  if (ress.data.code == 200) {
                    resolve(ress)
                  }
                },
                fail: function (errr) {
                  reject(errr)
                }
              })
            },
            fail: err => {
              console.log(err)
              // reject(errr)
              // if (err.errMsg == "getWeRunData:fail auth deny") {
              //   wx.setStorageSync('movements', false)
              // }
            }
          })
        }
      })
    })
  },

  /**
   * 获取openid
   * @return {[type]} [description]
   */
  getOpenid: function () {
    return this.globalData.userInfo.openId || "";
  },


  globalData: {
    req_: reqs,
    userInfo: {},
    userCenter: {},
    actvity: [],
    authorities: {}
  }
})