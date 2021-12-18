组件名：单选表格

这个组件与element表格的不同处
1. 更改了单选表格的样式
2. 增加了返回选中行（row）数据的方法
3. 增加了取消选中行的方法

可提升空间
- 点击单选框时取消勾选

版本：0.0.0 2021.12.07

<template>
  <el-table
    class="RadioTable"
    ref="elTable"
    highlight-current-row
    v-bind="$attrs"
    @current-change="_onRadioChange"
  >
    <el-table-column width="55" align="center">
      <template slot-scope="scope">
        <component
          :is="readOnlyRadio || ReadOnlyCheckbox"
          :isSelected="selectedRow === scope.row"
        />
      </template>
    </el-table-column>
    <!-- <el-table-column label="序号" width="50px">
      <template slot-scope="{ $index }">{{ $index + 1 }}</template>
    </el-table-column> -->
    <slot></slot>
  </el-table>
</template>

<script>
import ReadOnlyCheckbox from "./ReadOnlyCheckbox";

export default {
  name: "RadioTable",
  props: {
    readOnlyRadio: null, // 单选框组件（要能接收isSelected prop来表示是否选中，而且是不能被用户交互的）
  },
  components: {},
  data() {
    return {
      selectedRow: null,
      ReadOnlyCheckbox,
    };
  },
  mounted() {
    for (const eventName in this.$listeners) {
      const listener = this.$listeners[eventName];
      this.$refs.elTable.$on(eventName, listener);
    }
  },
  methods: {
    _onRadioChange(currentRow, oldCurrentRow) {
      this.selectedRow = currentRow;
    },
    getSelectedRow() {
      return this.selectedRow;
    },
    resetSelect() {
      this.selectedRow = null;
      this.$refs.elTable.setCurrentRow();
    },
  },
  inheritAttrs: false,
};
</script>

<style lang="scss">
.RadioTable .cell {
  text-align: center;
}
</style>
