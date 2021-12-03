<template>
  <scroll-view class="StationLine" :scroll-x="nameList.length>7" id="StationLine">
    <div 
      class="container"
      :style="{ width: colWidthPx * nameList.length + 'px' }"
    >
      <div 
        class="line" 
        :style="{width:colWidthPx * (nameList.length-1) + 'px' }"
      >
        <div 
          class="dot" 
          v-for="i in dotNum" 
          :key="i"
        ></div>
        <div 
          class="highLightLine" 
          :style="highLightLineStyle"
        ></div>
      </div>
      <div class="body clear">
        <div
          class="col"
          v-for="(name, i) in nameList"
          :class="{ selected: i === highLightStartIdx }"
          :style="{ width: colWidthPx + 'px' }"
          :key="i"
        >
          <div class="icoBox">
            <div v-if="i === 0" class="cnIco green">始</div>
            <div v-if="i === nameList.length - 1" class="cnIco orange">终</div>
          </div>
          <div
            class="point"
            :class="getDotType(i)"
          >
            <div class="dot"></div>
          </div>
          <div class="text">
            <div class="idx">
              {{ i + 1 }}
            </div>
            <div class="name">
              {{ name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </scroll-view>
</template>

<script>
export default {
  name: "StationLine",
  props: {
    highLightStartIdx: {
      type: Number,
      default: 2,
    },
    highLightEndIdx: {
      type: Number,
      default: 4,
    },
    nameList: {
      type: Array,
      default: () => [
        "宁德",
        "宁德",
        "宁德",
        "宁德",
        "宁德",
        "宁德",
        "宁德",
        "宁德",
        "宁德",
        "宁德",
        "宁德",
      ],
    },
  },
  components: {},
  data() {
    return {
      colWidthPx: undefined,
      dotNum:undefined,
      highLightLineStyle:{},
    };
  },
  mounted() {
    const query = uni.createSelectorQuery().in(this);
    const el = query.select("#StationLine");
    el.boundingClientRect(({ width }) => {
      const len=this.nameList.length
      if(len>7){
        this.colWidthPx = Math.round(width / 7);
      }else{
        this.colWidthPx = Math.ceil(width / len);
      }
      this.getDotNum()
      this.getHighLightLineStyle()
    }).exec();
  },
  methods: {
    getDotNum(){
      const DENSITY=8
      this.dotNum= Math.floor(this.colWidthPx * (this.nameList.length-1)/DENSITY)
    },
    getHighLightLineStyle(){
      const RADIUS=6
      const leftPx=this.colWidthPx/2+this.colWidthPx*this.highLightStartIdx-RADIUS
      const widthPx=this.colWidthPx*(this.highLightEndIdx-this.highLightStartIdx)+RADIUS*2
      this.highLightLineStyle={
        left:`${leftPx}px`,
        width:`${widthPx}px`,
        height:`${RADIUS*2}px`,
        borderRadius:`${RADIUS}px`,
      }
    },
    getDotType(i){
      if(i===this.highLightStartIdx||i===this.highLightEndIdx){
        return 'white small'
      }else{
        if(this.highLightStartIdx<i&&i<this.highLightEndIdx){
          return 'gray small'
        }else{
          const classList=['normal']
          if(i===0){
            classList.push('start')
          }else if(i===this.nameList.length - 1){
            classList.push('end')
          }
          return classList
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./cnIco.scss";

.StationLine {
  .container {
  }
  .line{
    height: 4rpx;
    margin:70rpx auto -74rpx;
    // background: rgba(90, 157, 246, 1);
    display: flex;
    align-items: center;
    justify-content: space-around;
    .dot{
      width: 6rpx;
      height: 6rpx;
      border-radius: 50%;
      background: #cccccc;
    }
    .highLightLine{
      position: absolute;
      background: rgba(90, 157, 246, 1);
    }
  }
  .body {
    .col {
      float: left;
      display: flex;
      flex-direction: column;
      align-items: center;
      $orange:#FF7621;
      &.selected{
        color:$orange;
      }
      .icoBox {
        height: 60rpx;
      }
      .point {
        position: relative;
        // 这个尺寸必须要比设计图大一些，不然在chrome下会歪掉
        width: 24rpx;
        height: 24rpx;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 26rpx;
        &.normal{
          border-radius: 50%;
          border: 2rpx solid #5a9df6;
          background: white;
          &.start{
            border-color: #999999;
            .dot{
              background: #6CC48D;
            }
          }
          &.end{
            border-color: #999999;
            .dot{
              background: $orange;
            }
          }
          .dot {
            width: 12rpx;
            height: 12rpx;
            background: #5a9df6;
          }
        }
        &.small{
          &.white .dot{
            width: 12rpx;height: 12rpx;
            background: #fff;
          }
          &.gray .dot{
            width: 12rpx;height: 12rpx;
            background: #c3dcfc;
          }
        }
        .dot {
          border-radius: 50%;
        }
      }
      .text {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 24rpx;
        text-align: center;
        .name {
          margin-top: 8rpx;
          writing-mode: vertical-rl;
        }
      }
    }
  }
}
</style>
