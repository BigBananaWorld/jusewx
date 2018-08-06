/**
 * 打卡页面
 */
const app = getApp()
let nextUrl = "../step4/step4"
Page({
    data: {
        heightArray: [],
        heightValue: [],
        height: "",
        weightArray: [],
        weightValue: [55,0,0,0],
        weight: "",
        finishForm: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
         if(options.change){
             nextUrl = "../step4/step4?change=1"
        }
        var me = this;
        wx.getStorage({
            key: "basic-info",
            success: function(result) {//如果是新注册用户
                me.userInfo = result.data
            },
            fail: function(){//如果是修改目标
                me.userInfo = {}
            }
        })

        this.initPicker()

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
        var obj = Object.assign(that.userInfo, {
            height: that.data.height,
            weight: that.data.weight
        })
        wx.setStorage({
            key: "basic-info",
            data: obj
        })
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

/**
 * 初始化滚轮，主要是为了滚轮数据加载进去
 * @return {[type]} [description]
 */
    initPicker: function(){
        let heightArrayValue = []
        for(let i=0 ; i <= 280 ; i++){
            heightArrayValue.push(i);
        }

        let weightArrayValue = []
        for(let i=30 ; i <= 300 ; i++){
            weightArrayValue.push(i);
        }

          this.setData({
            heightArray:[heightArrayValue,["厘米"]],
            heightValue:[170,0],
            weightArray:[weightArrayValue,".", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],["公斤"]],
            weightValue:[50,0,2,0]
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    bindHeightChange: function(e) {
        let heightArray = this.data.heightArray;
        let index = e.detail.value
        let height = heightArray[0][index[0]]
        this.setData({
            height: height
        })
        this.checkForm()
    },

    bindWeightChange: function(e) {
        let weightArray = this.data.weightArray;
        let index = e.detail.value
        let weight = weightArray[0][index[0]] + + weightArray[2][index[2]] / 10
        this.setData({
            weight: weight
        })
        this.checkForm()
    },
    /**
     * 判断表单是否填写完成
     * @return {[type]} [description]
     */
    checkForm: function() {
        if (this.data.weight != "" && this.data.height != "") {
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
                weight: user.current,
                weightValue: this.numberToArray(user.current, true),
                height: user.height,
                heightValue: [user.height,0]
            })
            this.checkForm()
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
        return [temp[0]-30,0,temp[1],0]
    },
})