/**
 * 打卡页面
 */
let nextUrl = "../step5/step5"
const app = getApp()
Page({
    data: {
        recommendWeight: {},
        weightArray: [],
        weightValue: [ 25, 0, 0, 0],
        weight: "",
        finishForm: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
         if(options.change){
             nextUrl = "../step5/step5?change=1"
        }
        var that = this;
        wx.getStorage({
            key: "basic-info",
            success: function(result) {
                that.userInfo = result.data;
                that.getRecommendWeight(result.data.height, result.data.sex)
            }
        })
        this.initPicker()
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
        var that = this;
        var obj = Object.assign(that.userInfo, {
            targetWeight: that.data.weight
        })
        wx.setStorageSync("basic-info", obj)
    },


/**
 * 初始化滚轮，主要是为了滚轮数据加载进去
 * @return {[type]} [description]
 */
    initPicker: function(){
        let weightArrayValue = []
        for(let i=30 ; i <= 300 ; i++){
            weightArrayValue.push(i);
        }

          this.setData({
            weightArray:[weightArrayValue,".", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],["公斤"]],
            weightValue:[30,0,0,0]
        })
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
        if (this.data.weight != "") {
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

    getRecommendWeight: function(height, sex) {
        if(!sex && sex!=0){
           sex = app.globalData.userCenter.sex 
        }
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
    }
})