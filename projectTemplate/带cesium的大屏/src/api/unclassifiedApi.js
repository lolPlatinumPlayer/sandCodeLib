
import emitter from '@/api/emitter/emitter';

debugger

// 获得路由数据
export function getBackEndRouteData(){
  return emitter({
      url: `/appPublicity/bigdata/getCategory`,
      method:'get',
  })
}

// 获得标题
export function getTitleAndPageABg(){
  return emitter({
      url: `/appPublicity/bigdata/getBigConfig`,
      method:'get',
  })
}

// 产业数据（页面）
export function getIndustryData() {
    return emitter({
        url: `/appPublicity/bigdata/getIndustryData`,
        method:'get',
    })
}

// 一张图看历程（页面）
export function getTimeLineData() {
  return emitter({
      // url: `https://xxdwd.fjhrt.com/szxc/appPublicity/partyMemory/reception/list`,
      url: `/appPublicity/partyMemory/reception/list`,
      method:'get',
  })
}

