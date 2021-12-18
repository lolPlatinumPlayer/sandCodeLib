组件名：只读单选框
组件说明：不具有交互能力的单选框
版本：0.0.0 2021.12.07

<template>
  <span class="ReadOnlyRadio" :class="[isSelected ? 'selected' : 'unselected']">
    <span class="centerCircle"></span>
  </span>
</template>

<script>
export default {
  name: "ReadOnlyRadio",
  props: {
    isSelected: Boolean,
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
// 方块的样式
.ReadOnlyRadio {
  white-space: nowrap;
  cursor: pointer;
  outline: none;
  display: inline-block;
  line-height: 1;
  position: relative;
  vertical-align: middle;
  &.selected {
    .centerCircle {
      border-color: #409eff;
      background: #409eff;
      &::after {
        transform: translate(-50%, -50%) scale(1);
      }
    }
  }
  .centerCircle {
    border: 1px solid #9f9ea1;
    width: 12px;
    height: 12px;
    border-radius: 2px;
    background-color: #fff;
    position: relative;
    cursor: pointer;
    display: inline-block;
    box-sizing: border-box;
    &::after {
      width: 4px;
      height: 4px;
      border-radius: 30%;
      background-color: #fff;
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) scale(0);
      transition: transform 0.25s ease-in;
    }
  }
}

/* // elementUI的样式
.ReadOnlyRadio {
  white-space: nowrap;
  cursor: pointer;
  outline: none;
  display: inline-block;
  line-height: 1;
  position: relative;
  vertical-align: middle;
  &.selected {
    .centerCircle {
      border-color: #409eff;
      background: #409eff;
      &::after {
        transform: translate(-50%, -50%) scale(1);
      }
    }
  }
  .centerCircle {
    border: 1px solid #dcdfe6;
    border-radius: 100%;
    width: 18px;
    height: 18px;
    background-color: #fff;
    position: relative;
    cursor: pointer;
    display: inline-block;
    box-sizing: border-box;
    &::after {
      width: 4px;
      height: 4px;
      border-radius: 100%;
      background-color: #fff;
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) scale(0);
      transition: transform 0.15s ease-in;
    }
  }
} */
</style>
