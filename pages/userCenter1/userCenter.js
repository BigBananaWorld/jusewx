/**
 * 我的
 */
const app = getApp()
const configHost = require('../../config.js');
const url_userCenter = configHost.service.host + "/zmlHome/getCal"
const url_update = configHost.service.host + "/userCenter/updatinfo"
const url_getUserPhone = configHost.service.host + "/userCenter/getPhoneNumber"

Page({
    data: {
        avatarUrl: "https://zmlwx.oss-cn-shenzhen.aliyuncs.com/user/default.png",
        nickName: "",
        createTime: "",
        countinueSign: 0,
        theHightest: 0,
        totalSign: 0,
        countinueRank: 1,
        totalRank: 1,
        height: 160,
        persent: 60,
        remainWeight: 0, //还需减少的体重
        weight: 0, //原始体重
        currentWeight: 0,
        targetWeight: 0, //目标体重
        recommendWeight: {},
        isBindPhone: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

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
        this.loadUserInfo()
    },
    /**
     * 加载 我的 页面数据
     * @return {[type]} [description]
     */
    loadUserInfo: function() {
        let me = this
        wx.request({
            url: url_userCenter,
            data: {
                openid: app.getOpenid(),
            },
            method: "POST",
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                console.log(res)
                me.fillData(res)
            }
        })
    },

    /**
     * 填装数据 
     * @param  {[type]} result [description]
     * @return {[type]}        [description]
     */
    fillData: function(result) {
        if (result.data.code != 200) return;
        if (result.data.homedata.data) {
            let data = result.data

            let currentWeight = parseFloat(data.homedata.data.signin.weight)//当前体重
            let targetWeight = parseFloat(data.homedata.data.userinfo.target)//目标体重
            let weight = parseFloat(data.homedata.data.userinfo.current)//原始体重

            let remainWeight = currentWeight - targetWeight;
            let persent = (weight - currentWeight) * 100 / (weight - targetWeight)

            if (persent <= 0 || persent > 100) {
                persent = 0
            }

            this.getRecommendWeight(data.homedata.data.userinfo.height)
            this.setData({
                avatarUrl: data.homedata.data.userinfo.Img,
                nickName: data.homedata.data.userinfo.nickName,
                createTime: data.homedata.data.userinfo.createdAt,
                countinueSign: data.homedata.data.continuitysigncount,
                theHightest: data.homedata.data.thehighest,
                totalSign: data.homedata.data.totalsigncount,
                countinueRank: data.mysing.ranking,
                totalRank: data.mysing.ranking2,
                height: data.homedata.data.userinfo.height,
                weight: data.homedata.data.userinfo.current,
                currentWeight: data.homedata.data.signin.weight,
                targetWeight: data.homedata.data.userinfo.target,
                remainWeight: remainWeight.toFixed(1),
                persent: persent,
                isBindPhone: app.globalData.userCenter.mobile != "0"

            })
        } else {
            this.setData({
                calorie: 0, //卡路里
            })
        }
    },

    /**
     * 计算建议体重
     * @param  {[type]} height [description]
     * @param  {[type]} sex    [description]
     * @return {[type]}        [description]
     */
    getRecommendWeight: function(height) {
        let sex = app.globalData.userCenter.sex
        var recommendWeight = {}
        var weight = 0
        if (sex == 0) {
            weight = (height - 80) * 7 / 10
            recommendWeight = {
                start: (weight * 0.9).toFixed(0),
                end: (weight * 1.1).toFixed(0)
            }
        }
        if (sex == 1) {
            weight = (height - 70) * 6 / 10
            recommendWeight = {
                start: (weight * 0.9).toFixed(0),
                end: (weight * 1.1).toFixed(0)
            }
        }
        this.setData({
            recommendWeight: recommendWeight
        })
    },


    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },


    /**
     * 点击用户设置进入用户设置页面
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    bindClickConfig: function(e) {
        wx.navigateTo({
            url: "userconfig/userconfig"
        })
    },

    /**
     * 设置新目标,对目标和当前体重做出判断，目标>体重 则弹出对话框提示
     * @return {[type]} [description]
     */
    bindNewTarget: function(e) {
        let current = this.data.currentWeight
        let start = this.data.recommendWeight.start || 50
        let end = this.data.recommendWeight.end || 60
        let tempUrl = ""
        if(this.data.remainWeight > 0){
            tempUrl = `./targetconfig/targetconfig?start=${start}&end=${end}&finish="no"`
        }else{
            tempUrl = `./targetconfig/targetconfig?start=${start}&end=${end}&finish=yes&current=${current}`
        }
        
        wx.navigateTo({
            url: tempUrl
        })
    },

    /**
     * wx.request的二次封装
     * @param  {string} url   发送请求的url
     * @param  {object} param 传递的参数
     */
    updateInfo: function(url, param, appParam) {
        wx.request({
            url: url, //仅为示例，并非真实的接口地址
            data: param,
            method: "POST",
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {

            }
        })
    },

    getPhoneNumber: function(res) {
        let me = this
        wx.login({
            success: function(login) {
                let data = {
                    encryptedData: res.detail.encryptedData,
                    iv: res.detail.iv,
                    openid: app.getOpenid(),
                    code: login.code
                }
                wx.request({
                    url: url_getUserPhone,
                    method: "post",
                    data: data,
                    success: function(res) {
                        if (res.data.code == 200) {
                            wx.showLoading({
                                title: "綁定中···",
                                mask: true
                            })
                            app.isUserExist()
                            me.setData({
                                isBindPhone: true
                            })
                        } else if (res.data.code == 500) {

                        } else {
                            wx.showToast({
                                title: "\n程序出错啦！\n",
                                icon: "none",
                                duration: 2000
                            })
                        }
                    },
                    fail: function(errr) {
                        wx.showToast({
                            title: "\n程序出错啦！\n",
                            icon: "none",
                            duration: 2000
                        })
                    }
                })

            }
        })
    }

})