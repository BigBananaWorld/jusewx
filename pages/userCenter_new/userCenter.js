/**
 * 我的
 */
const app = getApp()

const configHost = require('../../config.js');

let url_update = configHost.service.host + "/userCenter/updatinfo";

//let url_update = "http://10.10.10.104:9000/userCenter/updatinfo";

Page({
    data: {
        remainWeight: 1, //还需减少的体重
        weight: 0, //当前体重
        targetWeight: 80, //目标体重
        currentWeight: 80,
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
        // let result = app.globalData.userCenter
        // this.openid = result.openid;
        // this.setData({
        //     nickName: result.nickName,
        //     avatarUrl: result.Img || "https://xcx.zmelo.com/xcxzml/defaultImg.png",
        //     height: result.height,
        //     heightValue: [result.height, 0],
        //     birthdayVal: result.birthday,
        //     birthday: app.globalData.req_.changeTimeToCh(result.birthday),
        //     target: result.target,
        //     targetValue: this.numberToArray(result.target - 30, true),
        //     sex: result.sex
        // })
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
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function(e) {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    /**
     * 性别改变
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    bindSexChange: function(e) {
        let me = this
        let changeData = this.data.sexArray[e.detail.value].value;
        app.globalData.userCenter.sex = changeData
        if (changeData != this.data.sex) {
            this.setData({
                sex: changeData
            })
            this.updateInfo(url_update, {
                openid: me.openid,
                data: JSON.stringify({ sex: changeData })
            })

        }
    },

/**
 * 点击用户设置进入用户设置页面
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
    bindClickConfig: function(e){
        wx.navigateTo({
            url: "userconfig/userconfig",

            fail: function(e){
                console.log(e)
            },
            complete: function(){
                
            }
        })
    },


    /**
     * 将数字转化成固定长度的数组
     * @param  {number/string} num 转换的数字
     * @param  {num} len [生成数组的长度]
     * @param  {boolean} point [是否为小数]
     * @return {Array}  
     */
    numberToArray: function(num, point) {
        if ((typeof num) === "string") {
            num = parseFloat(num)
        }
        if (point) {
            num = num.toFixed(1)
        }

        let temp = (num + '').split(".")
        return [temp[0], 0, temp[1], 0]
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

    // bindTest: function(){
    //    wx.navigateTo({
    //   url : "../test/test"
    // })
    // }
})