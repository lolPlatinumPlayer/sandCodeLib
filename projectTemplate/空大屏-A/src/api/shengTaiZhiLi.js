// 对应页面：生态治理
import emitter from '@/utils/emitter/emitter';

// 获得全部监控基础信息（现用）
// 接口文档地址：http://192.168.1.124:8079/doc.html#/default/%E4%B8%9A%E5%8A%A1%E5%81%9C%E8%BD%A6%E5%9C%BA(%E5%A4%A7%E5%B1%8F%E6%8E%A5%E5%8F%A3)/ecologicalManagementUsingGET_1
export function get4BasicList(){
  return emitter({
    url: `/appPublicity/api/v2/bigdata/carpark/ecologicalManagement`,
    method:'get',
  })
}
// 获得全部监控基础信息（谢新写了个👆新接口👆代替这个。新旧接口功能一样，但是旧的不维护了）（2021.8.16对比新旧接口发现字段都一样）
export function get3BasicList_old(){
  return emitter({
    url: `/appPublicity/bigdata/ecologicalManagement`,
    method:'get',
  })
}

// 获取人流详情全部数据 （8月11日真真要求弃用）
export function getCrowdDetail(id){
  return emitter({
    url: `/appPublicity/bigdata/peopleMonitorDetails`,
    method:'get',
    params:{
      id,
    }
  })
}
// 获取人流详情的路况
export function getTrafficData(equipmentNum){
  return emitter({
    url: `/appPublicity/equipmentdocking/currentRoadConditions`,
    method:'get',
    params:{
      equipmentNum,
    }
  })
}
// 获取人流详情的24小时拥堵指数
export function getCrowdLast24hData(equipmentNum){
  return emitter({
    url: `/appPublicity/equipmentdocking/congestionIndex`,
    method:'get',
    params:{
      equipmentNum,
    }
  })
}
// 获取人流详情的近7天拥堵指数
export function getCrowdLast7dayData(equipmentNum){
  return emitter({
    url: `/appPublicity/equipmentdocking/sevenDaysCongestionIndex`,
    method:'get',
    params:{
      equipmentNum,
    },
  })
}

// 获取停车位详情全部数据 （8月11日真真要求弃用）
export function getCarParkDetail(id){
  return emitter({
    url: `/appPublicity/bigdata/parkMonitorDetails`,
    method:'get',
    params:{
      id,
    }
  })
}
export function getRealTimeParkInfo(id){
  return emitter({
    url: `/appPublicity/api/v2/bigdata/carpark/parkingStatus`,
    method:'get',
    params:{
      id,
    },
  })
}
export function getRecommendedRoute(id){
  return emitter({
    url: `/appPublicity/api/v2/bigdata/carpark/recommendedRoute`,
    method:'get',
    params:{
      id,
    },
  })
}
export function getServeTimeList(id){
  return emitter({
    url: `/appPublicity/api/v2/bigdata/carpark/carServiceByWeek`,
    method:'get',
    params:{
      id,
    },
  })
}

// 车流量监控的接口
export function getRealTimeStream(id){
  return emitter({
    url: `/appPublicity/api/v2/bigdata/traffic/realTimeTrafficFlowToday`,
    method:'get',
    params:{
      id,
    },
  })
}
export function getCarTypeRatio(id){
  return emitter({
    url: `/appPublicity/api/v2/bigdata/traffic/carTypeStatistics`,
    method:'get',
    params:{
      id,
    },
  })
}
export function getStreamData_riverChart(id){ // 7日车流数据（河流图）
  return emitter({
    url: `/appPublicity/api/v2/bigdata/traffic/trafficFlowMonitorByWeek`,
    method:'get',
    params:{
      id,
    },
  })
}
export function getStreamData_multiLineChart(id){ // 7日车流数据（多折线图）
  return emitter({
    url: `/appPublicity/api/v2/bigdata/traffic/trafficFlowMonitorByWeekManyLineChart`,
    method:'get',
    params:{
      id,
    },
  })
}

// 获取水质详情全部数据
export function getWaterDetail(id){
  return emitter({
    url: `/appPublicity/bigdata/waterMonitorDetails`,
    method:'get',
    params:{
      id,
    }
  })
}