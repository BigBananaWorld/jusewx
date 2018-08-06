let configHead = require('../../config.js');
Page({
    data: {
        startDate: "", //开始时间
        endDate: "", //结束时间
        userDeit:{},
        pagesIndex:1,
        activity_id:null
    },
    toAddDeit: function(e) {
      let that = this;
        wx.navigateTo({
          url: 'addDeit/addDeit?foodname=' + (e.currentTarget.dataset.foodname || "") + '&counts=' + (e.currentTarget.dataset.counts || '') + '&date=' + (e.currentTarget.dataset.date || '') + '&unit=' + (e.currentTarget.dataset.unit || '') + '&uuid=' + (e.currentTarget.dataset.uuid || '') + '&activity_id=' + (that.data.activity_id),
        })
    },  
    /*生命周期函数--监听页面加载*/
    onLoad: function(options) {
      let  that = this,
           userMsg = wx.getStorageSync('userinfo');    //获取用户信息
           
      wx.removeStorageSync('temp_date');    //清除时间缓存
        that.setData({
          userInfo: userMsg
        })
      that.food = that.selectComponent('#food'); //  注册疑问提示框组件
      wx.request({
        url: configHead.service.host + '/zmlHome/foodrecordList', 
        data: { pageindex: 1, openid: userMsg.openId }, //openid,foodname, counts,unit, createdate ='YYYY-MM-DD', activity_id
        method:'POST',
        success:function(res){
          if(res.data.code===200){
            let startDate = res.data.startime.split('-'),
                endDate = res.data.endtime.split('-'),
                userdeit = Object.keys(res.data.datas).length!=0?res.data.datas:false;
            that.setData({
              userDeit: userdeit,
              startDate: startDate,
              endDate: endDate,
              activity_id: res.data.activity_id || null
            })
            wx.setStorageSync('temp_date', { startDate: startDate[0] + startDate[1] + startDate[2], endDate: endDate[0] + endDate[1] + endDate[2]})
          }
        }
      })
      let theTime = new Date()
    },
    refresh:function( obj ){   //刷新
      wx.showNavigationBarLoading() 
      let that = this,
          userInfo = that.data.userInfo,
          requestData = {
            pageindex: obj.pagesIndex,
            openid: userInfo.openId 
          };
      if (obj.startTime && obj.endTime ){
        requestData.start = obj.startTime;
        requestData.endtime = obj.endTime;
      }
      wx.request({
        url: configHead.service.host +'/zmlHome/foodrecordList',
        data: requestData,
        method:'POST',
        success(res){
          if (res.data.code === 200) {
            obj.func?obj.func(res):null;
          }
        },
        fail:function(err){
          console.log(err)
          wx.hideNavigationBarLoading();
        }
      })

    },
    bindCloseFood:function(){
      this.food.show();
    },
    /*生命周期函数--监听页面初次渲染完成*/
    onReady: function() {
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
      let that = this;
        wx.getStorage({
            key: "temp_date",
            success: (e) => {
              if (!e.data.endDate || !e.data.startDate){
                return
              } 
              let startDate = [e.data.startDate.slice(0, 4), e.data.startDate.slice(4, 6), e.data.startDate.slice(6)],
                  endDate = [e.data.endDate.slice(0, 4), e.data.endDate.slice(4, 6), e.data.endDate.slice(6)];
                this.setData({
                    startDate: startDate,
                    endDate: endDate,
                    pagesIndex:1
                })
                that.refresh({
                  startTime: startDate[0] + "-" + startDate[1] + "-" + startDate[2],
                  endTime: endDate[0] + "-" + endDate[1] + "-" + endDate[2],
                  pagesIndex:1,
                  func:function(res){
                    let dataKeys = Object.keys(res.data.datas).length;
                    if (dataKeys.length<1){
                      wx.hideNavigationBarLoading();
                      return
                    }
                    let userdeit = Object.keys(res.data.datas).length != 0 ? res.data.datas : false;
                    that.setData({
                      userDeit: userdeit
                    })
                    wx.hideNavigationBarLoading();
                  }
                })
            },
            fail:function(res){
              wx.hideNavigationBarLoading();
              console.log(res)
            }
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
        let that = this,
            startTime = that.data.startDate,
            endTime = that.data.endDate,
            pagesIndex = that.data.pagesIndex+1;
        that.refresh({
          startTime: startTime[0] + "-" + startTime[1] + "-" + startTime[2],
          endTime: endTime[0] + "-" + endTime[1] + "-" + endTime[2],
          pagesIndex:pagesIndex,
          func:function(res){
            let dataKeys = Object.keys(res.data.datas).length;
            if (dataKeys!=0){ // 接收的数据不为空
              let userDeit = that.data.userDeit,
                  neUserDeit = res.data.datas
              Object.assign(userDeit, neUserDeit)
              that.setData({                       
                pagesIndex: pagesIndex,                  //更新页数
                userDeit:userDeit
              })
              wx.hideNavigationBarLoading();
            }else{
              wx.hideNavigationBarLoading();
            }
          }
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    bindRangeDate: function() {
      let that =this,
          startDate = that.data.startDate[0] + that.data.startDate[1] + that.data.startDate[2],
          endDate = that.data.endDate[0] + that.data.endDate[1] + that.data.endDate[2];
        wx.navigateTo({
          url: '/pages/record/calendar2/calendar2?type=range&startDate=' + startDate + '&endDate=' + endDate +'&theDef=1'
        })
    }
  
})