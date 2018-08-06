 Date.prototype.Format = function (fmt) { //author: meizz
      var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          "S": this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      return fmt;
    };

// 时间戳转换时间格式化
module.exports.timeStamp = (...arrays) => {
    let n = arrays[0];
    let date = new Date(n);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return (Y + M + D)

}

/**
 * 传入时间转为带年月日的格式
 * @param  {String} date 传入格式为2000-01-01
 * @return {String}      返回格式为2000年01月01日
 */
module.exports.changeTimeToCh = (date) => {
    let tempDateArr = date.split("-")
    let stringDate = ""
    tempDateArr.forEach(function(val, index) {
        var temp = "";
        switch (index) {
            case 0:
                temp = val + "年"
                break;
            case 1:
                temp = val + "月"
                break;
            case 2:
                temp = val + "日"
                break;
            default:
                break;
        }
        stringDate += temp
    })
    return stringDate
}

module.exports.changeTime = (date) => {
    let temp = date
    if((typeof date) !== "string"){
        temp = new String(date)
    }
    let year = temp.substring(0,4)
    let month = temp.substring(4,6)
    let day = temp.substring(6,8)
   return  year + '-' + month +'-' + day
}

//本地服务器地址**服务器地址

module.exports.localAndServerUrl = {
    localUrl: '',
    serverUrl: '',
}