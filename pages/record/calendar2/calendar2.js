const app = getApp()
var currentDate = app.globalData.req_.timeStamp(Date.parse(new Date()))

/**
 * bita版本，代码比较乱，需要优化,需要做成组件模块
 * @return {[type]}         [description]
 */
Page({
    /**
     * 页面的初始数据
     */
    data: {
        year: (new Date()).getFullYear(),
        currentData: currentDate.replace(/-/g, ""),
        startDate: "",
        endDate: "",
        selectedDate: "",
        scrollTo: "",
        type: "single", //日历类型
        date: [],
        today:currentDate.replace(/-/g, "")
    },

    dates: [],

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onLoad: function(option) {
        this.forIndex = option.from
        this.setData({
            type: option.type
        })
        if(option.theDef){    //与跳转过来的页面时间对接
          this.setData({
            startDate: option.startDate,
            endDate: option.endDate
          })
        }
    },

    onReady: function() {
        let me = this
        if (me.forIndex) {
            wx.getStorage({
                key: "temp_date_index",
                success: (e) => {
                    let currentDate = e.data.currentData
                    let dateObj = me.getDateObj(currentDate)
                    let month = parseInt(dateObj.month)
                    let need = this.dateData(dateObj.year)
                    this.setData(need)
                    this.fillData(currentDate)
                    this.setData({
                        scrollTo: "a" + month
                    })

                },
                fail: () => {
                    let need = this.dateData((new Date()).getFullYear())
                    this.setData(need)
                    this.fillData(currentDate.replace(/-/g, ""))
                    this.setData({
                        scrollTo: 'a' + ((new Date()).getMonth() + 1)
                    })

                }
            })
        } else {
            wx.getStorage({
                key: "temp_date",
                success: (e) => {
                    if (this.data.type == "single") {
                        let currentDate = e.data.currentData
                        let dateObj = me.getDateObj(currentDate)
                        let month = parseInt(dateObj.month)
                        let need = this.dateData(dateObj.year)
                        this.setData(need)
                        this.fillData(currentDate)
                        this.setData({
                            scrollTo: "a" + month
                        })

                    } else {
                        let start = e.data.startDate
                        let end = e.data.endDate
                        let dateObj = me.getDateObj(start)
                        let month = parseInt(dateObj.month)
                        let need = this.dateData(dateObj.year)
                        this.setData(need)
                        this.fillRangeData(start, end)
                        this.setData({
                            scrollTo: "a" + month
                        })
                    }
                },
                fail: () => {
                    if (this.data.type == "single") {
                        let need = this.dateData((new Date()).getFullYear())
                        this.setData(need)
                        this.fillData(currentDate.replace(/-/g, ""))
                        this.setData({
                            scrollTo: 'a' + ((new Date()).getMonth() + 1)
                        })
                    } else {
                        let need = this.dateData((new Date()).getFullYear())
                        this.setData(need)
                        this.fillRangeData(this.data.startDate, this.data.endDate)
                        this.setData({
                            scrollTo: 'a' + ((new Date()).getMonth() + 1)
                        })
                    }
                   
                }
            })
        }

 // this.fillSignData(["20180416", "20180415", "20180115", "20181115"]) //填装签到
        // this.fillData("20180416") 填装日期
        // this.fillRangeData("20180416" , "20181010") 填装日期范围

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    getDateObj: function(date) {
        let year = date.substring(0, 4)
        let month = date.substring(4, 6)
        let day = date.substring(6, 8)
        return {
            year: year,
            month: month,
            day: day
        }
    },
    /*
     * 填装日期
     */
    fillData: function(da) {
        this.setData({
            selectedDate: da
        })
    },
    /*
     * 填装范围日期
     */
    fillRangeData: function(start, end) {
        let tempDate = this.data.date

        tempDate.forEach((month, monthIndex, monthArr) => {
            month.forEach((day, dayIndex, dayArr) => {
                let tempDay = parseInt(day.date)
                if (tempDay >= start && tempDay <= end) {
                    monthArr[monthIndex][dayIndex].selected = 1;
                }
            })
        })

        this.setData({
            startDate: start,
            endDate: end,
            date: tempDate
        })
    },

    /*
     * 填装签到数据
     */
    fillSignData: function(arr) {
        let tempDate = this.data.date
        tempDate.forEach((month, monthIndex, monthArr) => {
            month.forEach((day, dayIndex, dayArr) => {
                let tempDay = parseInt(day.date)
                arr.forEach((item, index) => {
                    if (tempDay == parseInt(item)) {
                        monthArr[monthIndex][dayIndex].sign = true;
                    }
                })
            })
        })
        this.setData({
            date: tempDate
        })
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 绑定确定按钮事件
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    submitbtn: function(e) {
        if (this.forIndex) {
            wx.setStorage({
                key: "temp_date_index",
                data: {
                    currentData: this.data.currentData
                }

            })
        } else {
            wx.setStorage({
                key: "temp_date",
                data: {
                    currentData: this.data.currentData,
                    startDate: this.data.startDate,
                    endDate: this.data.endDate
                }
            })
        }


        wx.navigateBack({
            delta: 1
        })
    },

    /**
     * 绑定取消按钮
     * @return {[type]} [description]
     */
    cancel: function() {
        wx.navigateBack({
            delta: 1
        })
    },

    /**
     * 检查两个日期的连接
     * @param  {[type]} arr [description]
     * @return {[type]}     [description]
     */
    checkBetweenDate: function(arr) {
        let startDate = (parseInt(arr[0]) < parseInt(arr[1])) ? arr[0] : arr[1]
        let endDate = (parseInt(arr[0]) < parseInt(arr[1])) ? arr[1] : arr[0]
        let tempDate = this.data.date

        this.setData({
            startDate: startDate,
            endDate: endDate,
            date: tempDate
        })
    },

    selectday: function(e) {
        let monthIndex = (e.currentTarget.dataset).index
        let dayIndex = (e.currentTarget.dataset).indexs
        let temp = this.data

        temp.currentData = temp.date[monthIndex][dayIndex].date
        this.setData({
            date: temp.date,
            currentData: temp.currentData,
            selectedDate: temp.currentData
        })

        //判断日历类型 range范围选取 single单选
        if (this.data.type == "range") {
            if (this.dates.length < 2) {
                this.dates.push(temp.date[monthIndex][dayIndex].date)
                this.checkBetweenDate(this.dates)
            } else {
                this.setData({
                    startDate : "",
                    endDate: ""
                })
                this.dates = []
                this.dates.push(temp.date[monthIndex][dayIndex].date)
            }
        }

    },


    /**
     * 闰年判断
     * @param  {[type]}  year [description]
     * @return {Boolean}      [description]
     */
    isLeapYear: function(year) {
        if (((year % 4) == 0) && ((year % 100) != 0) || ((year % 400) == 0)) {
            return (true);
        } else {
            return (false);
        }
    },

    bindYearChange: function(e) {
        var need = this.dateData(e.detail.value)
        this.setData({
            year: e.detail.value
        })

        this.setData(need)
    },

    goToday: function() {
        let tempDate = new Date()

        var need = this.dateData(tempDate.getFullYear())
        this.setData({
            year: tempDate.getFullYear()
        })

        this.setData(need)
        this.setData({
            scrollTo: "a" + (tempDate.getMonth() + 1)
        })
    },

    dateData: function(showYear) {
        let dataAll = [] //总日历数据
        let dataAll2 = [] //总日历数据
        let dataMonth = [] //月日历数据
        let date = new Date()
        let year = date.getFullYear() //当前年
        let week = date.getDay(); //当天星期几
        let weeks = []
        let month = date.getMonth() + 1 //当前月份
        let day = date.getDate() //当天
        let daysCount = 1 //一共显示多少天
        let dayscNow = 0 //计数器
        let monthList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] //月份列表
        let nowMonthList = [] //本年剩余月份

        //计算当前月为止一共有多少天 
        
        if(showYear > year) {return}

        if(showYear < year){
            daysCount = 365 + this.isLeapYear()
        }

        if(showYear == year){
            for(let i = 1 ; i <= month ;i++){
            let tempDate = new Date(showYear,i,0)   
            daysCount += tempDate.getDate()
        }
        }
        
        

        let ss = year + "," + month + "," + day + "," + week

        for (let i = 1; i < 13; i++) {
            nowMonthList.push(i)
        }
        let yearList = [year] //年份最大可能
        for (let i = 0; i < daysCount / 365 + 2; i++) {
            yearList.push(year + i + 1)
        }

        let leapYear = function(Year) { //判断是否闰年 
            if (((Year % 4) == 0) && ((Year % 100) != 0) || ((Year % 400) == 0)) {
                return (true);
            } else { return (false); }
        }

        let checkSingleNum = function(num) {
            return num < 10 ? "0" + num : "" + num
        }


        let mList
        if (showYear == year) { //判断当前年份
            mList = nowMonthList
        } else {
            mList = monthList
        }

        for (let j = 0; j < mList.length; j++) { //循环月份
            dataMonth = []
            let t_days = [31, 28 + leapYear(showYear), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] //每个月的天数
            let t_days_thisYear = [] //当前年的天数
            if (showYear == year) {
                for (let m = 0; m < nowMonthList.length; m++) {
                    t_days_thisYear.push(t_days[mList[m] - 1])
                }
                t_days = t_days_thisYear
            } else {
                t_days = [31, 28 + leapYear(showYear), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
            }
            for (let k = 0; k < t_days[j]; k++) { //循环每天
                dayscNow++
                let nowData
                if (dayscNow < daysCount) { //如果计数器没满
                    let days = k + 1
                    if (days < 10) {
                        days = "0" + days
                    }

                    nowData = { //组装自己需要的数据
                        year: showYear,
                        month: mList[j],
                        day: k + 1,
                        date: showYear + "" + checkSingleNum(mList[j]) + days,
                        selected: 0,
                        re: showYear + "-" + mList[j] + "-" + days,
                        sign: false
                    }
                    dataMonth.push(nowData)

                    if (k == 0) {
                        let date = new Date(showYear + "-" + mList[j] + "-" + k + 1)
                        let weekss = date.getDay() //获取每个月第一天是周几
                        weeks.push(weekss)
                    }

                } else {
                    break
                }
            }
            dataAll.push(dataMonth)
        }

        for (let i = 0; i < dataAll.length; i++) {
            if (dataAll[i].length != 0) {
                dataAll2.push(dataAll[i]);
            }
        }

        return {
            date: dataAll2,
            weeks: weeks
        }

    },

   bindUpper: function(e){
    
   }
})