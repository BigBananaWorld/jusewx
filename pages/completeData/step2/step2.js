/**
 * 打卡页面
 */
const app = getApp()
var currentDate = app.globalData.req_.timeStamp(Date.parse(new Date()))
let nextUrl = "../step3/step3"
Page({
    data: {
        birthday: app.globalData.req_.changeTimeToCh(currentDate),
        birthdayVal:currentDate,
        today: currentDate,
        classSex: 1,
        finishForm: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        if(options.change){
             nextUrl = "../step3/step3?change=1"
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        this.fillData()
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
        var that = this;
        wx.setStorage({
            key: "basic-info",
            data: {
                sex : that.data.classSex,
                birthday : that.data.birthdayVal
            }
        })
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
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    bindDateChange: function(e) {
        this.setData({
            birthdayVal: e.detail.value,
            birthday: app.globalData.req_.changeTimeToCh(e.detail.value)
        })
        this.checkForm();
    },

    bindChangeSex: function(e) {
        var sex = e.target.dataset.sex
        if (sex === "man") {
            this.setData({
                classSex: 0
            })
        }
        if (sex === "female") {
            this.setData({
                classSex: 1
            })
        }
    },

    /**
     * 判断表单是否填写完成
     * @return {[type]} [description]
     */
    checkForm: function() {
        if (this.data.birthday != "") {
            this.setData({
                finishForm: true
            })
        }
    },
    /*
     *进入下一个页面，通过finishForm参数判断
     */
    goNext: function(e) {
        if (this.data.finishForm) {
            wx.navigateTo({
                url: nextUrl
            })
        }
    },

    fillData: function(){
        let user = app.globalData.userCenter

        if(user.uuid){
            this.setData({
                classSex: user.sex,
                birthday: app.globalData.req_.changeTimeToCh(tempBirthday),
                birthdayVal: user.birthday
            })    
        }
        this.checkForm()
    }
})