

let option = function (obj) {
  //return 请求数据
  let z = obj.z,
    o = {
      color: ['#37a2da', '#32c5e9', '#67e0e3'],
      tooltip: {
        show: false,
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
        left: '0',
        right: '2%',
        bottom: '10%',
        top: '4%',
        width: '96%',
        height: 340 * z,
        containLabel: true
      },
      xAxis: [
        {           //第一个x轴   显示时间
          show: true,
          type: 'category',
          axisTick:{
            show:false
          },
          splitLine: {      //坐标轴分割线
            show: true,
            lineStyle: {    //分割线的样式
              type: 'solid',
              color:'rgb(232,232,232)' //分割线颜色
            }
          },
          axisLine: {
            label: { onZero: false },
            lineStyle: {
              type:'solid',
              color:'rgb(253,110,106)',
              width: 1
            }
          },
          axisTick:{
            show:false,
            lineStyle:{
              type:'solid'
            }
          },
          boundaryGap:false,
          axisLabel: {      //轴线刻度的样式
            onZero:false,
            color: 'rgb(253,110,106)',
            margin: 32 * z,
            fontSize: (23*z)<10?10:23*z   
          },
          axisPointer: {
            label: { show: true, color: '#FFB218', backgroundColor: '#ffffff', }
          },
          data: obj.day
        },
        {         //第二个x轴  显示用户有没有打卡
          show: true,
          type: 'category',
          boundaryGap: false,  //刻度两端是否留白
          axisTick: {
            show: false
          },
          axisLabel: {      //轴线刻度的样式
            onZero: false,
            color: 'rgb(253,110,106)',
            margin: 56* z,
            // fontSize: (23 * z) < 10 ? 10 : 23 * z
          },
          axisLine: {
            label: { onZero: false },
            lineStyle: {
              type: 'solid',
              color: 'rgb(253,110,106)',
              width: 1
            }
          },
          axisTick: {
            show: false,
            lineStyle: {
              type: 'solid'
            }
          },
          data: axisTwo()
        } 
      ],
      yAxis: [
        {
          show: false,
          type: 'value',
          axisTick: { show: false },
          axisLine: {
            lineStyle: {
              color: 'rgb(253,110,106)',
            }
          },
          axisLabel: {
            onZero: false,
            color: 'rgb(253,110,106)',
          },
          max: function (value) {
            return value.max + 10;
          }
        }
      ],
      series: [
        {
          type: 'line',
          smooth: true, //是否使用平滑曲线
          symbolSize: 13*z,
          showAllSymbol: true,
          connectNulls:true,//是否链接中断了的数据
          label: { //拐点文字样式  坐标
            show: true,
            position: 'top',
            color:'rgb(253, 110, 106)'
          },
          itemStyle: { //拐点图像样式
            color: "#ffffff",
            borerWidth: 2,
            borderColor:'rgb(253,110,106)'
          },
          lineStyle:{
            type:'solid',
            color:'rgb(255,193,4)',
            width: 4,
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowBlur: 3,
            shadowOffsetY: 8
          },
          areaStyle:{
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'pink' // 0% 处的颜色 rgb(255,240,239)
              }, {
                offset: 1, color: 'yellow' // 100% 处的颜色
              }],
              globalCoord: false // 缺省为 false
            }
          },
          animation: false,
          data: obj.data,
        }
      ]
    };
  obj.modify ? obj.modify(o) : null;
  function axisTwo(){     //是否打卡标识
    let arr =  ['']
    for (let i=0;i<obj.signin_weight.length;i++){
      switch ((obj.signin_weight[i])*1) {
        case 0 :
          arr[i + 1] = { value: '十', textStyle: { color: 'rgb(253, 110, 106)', backgroundColor: 'rgb(253, 110, 106)', borderRadius: 50, fontSize:5}};
          break;
        case 1 :
          arr[i + 1] = { value: '十', textStyle: { color: 'rgb(255, 193, 4)', backgroundColor: 'rgb(255, 193, 4)', borderRadius: 50, fontSize: 5}};
          break;
      }
    } 
    arr[arr.length] = ''
    return arr
}
  return o
}

module.exports = option;

