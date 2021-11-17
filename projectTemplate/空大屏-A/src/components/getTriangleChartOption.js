
/* 
chartData数据描述
[
  {
    val 必填
    name 必填
    rgb 可选 示例：[255,0,0]
  }
]

valColor描述
可选
用来指定三角形顶部数值的颜色
直接传给echarts
*/
export default function getTriangleChartOption(
  {chartData},
  {valColor,yAxisName,grid,}={}, //个性化配置
) {

  const seriesData = chartData.map((x) => {
    let rgb=x.rgb||[1,230,242]

    let labelColor
    if (valColor) {
      labelColor = valColor
    } else {
      labelColor = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`
    }

    return {
      value: x.val,
      itemStyle: {
        color:getGradientColor(...rgb),
      },
      label: {
        color: labelColor,
      },
    }
  })

  return {
    grid: {
      left: grid?.left??'1%',
      right: grid?.right??'5%',
      bottom: grid?.bottom??'10%',
      top: grid?.top??'15%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'none',
      },
      formatter: function(params) {
        return params[0].name + ': ' + params[0].value
      },
    },
    xAxis: {
      data: chartData.map((x) => x.name),
      axisTick: {show: false},
      axisLine: {
        lineStyle: {
          color: '#306269',
          width: 2
        },
      },
      axisLabel: {
        interval: 0,
        fontSize: 10,
      },
    },
    yAxis: {
      splitLine: {
        lineStyle: {
          color: '#306269',
          opacity: 0.2,
        },
      },
      name:yAxisName,
      nameGap:25,
      nameTextStyle:{
        align:'left',
      },
      boundaryGap:['0%', '18%'],
      // max({max:maxVal}){ // 可以保证三角形上的文本不超出坐标系，但是会导致有可能出现vzf『最后一个y轴数值不均匀的情况』
      //   /* if(!window.isIn){
      //     return
      //   } */
      //   let step
      //   if(maxVal<35){
      //     step=5
      //   }else if(maxVal<80){
      //     step=10
      //   }else if(maxVal<300){
      //     step=30
      //   }else{
      //     step=100
      //   }
      //   return Math.ceil(maxVal*1.2/step)*step
      // },
    },
    color: ['#e54035'],
    series: [
      {
        type: 'pictorialBar',
        symbol: 'triangle',
        data: seriesData,
        symbolSize: ['140%', '100%'],
        label: {
          show: true,
          position: 'top',
        },
      },
    ],
    backgroundColor: 'rgba(0,0,0,0)',
  }
}

function getGradientColor(r=1, g=230, b=242) {
  return {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      {
        offset: 0,
        color: `rgba(${r},${g},${b},1)`,
      },
      {
        offset: 1,
        color: `rgba(${r},${g},${b},0)`,
      },
    ],
  }
}