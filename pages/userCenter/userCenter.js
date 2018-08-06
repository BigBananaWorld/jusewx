/**
 * 我的
 */
const app = getApp()

const configHost = require('../../config.js');

let url_update = configHost.service.host + "/userCenter/updatinfo";

//let url_update = "http://10.10.10.104:9000/userCenter/updatinfo";

Page({
    data: {
        avatarUrl: "https://xcx.zmelo.com/xcxzml/defaultImg.png",
        nickName: "暂无",
        sex: 1,
        sexArray: [{ key: "男", value: 0 }, { key: "女", value: 1 }],
        height: 160,
        heightArray: [],
        heightValue: [170,0],
        birthday: "1990年01月01日",
        target: 80,
        targetArray: [],
        targetValue: [50,0,0,0]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let heightArrayValue = []
        for(let i=0 ; i < 200 ; i++){
            heightArrayValue.push(i);
        }

        if(app.globalData.userCenter.sex == 0){
             this.setData({
                heightArray:[heightArrayValue,["厘米"]],
                heightValue:[170,0]
             })
        }else{
            this.setData({
                heightArray:[heightArrayValue,["厘米"]],
                heightValue:[160,0]
             })
        }

        let targetArrayValue = []
        for(let i=30 ; i < 300 ; i++){
            targetArrayValue.push(i);
        }

        if(app.globalData.userCenter.sex == 0){
             this.setData({
                targetArray:[targetArrayValue,".", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],["公斤"]],
                targetValue:[70,0,0]
             })
        }else{
            this.setData({
                targetArray:[targetArrayValue,".", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],["公斤"]],
                targetValue:[50,0,0]
             })
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
        let result = app.globalData.userCenter
        this.openid = result.openid;
        this.setData({
            nickName: result.nickName,
            avatarUrl: result.Img || "https://xcx.zmelo.com/xcxzml/defaultImg.png",
            height: result.height,
            heightValue: [result.height,0],
            birthdayVal: result.birthday,
            birthday: app.globalData.req_.changeTimeToCh(result.birthday),
            target: result.target,
            targetValue: this.numberToArray(result.target-30, true),
            sex: result.sex
        })
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
     * 身高改变
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    bindHeightChange: function(e) {
        let me = this
        let heightArray = this.data.heightArray;    
        let index = e.detail.value
        let changeData = heightArray[0][index[0]]

        app.globalData.userCenter.height = changeData
        if (changeData != this.data.height) {
            this.setData({
                height: changeData
            })
            this.updateInfo(url_update, {
                openid: me.openid,
                data: JSON.stringify({ height: changeData })
            })
        }
    },

    /**
     * 生日改变
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    bindBirthdayChange: function(e) {
        let me = this
        let changeData = e.detail.value
        app.globalData.userCenter.birthday = changeData
        if (changeData != this.data.birthdayVal) {
            this.setData({
                birthday: app.globalData.req_.changeTimeToCh(changeData),
                birthdayVal: changeData
            })
        }
        this.updateInfo(url_update, {
            openid: me.openid,
            data: JSON.stringify({ birthday: changeData })
        })

    },


    /**
     * 目标改变
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    bindTargetChange: function(e) {
        let me = this
        let targetArray = this.data.targetArray;
        let index = e.detail.value
        // let changeData = targetArray[0][index[0]] * 100 + targetArray[1][index[1]] * 10 + targetArray[2][index[2]] * 1 + targetArray[4][index[4]] / 10
        let changeData = targetArray[0][index[0]]+ targetArray[2][index[2]] / 10
        
        app.globalData.userCenter.target = changeData
        if (changeData != this.data.target) {
            this.setData({
                target: changeData,
                targetValue: this.numberToArray(changeData, true)
            })
            this.updateInfo(url_update, {
                openid: me.openid,
                data: JSON.stringify({ target: changeData })
            })
        }
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
        return [temp[0],0,temp[1],0]
    },

/**
 * wx.request的二次封装
 * @param  {string} url   发送请求的url
 * @param  {object} param 传递的参数
 */
    updateInfo: function(url, param,appParam) {
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