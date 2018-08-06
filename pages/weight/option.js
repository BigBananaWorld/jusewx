

let option = function (obj) {
  //return 请求数据
  let z = obj.z,
  o = {
    color: ['#37a2da', '#32c5e9', '#67e0e3'],
    animation:false,
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
          margin: 22 * z,   //指示器 距离x轴的距离
          backgroundColor: 'black',
          borderColor: '#ffffff'
        }
      }
    },
    grid: {
      show: false,
      left: 10 * z,
      right: 20 * z,
      bottom: 15 * z,
      top: 60 * z,
      width: 690 * z,
      height: 360 * z,
      // backgroundColor:'#ffffff',
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
          // color: '#EC6864',
          color:'#999999',
          margin: 20 * z
        },
        axisPointer:{
          label: { show: true, color:'red', backgroundColor:'#ffffff',}//获取焦点时的标注
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
        symbolSize: 5,
        connectNulls: true,//是否链接中断了的数据
        label: { //拐点文字样式  坐标
          show: true,
          color:'#EC6864',
          position: 'top',
          // distance: 4
        },
        lineStyle:{   //曲线阴影
          color:'#FFB94B',
          width:4,
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowBlur: 3,
          shadowOffsetY:8
        },
        // areaStyle: {
        //   origin:'start',
        //   color: {
        //     type: 'linear',
        //     x: 0,
        //     y: 0,
        //     x2: 0,
        //     y2: 1,
        //     colorStops: [{
        //       offset: 0, color: 'pink' // 0% 处的颜色
        //     }, {
        //         offset: 1, color: 'white' // 100% 处的颜色
        //     }],
        //     globalCoord: true // 缺省为 false
        //   }  //background:linear-gradient(red, #fff1f0 , #fff);
        // },
        itemStyle: { //拐点图像样式
          color: "#ffffff",
          borerWidth: 3,
          borderColor:'#EC6864'
        },
  
        data: obj.data,
      }
    ]
  };
  obj.modify ? obj.modify(o) : null;
  return o
}

module.exports = option;

