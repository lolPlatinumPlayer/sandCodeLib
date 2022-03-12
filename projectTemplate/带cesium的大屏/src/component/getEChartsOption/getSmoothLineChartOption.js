import * as echarts from 'echarts/core';

/* 
数据要求（chartData属性要求）：
- xAxisLabelTextList：x轴文本列表
- lineDataList：[{
    name: 线条的名称
    valList: 线条各值的列表（值的数量与x轴文本的数量一致）
  }]
*/
export default function getSmoothLineChartOption(
  {chartData},
  {
    xAxis,yAxis,
    colorList=defaultColorList,
    option,
  }={}
) {
  return {
    color: colorList.map(x=>x.solidColor),
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: chartData.lineDataList.map(x=>x.name),
      icon: 'roundRect',
      itemWidth :8,
      itemHeight:8,
      itemGap:30,
      textStyle:{
        color:'white'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '7%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: chartData.xAxisLabelTextList,
        axisTick: { show: false },
        axisLine: {
          lineStyle: {
            color: '#306269',
            width:2
          },
        },
        axisLabel: {
          interval: 0,
        },
        ...xAxis,
      }
    ],
    yAxis: [
      {
        type: 'value',
        splitLine: {
          lineStyle: {
            color: '#306269',
            opacity: 0.2,
          },
        },
        ...yAxis,
      }
    ],
    series: chartData.lineDataList.map((lineData,lineIdx)=>{
      return{
        name: lineData.name,
        type: 'line',
        smooth: true,
        showSymbol: false,
        areaStyle: {
          opacity: 1,
          color: colorList[lineIdx%colorList.length].areaColor
        },
        emphasis: {
          focus: 'series'
        },
        data: lineData.valList
      }
    }),
    backgroundColor: 'rgba(0,0,0,0)',
    ...option,
  }
}

var defaultColorList=[
  {
    solidColor:'#fb6a0b',
    areaColor:new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
      offset: 0,
      color: 'rgba(251, 105, 5, .3)'
    }, {
      offset: 1,
      color: 'rgba(251, 105, 5, 0)'
    }]),
  },
  {
    solidColor:'#fedd0e',
    areaColor:new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
      offset: 0,
      color: 'rgba(255, 222, 0, .3)'
    }, {
      offset: 1,
      color: 'rgba(255, 222, 0, 0)'
    }]),
  },
  {
    solidColor:'#209aff',
    areaColor:new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
      offset: 0,
      color: 'rgba(34, 154, 255, .3)'
    }, {
      offset: 1,
      color: 'rgba(34, 154, 255, 0)'
    }]),
  },
]