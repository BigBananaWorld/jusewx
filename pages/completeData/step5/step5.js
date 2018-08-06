/**
 * 打卡页面
 */
const app = getApp()
const configHost = require('../../../config.js')
let url_addUser = configHost.service.host + "/userCenter/basicinfo"
let url_update = configHost.service.host + "/userCenter/updatinfo"
Page({
    data: {
      imgSrc: "https://xcx.zmelo.com/xcxzml/img/ok.png"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.isUpdate = options.change;
        let op1 = wx.getStorageSync("basic-info")
        let op2 = wx.getStorageSync("userinfo")
        let activityId = wx.getStorageSync('activity_id');
        this.param = {
            openid: op2.openId,
            nickName: op2.nickName,
            Img: op2.avatarUrl,
            height: op1.height,
            birthday: op1.birthday,
            current: op1.weight,
            target: op1.targetWeight,
            sex: op1.sex,
            activity_id: activityId,
            unionId:op2.unionId
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    submitUserInfo: function(e) {
        let me = this
        this.isUpdate?this.updateUser():this.createUser()
    },
    //创建新用户，新用户首次进入小程序的时候用到
    createUser: function() {
      let me = this
        wx.request({
            url: url_addUser,
            data: me.param,
            method: "POST",
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                if (res.data.code == 200) {
                    wx.switchTab({
                        url: "/pages/index1/index1"
                    })
                }

            },
            fail: function(e) {
                console.log(e)
            }
        })
    },
    //更新用户信息，用户在达成目标后重新提交信息的时候用到
    updateUser: function() {
      let me = this
        wx.request({
            url: url_update,
            data: {
                openid: me.param.openid,
                data: JSON.stringify(me.param)
            },
            method: "POST",
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                if (res.data.code == 200) {
                    app.isUserExist()//这里是为了刷新用户中心信息
                    wx.switchTab({
                        url: "/pages/index1/index1"
                    })
                }

            },
            fail: function(e) {
                console.log(e)
            }
        })
    }
})