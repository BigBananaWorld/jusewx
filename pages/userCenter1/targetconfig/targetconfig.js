/**
 * 打卡页面
 */
const app = getApp()
const configHost = require('../../../config.js');
let url_update = configHost.service.host + "/userCenter/updatinfo"

Page({
    data: {
        recommendWeight: {},
        weightArray: [],
        weightValue: [25, 0, 0, 0],
        weight: "",
        finishForm: false,
        finishTarget: false,
        tempWeight:10//临时体重，用于更新原始体重
    },

    /**
     * 生命周期函数--监听页面加载options
     * 有2种情况会进入该页面1、用户完成目标后 2、用户没完成目标重新设置目标体重
     */
    onLoad: function(options) {
        let finishTarget = false;
        if(options.finish == "yes"){
            finishTarget = true;
            this.setData({
                tempWeight: options.current
            })
        }
        this.setData({
            recommendWeight: {
                start: options.start,
                end: options.end
            },
            finishTarget: finishTarget
        })
        this.initPicker()
    },


    /**
     * 初始化滚轮，主要是为了滚轮数据加载进去
     * @return {[type]} [description]
     */
    initPicker: function() {
        let weightArrayValue = []
        for (let i = 30; i <= 300; i++) {
            weightArrayValue.push(i);
        }

        this.setData({
            weightArray: [weightArrayValue, ".", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                ["公斤"]
            ],
            weightValue: [30, 0, 0, 0]
        })
    },

    bindWeightChange: function(e) {
        let weightArray = this.data.weightArray;
        let index = e.detail.value
        let weight = weightArray[0][index[0]] + +weightArray[2][index[2]] / 10
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
    save: function(e) {
        let me = this
        if (this.data.finishForm) {
            let start = parseFloat(this.data.recommendWeight.start)
            let end = parseFloat(this.data.recommendWeight.end)
            let weight = parseFloat(me.data.weight)
            this.setData({
                weight :weight
            })
            if (weight < start || weight > end) {
                wx.showModal({
                    title: "",
                    content: "亲爱的，您设置的体重目标不在健康体重范围内，是否保存当前设置？",
                    cancelText: "返回设置",
                    confirmText: "保存",
                    confirmColor: "#FD6E6A",
                    success: function(e) {
                        if (e.confirm) {
                            me.updateUser()
                        }
                    }

                })
            }else{
                me.updateUser()
            }
        }
    },

    //更新用户信息，用户在达成目标后重新提交信息的时候用到
    updateUser: function() {
        let me = this
        let param = {}
        if(this.data.finishTarget){
           param = {
                target: this.data.weight,
                current: this.data.tempWeight 
            }
        }else{
            param = {
                target : this.data.weight
            }
        }
        
        wx.request({
            url: url_update,
            data: {
                openid: app.getOpenid(),
                data: JSON.stringify(param)
            },
            method: "POST",
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                app.globalData.userCenter.target = me.data.weight
                if (res.data.code == 200) {
                    wx.switchTab({
                        url: "/pages/userCenter1/userCenter"
                    })
                }
            },
            fail: function(e) {
                console.log(e)
            }
        })
    }
})