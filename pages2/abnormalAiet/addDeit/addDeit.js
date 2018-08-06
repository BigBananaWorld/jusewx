const configHead = require('../../../config.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    theDay:[],
    modify: 'modify',
    pushDeit: 'pushDeit',
    defData: null
  },
  bindShowCala: function (e) { //选择时间
    let that = this,
      theDay = e.detail.value.split('-');
    that.setData({
      theDay: theDay
    })

  },
  pushDeit: function (e) { //添加记录
    let theDeitMsg = e.detail.value;
    let that = this,
      foodname = theDeitMsg.foodName,
      counts = theDeitMsg.foodNum, //数量
      unit = theDeitMsg.company;   //单位
    let checktMsg = that.checktext([foodname, counts,unit ])
    if(checktMsg.flag){
        let activity_id = wx.getStorageSync('activity_id');
          wx.request({
            url: configHead.service.host + '/zmlHome/addfoodrecord',
            method: 'POST',
            data: {
              openid: that.data.userInfo.openId,
              foodname: foodname,
              counts: counts,
              unit: unit,
              createdate: that.data.theDay[0] + "-" + that.data.theDay[1] + "-" + that.data.theDay[2],
              activity_id: activity_id
            },
            success: function (res) {
              let toast
              if (res.data.code == 200) {
                toast = { title: '添加成功', icon: 'success' };
              } else {
                toast = { title: '添加失败', icon: 'none' };
              }
              wx.showToast({
                title: toast.title,
                icon: toast.icon,
                success() {
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 1000)
                }
              })
            }, fail: () => {
              wx.showToast({
                title: '添加失败,请稍后重试',
                icon: 'none',
                success() {
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 1000)
                }
              })
            }
          })
    }else{
      wx.showToast({
        title:checktMsg.msg,
        icon:'none'
      })
    }
  },
  dele: function () {
    let that = this;      //删除
    wx.showModal({
      title: '提示',
      content: '您确定删除该条记录吗?',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: configHead.service.host + '/zmlHome/destroyfood',
            method: 'POST',
            data: {
              uuid: that.data.defData.uuid
            },
            success: function (res) {
              wx.showToast({
                title: '已删除',
                icon: 'success',
                success() {
                  setTimeout(() => {
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 1000)
                }
              })
            }
          })
        }
      }
    })
  },
  modify: function (e) {
    let that = this,
      zheData = {
        foodname: e.detail.value.foodName.trim(),
        counts: e.detail.value.foodNum.trim(),
        unit: e.detail.value.company.trim(),
        createdate: that.data.theDay[0] + "-" + that.data.theDay[1] + "-" + that.data.theDay[2]
      };
    let checkMsg = that.checktext([zheData.foodname, zheData.counts, zheData.unit])
    if(!checkMsg.flag){
      wx.showToast({
        title: checkMsg.msg,
        icon:'none'
      })
      return
    }
    zheData = JSON.stringify(zheData);
    wx.request({
      url: configHead.service.host + '/zmlHome/updatefood',
      data: {
        openid: that.data.userInfo.openId,
        activity_id: that.data.activity_id,
        uuid: that.data.defData.uuid,
        data: zheData
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            success() {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            }
          })
        } else {
          wx.showToast({
            title: '修改失败,请稍后重试',
            icon: 'none',
            success() {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            }
          })
        }
      }, fail: function (res) {
        wx.showToast({
          title: '修改失败,请稍后重试',
          icon: 'none',
          success() {
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          }
        })
      }
    })
  },

  checktext: function (obj) {   //表单校验2  { foodname,counst,unit    }
    let that = this;
    let foodname = obj[0].trim(),
        counst = obj[1].trim(),
        unit = obj[2].trim();
    let counstFlag = isNaN(counst*1)
    if(!foodname || !counst || !unit || that.data.theDay.length !=3 ){ //判断是否为空
      return {
        msg:'请提交完整的信息',
        flag : false
      }
    } else if (counstFlag) {
      return {
        msg:'数量只能输入数字',
        flag:false
      }
    }else{
      return {flag : true}
    }

  },

  /*生命周期函数--监听页面加载*/
  onLoad: function (options) {
    let that = this,
      userInfo = wx.getStorageSync('userinfo');
    let defData = options,
    theDay = defData.date.split('-');
    if (defData.foodname && defData.counts && defData.date && defData.unit && defData.uuid) {
      defData.flag = true;
    } else {
      defData.flag = false;
    }
    var maxTime = new Date();
    var str = maxTime.getFullYear() + "-" + ((maxTime.getMonth() + 1) >= 10 ? +(maxTime.getMonth() + 1) : "0" + (maxTime.getMonth() + 1)) + "-" + ((maxTime.getDate()) >= 10 ? maxTime.getDate() : '0' + maxTime.getDate());
    that.setData({
      userInfo: userInfo,
      defData: defData,
      theDay: theDay,
      activity_id: options.activity_id,
      maxTime: str
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})