<template>
  <div :class="['Calendar', type + '-type']">
    <div class="header">
      <van-icon
        :class="{
          arrow: true,
          useless: !canLeftArrowBeUse,
          'arrow-left': true,
        }"
        name="arrow-left"
        @click="onLeftArrowClick"
      />
      <div class="text-area">
        <div
          :class="{
            leftText: true,
            useless: !canLeftArrowBeUse,
          }"
          v-if="type === 'year'"
          @click="onLeftArrowClick"
        >
          {{ year - 1 }}
        </div>
        <div class="centerText" @click="isShowPicker = true">
          {{ centerText }}
        </div>
        <div
          :class="{
            rightText: true,
            useless: !canRightArrowBeUse,
          }"
          v-if="type === 'year'"
          @click="onRightArrowClick"
        >
          {{ year + 1 }}
        </div>
      </div>
      <van-icon
        :class="{
          arrow: true,
          useless: !canRightArrowBeUse,
          'arrow-right': true,
        }"
        name="arrow"
        @click="onRightArrowClick"
      />
    </div>
    <div
      class="touch-move-item-list"
      v-if="type === 'day' || type === 'month' || type === 'week'"
      ref="touchMoveItemList"
    >
      <div
        :class="{
          'touch-move-item': true,
          selected: touchMoveItem.isSelect,
          notInSelectedParent: !touchMoveItem.isInSelectedParent,
          cannotClick: !touchMoveItem.canClick,
        }"
        v-for="touchMoveItem in touchMoveItemList"
        @click="onTouchMoveItemClick(touchMoveItem)"
      >
        <div v-if="type === 'day' || type === 'week'" class="name-in-week">
          {{ touchMoveItem.dayNameInWeek }}
        </div>
        <div class="item-val">
          <span>{{ touchMoveItem.val }}</span>
          <span class="month-unit" v-if="type === 'month'">月</span>
        </div>
        <div class="dot" v-if="touchMoveItem.isSelect"></div>
      </div>
    </div>
    <!--<board></board>-->

    <van-popup v-model="isShowPicker" position="bottom">
      <van-picker
        ref="picker"
        :title="pickerTitle"
        @cancel="isShowPicker = false"
        @confirm="onPickerConfirm"
        :columns="pickerColumns"
        show-toolbar
      ></van-picker>
    </van-popup>
  </div>
</template>

<script>
整理后的代码还没测试过【】
/*
 * - 中间显示的文本格式与呼出的picker类型是对应的
 *   都是由this.centerTextType确定
 * - 关于动态更改props的支持
 *   目前只保证动态更改type后的反应是正确的
 *
 * 事件
 * - date-change
 *   视图上选中的日期变更后触发
 * - day-click
 *   点击了可选日期后触发
 *
 * */
import { 
  ONE_DAY_MILLISECONDS, DAY_NAME_IN_WEEK_LIST,
  
  setDateMonth,
  setDateYear,
  dateToDayStr,
  dateToWeek2EndStr,
  dateToMonth2EndStr,
  dateToYear2EndStr,
  getWeekNumInYear,
  getBeginOfTomorrow,
} from "../../utils/date";
import board from "./board";

let yearList = [];

export default {
  name: "Calendar",
  components: { board },
  props: {
    type: {
      type: String,
      default: "day",
      validator(val) {
        const enumList = ["day", "week", "month", "year"];
        const isRight = enumList.indexOf(val) !== -1;
        if (isRight) {
          return true;
        } else {
          console.error(
            "type参数的值不是枚举值。传入值为：",
            val,
            "。 枚举值为：",
            ...enumList
          );
        }
      },
    },
    showYearNum: {
      // 可选年份数量
      type: Number,
      default: 10,
    },
    minXMove: {
      // 至少滑动多少距离切换下一周
      type: Number,
      default: 100,
    },
    defaultSelectedDate: {
      type: Date,
      default: () => new Date(),
    },
    /*
     * 是否能选择未来时间
     * 注意：如果允许选择未来时间的话仍然是禁选未来年份的
     * */
    canSelectFeature: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedDate: this.defaultSelectedDate,
      year: null,
      month: null,
      weekNumInYear: null,
      dayList: [],
      monthList: [],
      isShowPicker: false,
      changeTimeLimit: {
        canGoPrevYear: null,
        canGoNextYear: null,
        canGoPrevMonth: null,
        canGoNextMonth: null,
        canGoPrevWeek: null,
        canGoNextWeek: null,
      },

      centerTextType: null,
      pickerTitle: null,
      pickerColumns: null,
      touchStartX: null,
    };
  },
  watch: {
    type(val) {
      this.reactTypeChange(val);
    },
    // selectedDate的监听是不全的，对于未监听到的部分已经手动调用过updateViewBySelectedDate方法了
    selectedDate(selectedDate) {
      this.updateViewBySelectedDate(selectedDate);
    },
    isShowPicker(isShow) {
      if (!isShow) return;

      const setPickerVal = () => {
        const picker = this.$refs.picker;
        if (this.type === "week") {
          picker.setValues([this.year, this.month, this.weekNumInYear]);
        } else {
          picker.setValues([this.year, this.month]);
        }
      };

      if (this.$refs.picker) {
        // 非初次呼出
        setPickerVal();
      } else {
        // 初次呼出
        this.$nextTick(() => {
          setPickerVal();
        });
      }
    },
  },
  computed: {
    touchMoveItemList() {
      if (this.type === "day" || this.type === "week") {
        return this.dayList;
      } else if (this.type === "month") {
        return this.monthList;
      }
    },
    canLeftArrowBeUse() {
      if (this.type === "year" || this.type === "month") {
        return this.changeTimeLimit.canGoPrevYear;
      } else if (this.type === "week") {
        return this.changeTimeLimit.canGoPrevWeek;
      } else {
        return this.changeTimeLimit.canGoPrevMonth;
      }
    },
    canRightArrowBeUse() {
      if (this.type === "year" || this.type === "month") {
        return this.changeTimeLimit.canGoNextYear;
      } else if (this.type === "week") {
        return this.changeTimeLimit.canGoNextWeek;
      } else {
        return this.changeTimeLimit.canGoNextMonth;
      }
    },
    centerText() {
      if (this.centerTextType === "year") {
        return `${this.year}年`;
      } else if (this.centerTextType === "week") {
        return `${this.year}年${this.month}月 第${this.weekNumInYear}周`;
      } else if (this.centerTextType === "month") {
        return `${this.year}年${this.month}月`;
      }
    },
  },
  mounted() {
    /*
     * 禁选未来时间的话检查默认日期是否属于未来日期
     * （之所以是检查是否是未来日期而不是未来时间，是因为如果是未来日期而不是未来时间的话，在切换日历类型后有可能出错）
     * */
    {
      if (!this.canSelectFeature) {
        const beginOfTomorrow = getBeginOfTomorrow();
        if (this.defaultSelectedDate.getTime() >= beginOfTomorrow.getTime()) {
          console.error(
            "您已经选择禁选未来时间，但是把默认日期设为了未来日期，这是不合理的"
          );
        }
      }
    }

    this.reactTypeChange(this.type);
    this.updateViewBySelectedDate(this.selectedDate);
    this.addTouchMoveEvent();
  },
  methods: {
    // 执行各type不同的程序
    reactTypeChange(type) {
      this.centerTextType = function getCenterTextType() {
        if (this.type === "year" || this.type === "month") {
          return "year";
        } else if (this.type === "week") {
          return "week";
        } else if (this.type === "day") {
          return "month";
        }
      }.bind(this)();

      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      yearList = [];
      let defaultYearIdx;
      for (let i = this.showYearNum - 1; i >= 0; i--) {
        const year = currentYear - i;
        yearList.push(year);
        if (year === this.defaultSelectedDate.getFullYear()) {
          defaultYearIdx = yearList.length - 1;
        }
      }
      if (defaultYearIdx === undefined) {
        console.error(
          `传给日历组件的默认日期超出了可选区间。可选区间为：${
            yearList[0]
          }年到今年（${yearList[yearList.length - 1]}）`
        );
      }

      const yearCol = {
        values: yearList.map((x) => x + "年"),
        defaultIndex: defaultYearIdx,
      };
      const monthCol = {
        values: [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
          "8月",
          "9月",
          "10月",
          "11月",
          "12月",
        ],
        defaultIndex: this.defaultSelectedDate.getMonth(),
      };
      if (type === "day") {
        this.pickerTitle = "选择年月";
      } else if (type === "week") {
        this.pickerTitle = "选择年月周";
      } else if (type === "year" || type === "month") {
        this.pickerTitle = "选择年";
        this.pickerColumns = [yearCol];
      }

      if (type === "day" || type === "week") {
        this.pickerColumns = yearList.map((year, yearI) => {
          //计算出monthNumList
          let showMonthNum;
          if (this.canSelectFeature) {
            showMonthNum = 12;
          } else {
            if (year < currentYear) {
              showMonthNum = 12;
            } else {
              showMonthNum = currentDate.getMonth() + 1;
            }
          }
          const monthNumList = new Array(showMonthNum).fill("").map((x, i) => {
            return i + 1;
          });

          return {
            text: year + "年",
            children: monthNumList.map((month, monthI) => {
              const weekNumInYearList = [];
              const firstDayOfMonth = new Date(year, month - 1, 1);
              const lastDayOfMonth = new Date(year, month, 0);
              const firstWeek = getWeekNumInYear(firstDayOfMonth);
              let lastWeek = getWeekNumInYear(lastDayOfMonth);
              if (
                !this.canSelectFeature &&
                yearI === yearList.length - 1 &&
                monthI === monthNumList.length - 1
              ) {
                lastWeek = getWeekNumInYear(currentDate);
              }
              for (let weekNum = firstWeek; weekNum <= lastWeek; weekNum++) {
                weekNumInYearList.push({ text: weekNum + "周" });
              }
              if (type === "week") {
                return {
                  text: month + "月",
                  children: weekNumInYearList,
                };
              } else if (type === "day") {
                return {
                  text: month + "月",
                };
              }
            }),
          };
        });
      }

      this.updateViewBySelectedDate(this.selectedDate);
    },

    // 依据选中时间更新视图
    updateViewBySelectedDate(selectedDate) {
      this.year = selectedDate.getFullYear();
      this.month = selectedDate.getMonth() + 1;
      this.weekNumInYear = getWeekNumInYear(selectedDate);

      // 生成dayList
      const getDayResult = selectedDate.getDay();
      const dayIdxInWeek = getDayResult === 0 ? 6 : getDayResult - 1;
      const selectedTimestamp = selectedDate.getTime();
      const dayList = [];
      const minYear = yearList[0];
      const maxYear = yearList[yearList.length - 1];
      for (let i = 0; i < 7; i++) {
        const idxDeltaRelativeToSelected = i - dayIdxInWeek;
        const date = new Date(
          selectedTimestamp + idxDeltaRelativeToSelected * ONE_DAY_MILLISECONDS
        );

        const isTooEarly = date.getFullYear() < minYear;
        let isTooLate = date.getFullYear() > maxYear;
        if (this.canSelectFeature) {
          isTooLate = date.getFullYear() > maxYear;
        } else {
          const beginOfTomorrow = getBeginOfTomorrow();
          isTooLate = date.getTime() >= beginOfTomorrow.getTime();
        }
        const canClick = this.type === "day" && !isTooLate && !isTooEarly;

        dayList[i] = {
          date,
          val: date.getDate(),
          dayNameInWeek: DAY_NAME_IN_WEEK_LIST[i],
          isSelect: this.type === "day" && i === dayIdxInWeek,
          isInSelectedParent: date.getMonth() + 1 === this.month,
          canClick,
        };
      }
      this.dayList = dayList;

      //生成monthList
      const monthList = [];
      const startMonth = this.month <= 6 ? 1 : 7;
      const endMonth = this.month <= 6 ? 6 : 12;
      for (let monthNum = startMonth; monthNum <= endMonth; monthNum++) {
        const date = new Date(selectedTimestamp);
        setDateMonth(date, monthNum - 1);
        let isTooLate;
        if (this.canSelectFeature) {
          isTooLate = false;
        } else {
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear();
          const currentMonthIdx = currentDate.getMonth();
          const year = date.getFullYear();
          const monthIdx = date.getMonth();
          if (year < currentYear) {
            isTooLate = false;
          } else if (year === currentYear) {
            isTooLate = monthIdx > currentMonthIdx;
          } else {
            isTooLate = true;
          }
        }
        monthList[monthNum - startMonth] = {
          date,
          val: monthNum,
          isSelect: monthNum === this.month,
          isInSelectedParent: true,
          canClick: !isTooLate,
        };
      }
      this.monthList = monthList;

      this.$emit("date-change", this.getOutputDate());

      this.updateChangeTimeLimit();
    },
    // 更新代表“能否切换时间的限制”的data
    updateChangeTimeLimit() {
      const minYear = yearList[0];
      const maxYear = yearList[yearList.length - 1];

      const canGoPrevMonth = !(this.year === minYear && this.month === 1);
      let canGoNextMonth;
      if (this.canSelectFeature) {
        canGoNextMonth = !(this.year === maxYear && this.month === 12);
      } else {
        const selectedDate = this.selectedDate;
        const selectedYear = selectedDate.getFullYear();
        const selectedMonthIdx = selectedDate.getMonth();
        let nextMonth = new Date();
        if (selectedMonthIdx === 11) {
          setDateYear(nextMonth, selectedYear + 1);
          setDateMonth(nextMonth, 0);
        } else {
          setDateYear(nextMonth, selectedYear);
          setDateMonth(nextMonth, selectedMonthIdx + 1);
        }
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonthIdx = currentDate.getMonth();
        const nextMonthYear = nextMonth.getFullYear();
        const nextMonthMonthIdx = nextMonth.getMonth();
        if (nextMonthYear < currentYear) {
          canGoNextMonth = true;
        } else if (nextMonthYear === currentYear) {
          canGoNextMonth = nextMonthMonthIdx <= currentMonthIdx;
        } else {
          canGoNextMonth = false;
        }
      }
      let canGoPrevWeek = true;
      let canGoNextWeek = true;

      if (!canGoPrevMonth) {
        const selectedWeekFirstDay = this.dayList[0].date;
        const prevWeekLastDay = new Date(
          selectedWeekFirstDay.getTime() - ONE_DAY_MILLISECONDS
        );
        canGoPrevWeek = prevWeekLastDay.getMonth() === 0;
      }

      const selectedWeekLastDay = this.dayList[6].date;
      const nextWeekFirstDay = new Date(
        selectedWeekLastDay.getTime() + ONE_DAY_MILLISECONDS
      );
      if (this.canSelectFeature) {
        if (!canGoNextMonth) {
          canGoNextWeek = nextWeekFirstDay.getMonth() === 11;
        }
      } else {
        canGoNextWeek = nextWeekFirstDay.getTime() < getBeginOfTomorrow();
      }

      this.changeTimeLimit = {
        canGoPrevYear: this.year !== minYear,
        canGoNextYear: this.year !== maxYear,
        canGoPrevMonth,
        canGoNextMonth,
        canGoPrevWeek,
        canGoNextWeek,
      };
    },

    onLeftArrowClick() {
      if (!this.canLeftArrowBeUse) return;
      if (this.type === "year" || this.type === "month") {
        this.goPrevYear();
      } else if (this.type === "week") {
        this.goPrevWeek();
      } else if (this.type === "day") {
        this.goPrevMonth();
      }
    },
    onRightArrowClick() {
      if (!this.canRightArrowBeUse) return;
      if (this.type === "year" || this.type === "month") {
        this.goNextYear();
      } else if (this.type === "week") {
        this.goNextWeek();
      } else if (this.type === "day") {
        this.goNextMonth();
      }
    },
    goPrevYear() {
      this.goSelectedYear(this.selectedDate.getFullYear() - 1);
    },
    goNextYear() {
      this.goSelectedYear(this.selectedDate.getFullYear() + 1);
    },
    goPrevMonth() {
      const selectedMonth = this.selectedDate.getMonth() + 1;
      if (selectedMonth === 1) {
        this.selectedDate.setFullYear(this.selectedDate.getFullYear() - 1);
        setDateMonth(this.selectedDate, 11);
      } else {
        setDateMonth(this.selectedDate, selectedMonth - 2);
      }
      this.updateViewBySelectedDate(this.selectedDate);
    },
    goNextMonth() {
      const selectedMonth = this.selectedDate.getMonth() + 1;
      if (selectedMonth === 12) {
        this.selectedDate.setFullYear(this.selectedDate.getFullYear() + 1);
        setDateMonth(this.selectedDate, 0);
      } else {
        setDateMonth(this.selectedDate, selectedMonth);
      }
      this.updateViewBySelectedDate(this.selectedDate);
    },
    goPrevWeek() {
      if (!this.changeTimeLimit.canGoPrevWeek) return;

      const oneWeekBeforeSelectedDay = new Date(
        this.selectedDate.getTime() - 7 * ONE_DAY_MILLISECONDS
      );
      const minYear = yearList[0];
      const isTooEarly = oneWeekBeforeSelectedDay.getFullYear() < minYear;
      if (isTooEarly) {
        const selectedWeekFirstDay = this.dayList[0].date;
        const prevWeekLastDay = new Date(
          selectedWeekFirstDay.getTime() - ONE_DAY_MILLISECONDS
        );
        this.selectedDate = prevWeekLastDay;
      } else {
        this.selectedDate = oneWeekBeforeSelectedDay;
      }
    },
    goNextWeek() {
      if (!this.changeTimeLimit.canGoNextWeek) return;

      const oneWeekAfterSelectedDay = new Date(
        this.selectedDate.getTime() + 7 * ONE_DAY_MILLISECONDS
      );
      const maxYear = yearList[yearList.length - 1];
      const isTooLate = oneWeekAfterSelectedDay.getFullYear() > maxYear;
      if (isTooLate) {
        const selectedWeekLastDay = this.dayList[6].date;
        const nextWeekFirstDay = new Date(
          selectedWeekLastDay.getTime() + ONE_DAY_MILLISECONDS
        );
        this.selectedDate = nextWeekFirstDay;
      } else {
        this.selectedDate = oneWeekAfterSelectedDay;
      }
    },
    goSelectedWeek(year, week) {
      // 这个方法没有确保调用后日期在一周中的位置不变
      const firstDayOfYear = new Date(year, 0, 1);
      const firstDayOfYearTimeStamp = firstDayOfYear.getTime();
      this.selectedDate = new Date(
        firstDayOfYearTimeStamp + 7 * ONE_DAY_MILLISECONDS * (week - 1)
      );
    },
    goSelectedMonth(year, month) {
      this.selectedDate.setFullYear(year);
      setDateMonth(this.selectedDate, month - 1);
      this.updateViewBySelectedDate(this.selectedDate);
    },
    goSelectedYear(year) {
      this.selectedDate.setFullYear(year);
      setDateYear(this.selectedDate, year);
      this.updateViewBySelectedDate(this.selectedDate);
    },
    onPickerConfirm(valList, idxList) {
      this.isShowPicker = false;

      const year = Number(valList[0].split("年")[0]);

      if (this.centerTextType === "week") {
        const weekNumInYear = Number(valList[2].split("周")[0]);
        this.goSelectedWeek(year, weekNumInYear);
      } else if (this.centerTextType === "month") {
        const month = Number(valList[1].split("月")[0]);
        this.goSelectedMonth(year, month);
      } else if (this.centerTextType === "year") {
        this.goSelectedYear(year);
      }
    },
    onTouchMoveItemClick(item) {
      if (!item.canClick) return;
      this.selectedDate = item.date;

      this.$emit("touch-move-item-click", this.getOutputDate());
    },

    // 添加滑动事件监听器
    addTouchMoveEvent() {
      const el = this.$refs.touchMoveItemList;

      const goPrev = () => {
        switch (this.type) {
          case "day":
          case "week":
            this.goPrevWeek();
            break;
          case "month":
            let nextSelectedYear, nextSelectedMonth;
            if (this.month <= 6) {
              if (!this.changeTimeLimit.canGoPrevYear) return;
              nextSelectedYear = this.year - 1;
              nextSelectedMonth = this.month + 6;
            } else {
              nextSelectedYear = this.year;
              nextSelectedMonth = this.month - 6;
            }
            this.goSelectedMonth(nextSelectedYear, nextSelectedMonth);
            break;
        }
      };
      const goNext = () => {
        switch (this.type) {
          case "day":
          case "week":
            this.goNextWeek();
            break;
          case "month":
            let nextSelectedYear, nextSelectedMonth;
            if (this.month <= 6) {
              nextSelectedYear = this.year;
              nextSelectedMonth = this.month + 6;
            } else {
              if (!this.changeTimeLimit.canGoNextYear) return;
              nextSelectedYear = this.year + 1;
              nextSelectedMonth = this.month - 6;
            }
            this.goSelectedMonth(nextSelectedYear, nextSelectedMonth);
            break;
        }
      };

      const onTouchStart = (evt) => {
        this.touchStartX = evt.changedTouches[0].pageX;
      };
      const onTouchEnd = (evt) => {
        if (this.touchStartX === null) {
          return;
        }
        const touchEndX = evt.changedTouches[0].pageX;
        if (touchEndX - this.touchStartX > this.minXMove) {
          goPrev();
        }
        if (this.touchStartX - touchEndX > this.minXMove) {
          goNext();
        }
        this.touchStartX = null;
      };
      const onTouchCancel = (evt) => {
        this.touchStartX = null;
      };
      el.addEventListener("touchstart", onTouchStart);
      el.addEventListener("touchend", onTouchEnd);
      el.addEventListener("touchcancel", onTouchCancel);
    },

    getOutputDate() {
      const selectedDate = this.selectedDate;
      let result;
      if (this.type === "day") {
        result = dateToDayStr(selectedDate);
      } else if (this.type === "week") {
        result = dateToWeek2EndStr(selectedDate);
      } else if (this.type === "month") {
        result = dateToMonth2EndStr(selectedDate);
      } else if (this.type === "year") {
        result = dateToYear2EndStr(selectedDate);
      }
      return result;
    },
  },
};
</script>

<style lang="less">
@import "Calendar";
</style>
