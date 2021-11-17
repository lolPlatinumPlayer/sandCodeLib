//  对应页面：一张图看气象
import emitter from '@/utils/emitter/emitter'

// 林区管护
export function getForestData() {
  return emitter({
    url: `/appPublicity/api/v1/webWeather/forestManagement`,
    method: 'get',
  })
}

// 河湖治理
export function getRiverList() {
  return emitter({
    url: `/appPublicity/api/v1/webWeather/riverLakeGovernance`,
    method: 'get',
  })
}

// 文化旅游
export function getTravelData() {
  /* return new Promise(r => r({
    "freshnessIndexTxt": "清新", "fylz": "1062", "dayTimeComfortIndex": "暂无", "nightComfortIndex": "暂无", "blueSkyIndex": "天空灰暗", "sunriseProbability": "20%", "stargazingProbability": "0%", "sunsetProbability": "50%"}
  )) */
  return emitter({
    url: `/appPublicity/api/v1/webWeather/culturalTourism`,
    // url: `http://192.168.1.124:8079/api/v1/webWeather/culturalTourism`,
    method: 'get',
  })
}

// 特色农业
export function getAgricultureList() {
  return emitter({
    url: `/appPublicity/api/v1/webWeather/characteristicAgriculture`,
    method: 'get',
  })
}

// 下党天气-逐日
export function getWeatherPerDay() {
  return emitter({
    url: `/appPublicity/api/v1/webWeather/xiaDanWebWeatherByDay`,
    method: 'get',
  })
}

// 下党天气-逐时
export function getWeatherPerHour() {
  return emitter({
    url: `/appPublicity/api/v1/webWeather/xiaDanWebWeatherByHour`,
    method: 'get',
  })
}
