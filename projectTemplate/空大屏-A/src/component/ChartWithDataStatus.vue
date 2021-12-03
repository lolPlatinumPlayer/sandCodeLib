版本：0.0.1 2021.11.18

注意
- 不要用flex-grow给本组件布局又不上width或height（水平布局就要上width）  
  否则会出现『绘制图表比占用空间小』的问题  
  这个问题其实和本组件没关系  
  但凡对echarts图表进行这种布局都会出现该问题（echarts出现这情况没毛病，出问题的是布局的人）

<template>
  <div class="ChartWithDataStatus" v-loading="chartData==='数据加载中'">
    <div class="chartContainer" ref="chartContainer"></div>
    <div class="loadFail" v-if="chartData==='数据加载失败'">数据加载失败</div>
  </div>
</template>

<script>
import { isArr } from '@/utils/js';
import * as echarts from 'echarts/core';

const chartWithDataStatusMixin ={
  data() {
    return {
      tryDrawTime: 0, // 尝试绘制图表的次数
    }
  },
  watch: {
    chartData:{
      handler(chartData) {
        if (isArr(chartData)||typeof chartData==='object') {
          this.tryDrawTime++
          if (this.tryDrawTime === 1) {
            this.$nextTick(this.draw)
            window.addEventListener('resize', this.draw)
          }else{
            this.draw()
          }
        }
      },
      immediate:true,
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.draw)
  },
}

export default {
  name: 'ChartWithDataStatus',
  props: {

    /* 
    可渲染数据用数组或对象类型，状态用枚举字符串
    字符串枚举值如下
    - '数据加载中'
    - '数据加载失败'
    */
    chartData: [String,Array,Object],

    getOption:{
      type:Function,
      require:true,
    },
    /* 
    是否使用『初始动画模式』

    用这个模式会有以下不同
    - 保证了初始动画的执行
      （不用这个模式的话大部分时候初始动画不会出现，原因不明）
    - 每隔一段时间会执行一次初始动画
    */
    isUseInitAnimationMode:{
      type:Boolean,
      default:false
    },
    // 播放初始动画的时间间隔（单位：毫秒）
    timeInterval:{
      type:Number,
      default:10*1000,
    },
    // 传入echarts.init的配置
    initConfig:Object,
  },
  mixins: [chartWithDataStatusMixin],
  /* 
  非响应式内容如下

  - timer
  */
  data() {
    return {
      echartsInstance: null, // 存在组件实例里，增强自适应的健壮性
    };
  },
  mounted() {
    if(this.isUseInitAnimationMode){
      this.$watch('chartData',function (chartData) {
        if (isArr(chartData)||typeof chartData==='object') {
          this.$nextTick(this.initAnimation)
        }
      })
      this.timer=setInterval(this.initAnimation,this.timeInterval)
    }
  },
  destroyed(){
    clearInterval(this.timer)
  },
  methods: {
    draw() {
      if(this.echartsInstance===null){
        this.echartsInstance = echarts.init(this.$refs.chartContainer, 'dark',this.initConfig);
      }
      this.echartsInstance.setOption(this.getOption(this));
      this.echartsInstance.resize();
    },
    initAnimation(){ // 调用初始化动画
      this.echartsInstance.clear()
      this.echartsInstance.setOption(this.getOption(this));
    },
  },
};

</script>

<style lang="less">
.ChartWithDataStatus{
  position: relative;
  display:flex;
  .chartContainer{
    flex-grow:1;
  }
  .loadFail{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    text-align: center;
  }
}
</style>