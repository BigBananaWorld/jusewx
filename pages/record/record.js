/**
 * 打卡页面
 */
const configHost = require('../../config.js');
const app = getApp()
let url_singshare = configHost.service.host + "/zmlSignin/singshare"
Page({
    data: {
        totalTime: [],
        countiueTime: [],
        totalRank: 0,
        countiueRank: 0,
        myTotaltime: {},
        myCountinueTime: {},
        currentItem: 0,
        swiperHeight: 720,
        totalTimeHeight: 720,
        countiueTimeHeight: 720,
        showButton: false,
        total_pageindex: 1,
        countinue_pageindex: 1,
        pageSize: 20,
        backImage: "https://xcx.zmelo.com/xcxzml/activity/backpg.png" //背景图片
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.startTime = new Date()
        this.checkFromShare(options)
    },

/**
 * 判断是否为分享场景
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
    checkFromShare: function(options) {
        if (options.openId) {
            this.setData({
                showButton: true
            })
            wx.hideTabBar()
        }
        this.openid = options.openId || app.globalData.userCenter.openid
    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        let me = this
        this.getRankInfo(1, me.data.total_pageindex);
        this.getRankInfo(2, me.data.countinue_pageindex);
    },

    /**
     * 页面隐藏超过5分钟则自动刷新一次
     */
    onShow: function() {
        this.endTime = new Date()
        let minutes = (this.endTime.getTime() - this.startTime.getTime())/(1000*60)
        if(minutes >= 5){
            this.onPullDownRefresh()
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        this.startTime = new Date()
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function(e) {
        if (this.data.currentItem == 0) {
            this.getRankInfo(1, this.data.total_pageindex)
        } else {
            this.getRankInfo(2, this.data.countinue_pageindex)
        }
    },

    onPullDownRefresh: function(e) {
        this.setData({
            totalTime: [],
            countiueTime: [],
            total_pageindex: 1,
            countinue_pageindex: 1,
            totalRank: 0,
            countiueRank: 0
        })

        let me = this
        this.getRankInfo(1, me.data.total_pageindex);
        this.getRankInfo(2, me.data.countinue_pageindex);
    },

    /*
     * 页面变换回调
     */
    bindChange: function(e) {
        let current = (e.detail).current
        if (current == 0) {
            this.setData({
                currentItem: current,
                swiperHeight: this.data.totalTimeHeight
            })
        } else {
            this.setData({
                currentItem: current,
                swiperHeight: this.data.countiueTimeHeight
            })
        }

    },
    /*
     * 导航点击
     */
    bindChangeCurrent: function(e) {
        this.setData({
            currentItem: e.target.dataset.current
        })

    },

    /**
     * 点击 我要挑战 后显示tarbar,隐藏按钮,跳转到索引页
     * @return {[type]} [description]
     */
    bindGoIndex: function() {
        this.setData({
            showButton: false
        })
        wx.showTabBar()
        wx.switchTab({
            url: "/pages/index/index"
        })
    },

    /**
     * 跳转到活动页面,页面为外部h5页面
     * @return {[type]} [description]
     */
    bindShowActivityPage: function(){
        wx.navigateTo({
            url : "webPage/webPage"
        })
    },

    /**
     * 获取用户排名信息
     * @param  {number} type 需要的排名类型type:1 总签到 2 连续签到
     * @param  {number} page 页数
     * @return {[type]}      [description]
     */
    getRankInfo: function(type, page) {
        wx.showNavigationBarLoading()
        let me = this
        wx.request({
            url: url_singshare, //仅为示例，并非真实的接口地址
            data: {
                openid:app.getOpenid(),
                type: type,
                pageindex: page
            },
            method: "POST",
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                let myTimeObj = {}
                //组装用户自己的信息对象
                let tempMytime = res.data.mysing

                if (tempMytime) {
                    myTimeObj = {
                        rank: tempMytime.num,
                        nickName: tempMytime.nickName,
                        photo: tempMytime.Img,
                        totalsigncount: tempMytime.totalsigncount,
                        continuitysigncount: tempMytime.continuitysigncount
                    }
                }

                //组装列表数组的信息,因为后端返回了所有数据，然后与对应数组进行拼接
                let tempTime = res.data.data.rows
                if (tempTime.length > 0) {
                    ++page
                }
                let tempTimeArr = (type == 1 ? me.data.totalTime : me.data.countiueTime)
                let tempRank = (type == 1 ? me.data.totalRank : me.data.countiueRank)
                let tempNewTimeArr = []
                tempTime.forEach(function(val, index) {
                    let userinfo = val.userinfo
                    tempRank += 1 //排名叠加
                    let tempObj = {
                        rank: tempRank,
                        nickName: !!userinfo ? userinfo.nickName : "",
                        photo: !!userinfo ? userinfo.Img : "",
                        totalsigncount: val.totalsigncount,
                        continuitysigncount: val.continuitysigncount
                    }
                    tempNewTimeArr.push(tempObj)
                })

                tempTimeArr.push.apply(tempTimeArr, tempNewTimeArr)
                let tempHeight = 122 * (tempTimeArr.length) + 140 //列表的长度

                if (type == 1) {
                    me.setData({
                        myTotaltime: myTimeObj,
                        totalTime: tempTimeArr,
                        totalTimeHeight: tempHeight,
                        swiperHeight: tempHeight,
                        total_pageindex: page,
                        totalRank: tempRank
                    })
                }
                if (type == 2) {
                    me.setData({
                        myCountinueTime: myTimeObj,
                        countiueTime: tempTimeArr,
                        countiueTimeHeight: tempHeight,
                        swiperHeight: tempHeight,
                        countinue_pageindex: page,
                        countiueRank: tempRank
                    })
                }
                wx.hideNavigationBarLoading()
                wx.stopPullDownRefresh()
            }
        })
    }
})