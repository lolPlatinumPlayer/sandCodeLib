<template>
  <div class="Pyramid">
    <template v-if="percentList && itemCenterPointList">
      <!--  中间的文本 -->
      <div
        class="itemLabel"
        v-for="(text, i) in percentList"
        :style="{
          left: itemCenterPointList[i][0] + 'px',
          top: itemCenterPointList[i][1] + 'px',
        }"
        :key="i"
      >
        {{ text }}
      </div>
    </template>
    <template v-if="sortedData && markLineEndPointList">
      <!--  左右的文本 -->
      <div
        :class="['markLineLabel', style.isLeft ? 'left' : 'right']"
        v-for="(style, i) in markLineEndPointList"
        :style="{
          left: style.point[0] + 'px',
          top: style.point[1] + 'px',
        }"
        :key="i"
      >
        <div class="name">{{ sortedData[i].name }}</div>
        <div class="value">{{ sortedData[i].value }}</div>
      </div>
    </template>
  </div>
</template>

<script>
import drawPyramid from './drawPyramid';

export default {
  name: 'Pyramid',
  props: {
    data: {
      type: Array,
      default() {
        return [
          { number: '0', name: '0-20岁' },
          { number: '3', name: '21~40岁' },
          { number: '0', name: '41~60岁' },
          { number: '2', name: '61~80岁' },
          { number: '0', name: '80岁以上' },
        ];
      },
    },
    itemColorList:Array,
    markLineXLen:Number, // 线条在x方向上投影的长度（单位：像素）
    pyramidWRatio:Number, // 金字塔在x方向上的占比
    pyramidHRatio:Number, // 金字塔在y方向上的占比
  },
  data() {
    return {
      sortedData: null,
      itemCenterPointList: null,
      markLineEndPointList: null,
      percentList: null,
    };
  },
  methods: {
    drawPyramidChart() {
      // 金字塔是个固定的图，不会随数据变化
      // 图由drawPyramid函数生成，这个函数不会提供任何文本
      this.sortedData = JSON.parse(JSON.stringify(this.data))
        .sort((a, b) => {
          return Number(a.number) - Number(b.number);
        })
        .map((x) => {
          return {
            name: x.name,
            value: Number(x.number),
          };
        });
      const { itemCenterPointList, markLineEndPointList } = drawPyramid({
        container:this.$el,
        itemNum:this.data.length,
        colorList:this.itemColorList,
        markLineXLen:this.markLineXLen,
        pyramidWRatio:this.pyramidWRatio,
        pyramidHRatio:this.pyramidHRatio,
      });
      this.itemCenterPointList = itemCenterPointList;
      this.markLineEndPointList = markLineEndPointList;
      const sum = this.sortedData.map((x) => x.value).reduce((a, b) => a + b);
      if (sum === 0) {
        this.percentList = this.sortedData.map((x) => {
          return '0%';
        });
      } else {
        this.percentList = this.sortedData.map((x) => {
          return Math.round((x.value / sum) * 10000) / 100 + '%';
        });
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.drawPyramidChart();
    });
  },
};
</script>

<style lang="less">
.Pyramid {
  position: relative;
  width: 300px;
  height: 300px;
  font-size: 12px;
  .itemLabel {
    position: absolute;
    transform: translate(-50%, -50%);
  }
  .markLineLabel {
    position: absolute;
    padding: 0 5px;
    &.left {
      text-align: right;
      transform: translate(-100%, -50%);
    }
    &.right {
      transform: translate(0, -50%);
    }
    .name {
      color: gray;
    }
  }
}
</style>
