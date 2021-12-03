<template>
  <scroll-view class="StationLine" :scroll-x="nameList.length>7" id="StationLine">
    <div 
      class="container"
      :style="{ width: colWidthPx * nameList.length + 'px' }"
    >
      <div 
        class="line" 
        :style="{width:colWidthPx * (nameList.length-1) + 'px' }"
      ></div>
      <div class="body clear">
        <div
          class="col"
          v-for="(name, i) in nameList"
          :class="{ selected: i === markStationIdx }"
          :style="{ width: colWidthPx + 'px' }"
          :key="i"
        >
          <div class="icoBox">
            <div v-if="i === 0" class="cnIco green">始</div>
            <div v-if="i === nameList.length - 1" class="cnIco orange">终</div>
          </div>
          <div
            class="point"
            :class="{
              start: i === 0,
              end: i === nameList.length - 1,
            }"
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
    markStationIdx: {
      type: Number,
      default: 2,
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
    }).exec();
  },
  methods: {},
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
    background: rgba(90, 157, 246, 1);
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
        .point{
          border-color: $orange;
          .dot{
            background: $orange;
          }
        }
      }
      .icoBox {
        height: 60rpx;
      }
      .point {
        position: relative;
        // 这个尺寸必须要比设计图大一些，不然在chrome下会歪掉
        width: 24rpx;
        height: 24rpx;
        border-radius: 50%;
        box-sizing: border-box;
        border: 2rpx solid #5a9df6;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 26rpx;
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
          position: absolute;
          left: 50%;top: 50%;
          transform: translate(-50%,-50%);
          width: 12rpx;
          height: 12rpx;
          border-radius: 50%;
          background: #5a9df6;
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
