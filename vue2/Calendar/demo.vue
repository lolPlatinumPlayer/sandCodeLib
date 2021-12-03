<template>
  <div class="test">
    <Calendar
      :type="type"
      :default-selected-date="defaultSelectedDate"
      @date-change="onDateChange"
      @touch-move-item-click="onTouchMoveItemClick"
    ></Calendar>
    <van-dropdown-menu>
      <van-dropdown-item
        v-model="type"
        :options="dropdownOptions"
      ></van-dropdown-item>
    </van-dropdown-menu>
  </div>
</template>

<script>
import Calendar from "./Calendar";

export default {
  name: "test",
  components: {
    Calendar,
  },
  data() {
    const defaultSelectedDate = new Date();
    // defaultSelectedDate.setDate(7)
    return {
      type: "day",
      defaultSelectedDate,
      dropdownOptions: [
        { text: "year", value: "year" },
        { text: "month", value: "month" },
        { text: "week", value: "week" },
        { text: "day", value: "day" },
      ],
    };
  },
  mounted() {
    window.test = this;
  },
  methods: {
    onDateChange(result) {
      console.log("date-change", result);
    },
    onTouchMoveItemClick(result) {
      console.log("touch-move-item-click", result);
    },
  },
};
</script>

<style lang="less"></style>
