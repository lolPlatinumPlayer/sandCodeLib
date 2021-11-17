//  对应页面：预警分析
import emitter from '@/utils/emitter/emitter';

// 获得页面里全部数据（2021.08.18接到通知弃用该接口，会用多个接口代替该接口）
export function getAllData() {
  return emitter({
      url: `/appPublicity/bigdata/getWarningAnalysis`,
      method:'get',
  })
}

// 获得人流预警分析数据
export function getCrowdWarningAnalysis() {
  return Promise.all([
    emitter({ // 未来24小时
      url: `/appPublicity/api/v2/bigdata/forecast/tomorrowPeople`,
      method:'get',
    }),
    emitter({ // 未来30天
      url: `/appPublicity/api/v2/bigdata/forecast/monthPeople`,
      method:'get',
    }),
  ])
}

// 未来24小时停车趋势分析（顶替2021.08.18前的『未来一年车流量趋势分析』数据）
export function get24hParkForecast() {
  return emitter({
      url: `/appPublicity/api/v2/bigdata/forecast/twelveHour`,
      method:'get',
  })
}

// 停车场爆满预测
export function getParkOverloadForecast() {
  return emitter({
      url: `/appPublicity/api/v2/bigdata/forecast/parkFull`,
      method:'get',
  })
}

// 未来一周车流量预测
export function get7dayCarStreamForecast() {
  return emitter({
      url: `/appPublicity/api/v2/bigdata/forecast/parkNextWeek`,
      method:'get',
  })
}

// 车位投入预测
export function getParkingLotInputForecast() {
  return emitter({
      url: `/appPublicity/api/v2/bigdata/forecast/parkInvestment`,
      method:'get',
  })
}
