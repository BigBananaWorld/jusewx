import * as echarts from '../../ec-canvas/echarts';
const configHead = require('../../config.js');
const getOption = require('./option.js');
const screen = wx.getSystemInfoSync();
const z = screen.screenWidth / 750;
const app = getApp()

Page({
    data: {
        startDate: false, //开始时间
        endDate: false, //结束时间
        ec: {
            lazyLoad: true
        },
        weightData: "",
        weightRecords: [], //体重记录
        weightDef: [50, ".", 0, '公斤'],
        tiweiData: '',
        tiweiRecords: [], //体围记录
        tiweiDef: [40, '.', 0, '厘米'],
        noData: true, //是否有数据
        screen: {},
        lineData: { //图表数据
            data: null,
            day: null
        },
        stepNum: {
            total: 0, //总步数
            average: 0, //平均 
            calorie: 0
        },
        select: null,
        selectType: null,
        selectTxt: {
            bust: "胸围",
            waist: "腰围",
            arm: '手臂围',
            hipline: '臀围',
            thigh: '大腿围',
            calf: '小腿围',
            weight: '体重',
            steps: '步数'
        },
        needEchart: true, //是否需要echarts图
        foodsRecords: [], //异常饮食数组
        pageindex: 1, //饮食页码
        pagesize: 10, //每页记录数
        hasStep: false,
        tempRecords: [] //临时保存饱和页码的数据
    },

    /* 生命周期函数--监听页面加载*/
    onLoad: function(options) {
        wx.hideLoading();
        wx.removeStorageSync("temp_date") //清理日历数据
        let that = this;
        let userinfo = wx.getStorageSync('userinfo')
        that.pickerInit()
        that.setData({
            userinfo: userinfo
        })
        that.add = that.selectComponent('#add') //注册添加体重组件
        that.lineComponment = that.selectComponent('#mychart-dom-multi-line');
        that.btn_draw(null, 'weight');
        app.getWeRunData(app.getOpenid()).then(() => {
            // me.btn_draw(null, me.data.select)
        })
    },

     /*生命周期函数--监听页面显示*/
     onShow: function() {
        let that = this;
        wx.getStorage({
            key: "temp_date",
            success: (e) => {
                console.log(e)
                let start = [e.data.startDate.slice(0, 4), e.data.startDate.slice(4, 6), e.data.startDate.slice(6)],
                    end = [e.data.endDate.slice(0, 4), e.data.endDate.slice(4, 6), e.data.endDate.slice(6)];
                console.log(start)
                console.log(end)   
                this.setData({
                    startDate: start,
                    endDate: end
                })
                if (that.data.startDate) { // 规定了时间段
                    that.data.select != "tiwei" ? that.btn_draw(null, that.data.select) : that.btn_draw(null, that.data.selectType);
                }
            },
            fail: function(){
                console.log("hh")
            }
        })
        
        if(this.data.select == "food"){
            this.changeFoodRecord()
        }else{
            this.btn_draw(null, this.data.selectType)
        }
        
    },


    /**
     * 切换导航栏时触发的事件
     * @param  {[type]} option   [description]
     * @param  {[type]} initData [description]
     * @return {[type]}          [description]
     */
    btn_draw: function(option, initData) {
        let theType = initData || option.currentTarget.dataset.type
        if (theType == 'steps' || theType == 'weight') {
            this.setData({
                select: theType,
                needEchart: true,
                tempRecords: [],
                pageindex: 1
            })
        } else {
            this.setData({
                select: 'tiwei',
                needEchart: true,
                tempRecords: [],
                pageindex: 1
            })
        }

        this.draw(option, initData)
    },
    draw: function(option, initData) {
        let that = this;
        let theType = initData || option.currentTarget.dataset.type;
        let userinfo = that.data.userinfo;
        let activityId = wx.getStorageSync('activity_id');
        let requestData = {
            'type': theType,
            openid: userinfo.openId,
            activity_id: activityId,
            pageindex: that.data.pageindex,
            pagesize: that.data.pagesize
        };
        let whatTimeIsIt = { startDate: that.data.startDate, endDate: that.data.endDate };
        if (whatTimeIsIt.endDate) {
            requestData.start = that.data.startDate.join("-");
            requestData.endtime = that.data.endDate.join("-");
        }
        that.setData({
            selectType: theType
        })
        wx.request({
            url: configHead.service.host + '/zmlSignin/getSing',
            data: requestData,
            method: 'POST',
            success: function(res) {
                if (res.data.code === 200) { //请求成功
                    that.fillData(that.data.select, res)

                    if (res.data.data.count == 0) { //判断是否有数据 
                        that.setData({ noData: true })
                        return
                    }

                    console.log(res)
                    that.setData({
                        startDate: res.data.data.rows[0].signdate.split('-'),
                        endDate: res.data.data.rows[res.data.data.rows.length - 1].signdate.split('-')
                    })

                    console.log(that.data.startDate)
                    console.log(that.data.endDate)
                    that.setData({ noData: false })
                    let data = [],
                        day = [],
                        theRows = res.data.data.rows;

                    if (res.data.data.count < 8) { //时间未超过一个星期
                        for (let i in theRows) {
                            data.push((theRows[i][theType]) * 1);
                            day.push(theRows[i].week);
                        }
                        that.initCharts({
                            data: data,
                            day: day,
                            modify: function(data) {
                                console.log(data)
                                data.yAxis[0].show = false;
                                data.xAxis[0].show = true;
                            }
                        })
                    } else { //时间超过一个星期
                        for (let i in theRows) {
                            data.push((theRows[i][theType]) * 1);
                            day.push(theRows[i].signdate.substr(5));
                        }
                        that.initCharts({
                            data: data,
                            day: day,
                            modify: function(res) {
                                res.yAxis[0].show = false;
                                res.xAxis[0].show = true;
                                res.xAxis[0].axisLabel.interval = data.length - 2;
                                res.series[0].markPoint = { //最大最小值的标记
                                    data: [{
                                        type: 'max',
                                        name: '最大值',
                                        symbol: 'circle',
                                        symbolSize: 8,  //拐点宽度
                                        itemStyle:{     //拐点样式
                                          borderWidth:2,
                                          borderColor:'#EC6864',
                                          borderType:'solid'
                                        },
                                        label: {
                                            show: true,
                                            distance: 4,
                                            position: 'top',
                                            color:'#EC6864',
                                            formatter: function(theMax) {
                                                let result,
                                                    theIndex = data.indexOf(theMax.value);
                                                if (theIndex == 0 || theIndex == data.length - 1) {
                                                    result = "";
                                                } else {
                                                    result = theMax.value
                                                }
                                                return result
                                            }
                                        }
                                    }, {
                                        type: 'min',
                                        name: '最小值',
                                        symbol: 'circle',
                                        symbolSize: 8,
                                        itemStyle: {     //拐点样式
                                          borderWidth: 2,
                                          borderColor: '#EC6864',
                                          borderType: 'solid'
                                        },
                                        label: {
                                            show: true,
                                            color:'#EC6864',
                                            distance:4,
                                            position: 'top',
                                            symbolSize: 8, //拐点宽度
                                            formatter: function(theMin) {
                                                let result,
                                                    theIndex = data.indexOf(theMin.value);
                                        
                                                if (theIndex == 0 || theIndex == data.length - 1) {
                                                    result = "";
                                                } else {
                                                    result = theMin.value;
                                                }
                                                
                                                return result
                                            }
                                        }
                                    }]
                                }
                            }
                        })
                    }
                }
            },
            fail: function(err) {
                console.log(err)
            }
        })
    },
    //图表
    initCharts: function(res) { //初始化charts
        let that = this,
            num = screen.z;
        let theChar = that.lineComponment.init((canvas, width, height) => {
            const lineChart = echarts.init(canvas, null, {
                width: width,
                height: height
            });
            // that.data.lineData
            lineChart.setOption(getOption({ z: z, day: res.day, data: res.data, modify: res.modify }))
            return lineChart
        })
    },
    /**
     * 页面切换到饮食记录
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    changeFoodRecord: function(e) {
        
        let me = this
        let type = "food"
        if(e){
            type = e.currentTarget.dataset.type;
        }
        
        this.setData({
            needEchart: false,
            select: type,
            tempRecords: [],
            pageindex: 1
        })

        // if (this.data.foodsRecords.length == 0) {
            wx.request({
                url: configHead.service.host + '/zmlHome/foodrecordList',
                data: {
                    openid: app.getOpenid(),
                    pageindex: me.data.pageindex,
                    pagesize: me.data.pagesize
                },
                method: 'GET',
                success(res) {
                    me.fillData(me.data.select, res)
                },
                fail: function(err) {
                    console.log(err)

                }
            })
        // }



    },

    /**
     * 按照当前页面选择需要填装的数据(主要是记录)
     * @param  {[type]} pageType [页面类型]
     * @param  {[type]} data     [填装数据]
     * @return {[type]}          [description]
     */
    fillData: function(pageType, data) {

        let that = this
        switch (pageType) {
            case "steps":
                if (data.data.count == 0) {
                    this.setData({
                        hasStep: false
                    })
                } else {
                    this.setData({
                        hasStep: true
                    })
                    this.step(data)
                }

                break;
            case "weight":
                let weightRows = data.data.record.rows
                let weightResult = this.getShowRecords(weightRows)
                this.setData({
                    weightRecords: weightResult
                })

                break;
            case "tiwei":
                let tiweiRows = data.data.record.rows
                let tiweiResult = this.getShowRecords(tiweiRows)
                this.setData({
                    tiweiRecords: tiweiResult
                })
                break;
            case "food":
                let foodRows = data.data.data.rows
                let foodResult = this.getShowRecords(foodRows)
                this.setData({
                    foodsRecords: foodResult
                })
                break;
        }
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        let me = this
        let activityId = wx.getStorageSync('activity_id');
        if (this.data.select == "weight" || this.data.select == "tiwei") {
            wx.request({
                url: configHead.service.host + '/zmlSignin/getSing',
                data: {
                    type: me.data.selectType,
                    openid: app.getOpenid(),
                    activity_id: activityId,
                    pageindex: me.data.pageindex,
                    pagesize: me.data.pagesize,
                    start: me.data.startDate.join("-"),
                    endtime: me.data.endDate.join("-")
                },
                method: 'POST',
                success: function(res) {
                    me.fillData(me.data.select, res)
                }
            })
        } else if (this.data.select == "food") {
            wx.request({
                url: configHead.service.host + '/zmlHome/foodrecordList',
                data: {
                    openid: app.getOpenid(),
                    pageindex: me.data.pageindex,
                    pagesize: me.data.pagesize
                },
                method: 'GET',
                success(res) {
                    me.fillData(me.data.select, res)
                },
                fail: function(err) {
                    console.log(err)

                }
            })
        }

    },

    /**
     * 获取最终显示的记录数组结果
     * @param  {[type]} rows [description]
     * @return {[type]}      [description]
     */
    getShowRecords: function(rows) {
        let result = [];
        if (rows.length < this.data.pagesize) {
            result = this.data.tempRecords.concat(rows)
        } else {
            this.data.tempRecords = this.data.tempRecords.concat(rows)
            result = this.data.tempRecords
            this.setData({
                pageindex: this.data.pageindex + 1
            })
        }
        return result;
    },

    /**
     * 开启微信运动权限
     * @return {[type]} [description]
     */
    bindOpenSportRight: function() {
        let me = this;
        app.getWeRunData(app.getOpenid()).then(() => {
            me.btn_draw(null, me.data.select)
        })
    },


    addWeight: function(option) { // 添加体重信息
        let that = this;
        let userinfo = that.data.userinfo;
        let theNum = option.detail.value[0] + 30 + option.detail.value[2] * 0.1;
        wx.request({
            url: configHead.service.host + '/zmlHome/updateSignin',
            data: {
                openId: userinfo.openId,
                data: JSON.stringify({ weight: theNum })
            },
            method: 'POST',
            success: function(res) {
                wx.showToast({
                    title: '添加成功!',
                    icon: 'success'
                })
                that.btn_draw(null, 'weight')
            },
            fail: function(res) {}
        })
    },
 

    step: function(data) { //步数换算卡路里
        let that = this;
        let total = 0, //总步数
            average = 0, //平均步数
            calorie = 0; //卡路里
        for (let i = 0; i < data.data.data.rows.length; i++) {
            total += data.data.data.rows[i].steps * 1
        }
        average = Math.ceil(total / data.data.data.count)
        calorie = Math.ceil(total * (1 / 20))
        that.setData({
            stepNum: {
                total: total,
                average: average,
                calorie: calorie
            }
        })
    },
    pickerInit: function() { //初始化picker组件值
        let theWeight = [],
            tiwei = [];
        theWeight[0] = [];
        tiwei[0] = [];
        for (let i = 30; i <= 300; i++) { //体重
            theWeight[0].push(i)
        }
        for (let i = 0; i < 200; i++) { //体围
            tiwei[0].push(i)
        }
        theWeight[1] = ".";
        tiwei[1] = '.';
        theWeight[2] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        tiwei[2] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        theWeight[3] = ["公斤"]
        tiwei[3] = ["厘米"]

        this.setData({
            weightData: theWeight,
            tiweiData: tiwei
        })
    },
    /*生命周期函数--监听页面初次渲染完成*/
    onReady: function() {

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

    bindRangeDate: function() {
        let that = this,
            startDate = that.data.startDate[0] + that.data.startDate[1] + that.data.startDate[2],
            endDate = that.data.endDate[0] + that.data.endDate[1] + that.data.endDate[2];
        wx.navigateTo({
            url: '/pages/record/calendar2/calendar2?type=range&startDate=' + startDate + '&endDate=' + endDate + '&theDef=1'
        })
    },


})