

let option = function (obj) {
  //return 请求数据
  let z = obj.z,
  o = {
    color: ['#37a2da', '#32c5e9', '#67e0e3'],
    tooltip: {
      show: true,
      trigger: 'axis',
      showContent: true,
      axisPointer: {     // 坐标轴指示器，坐标轴触发有效
        show: true,
        color: 'black',
        type: 'line', // 默认为直线，可选为：'line' | 'shadow' | ;corss
        lineStyle: {  //选择器线条样式
          type: 'dashed',//可选 'solid' | 'dashed' | 'dotted',
          color: 'black', 
        },
        trigger: 'axis',
        snap: true,
        label: {
          show: true,
          margin: 35 * z,
          backgroundColor: 'black',
          borderColor: '#ffffff'
        }
      }
    },
    grid: {
      show: false,
      left: 30 * z,
      right: 20 * z,
      bottom: 15 * z,
      top: 40 * z,
      width: 656 * z,
      height: 464 * z,
      containLabel: true
    },
    xAxis: [
      {
        show: true,
        type: 'category',
        axisLine: {
          label: { onZero: true },
          lineStyle: {
            color: 'transparent',
            // color:'black',
            width: 1
          }
        },
        axisLabel: {
          color: '#ffffff',
          margin: 20 * z
        },
        axisPointer:{
          label: { show: true, color:'#FFB218', backgroundColor:'#ffffff',}
        },
        data: obj.day
      }
    ],
    yAxis: [
      {
        show: true,
        type: 'value',
        axisTick: { show: false },
        axisLine: {
          lineStyle: {
            color: '#999999'
          }
        },
        axisLabel: {
          color: '#666666',
        }
      }
    ],
    series: [
      {
        type: 'line',
        smooth: true, //是否使用平滑曲线
        symbolSize: 2,
        label: { //拐点文字样式  坐标
          show: true,
          position: 'top'
        },
        itemStyle: { //拐点图像样式
          color: "black",
          borerWidth: 0
        },
        data: obj.data,
      }
    ]
  };
  obj.modify ? obj.modify(o) : null;
  return o
}

module.exports = option;

