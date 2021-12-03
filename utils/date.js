export const ONE_DAY_MILLISECONDS=86400000
export const DAY_NAME_IN_WEEK_LIST=['一','二','三','四','五','六','日',]

/*
* 输入Date实例
* 返回这一天在一年中处于第几周
* */
export function getWeekNumInYear(inputDate){
  const year = inputDate.getFullYear()
  const monthIdx = inputDate.getMonth()
  const dayInMonth = inputDate.getDate()
  const beginOfInputDate = new Date(year, monthIdx, dayInMonth)
  const firstDayOfYear = new Date(year, 0, 1)
  const dayIdxInYear=(beginOfInputDate.getTime() - firstDayOfYear.getTime()) / ONE_DAY_MILLISECONDS
  const firstDayGetDayResult=firstDayOfYear.getDay()
  const firstDayIdxInWeek=firstDayGetDayResult===0?6:firstDayGetDayResult-1
  const firstWeekLastDayNumInYear=7-firstDayIdxInWeek
  const daysElapsedSinceFirstWeek= (dayIdxInYear+1)-firstWeekLastDayNumInYear
  return Math.ceil(daysElapsedSinceFirstWeek/7)+1
}

/*
* 输入Date实例
* 返回年初与年末的日期
* 返回内容示例：['2020-01-01','2020-12-31']
* */
export function dateToYear2EndStr(originDate){
  const year=originDate.getFullYear()
  return[`${year}-01-01`,`${year}-12-31`]
}

/*
* 输入Date实例
* 返回月初与月末的日期
* 返回内容示例：['2020-02-01','2020-02-29']
* */
export function dateToMonth2EndStr(originDate){
  const originTimestamp=originDate.getTime()
  const beginningOfMonth=new Date(originTimestamp)
  const endOfMonth=new Date(originTimestamp)

  beginningOfMonth.setDate(1)

  const year=originDate.getFullYear()
  const month=originDate.getMonth()+1
  const dayCountOfMonth=getDayCountOfMonth(year,month)
  endOfMonth.setDate(dayCountOfMonth)

  return[
    dateToDayStr(beginningOfMonth),
    dateToDayStr(endOfMonth),
  ]
}

/*
* 输入Date实例
* 返回周一到周天间的日期
* 返回内容示例：['2020-12-21','2020-12-27']
* */
export function dateToWeek2EndStr(originDate){
  const originTimestamp=originDate.getTime()
  const getDayResult=originDate.getDay()
  const dayIdxInWeek=getDayResult===0?6:getDayResult-1

  const monday=new Date(originTimestamp-dayIdxInWeek*ONE_DAY_MILLISECONDS)
  const sunday=new Date(originTimestamp+(6-dayIdxInWeek)*ONE_DAY_MILLISECONDS)

  return[
    dateToDayStr(monday),
    dateToDayStr(sunday),
  ]
}

/*
* 输入Date实例
* 返回'2020-01'这种格式的字符串
* */
export function dateToMonthStr(date){
  const year=date.getFullYear()
  const month=date.getMonth()+1

  const monthStr=month>9?month:`0${month}`

  return `${year}-${monthStr}`
}

/*
* 输入Date实例
* 返回'2020-01-01'这种格式的字符串
* */
export function dateToDayStr(date){
  const year=date.getFullYear()
  const month=date.getMonth()+1
  const day=date.getDate()

  const monthStr=month>9?month:`0${month}`
  const dayStr=day>9?day:`0${day}`

  return `${year}-${monthStr}-${dayStr}`
}

/*
* 因为js的setMonth有可能使月份+1，所以写了这个方法保证月份不+1
* */
export function setDateMonth(date,monthIdx) {
  const year=date.getFullYear()
  date.setMonth(monthIdx)
  if(date.getMonth()!==monthIdx){
    date.setMonth(monthIdx)
    const lastDay=getDayCountOfMonth(year,monthIdx+1)
    date.setDate(lastDay)
  }
}

/*
* 因为js的setYear有可能使月份+1，所以写了这个方法保证月份不+1
* */
export function setDateYear(date,year) {
  const monthIdx=date.getMonth()
  date.setFullYear(year)
  setDateMonth(date,monthIdx)
}

/*
* 获取1个月中有多少天
* */
function getDayCountOfMonth(year,month) {
  const now=new Date(year,month,0)
  return now.getDate()
}

/*
* 获得明天的起始
* */
export function getBeginOfTomorrow(){
  const currentDate = new Date();
  const year=currentDate.getFullYear()
  const monthIdx=currentDate.getMonth()
  const day=currentDate.getDate()
  const beginOfToday=new Date(year,monthIdx,day)
  const beginOfTomorrow=new Date(beginOfToday.getTime()+ONE_DAY_MILLISECONDS)
  return beginOfTomorrow
}
