import emitter from '@/utils/emitter/emitter';

// 获取左侧全部数据（8月12日真真说里边大部分数据改用其他接口的。只有空气湿度、温度用这个接口）
export function getSideBarData(){
  return emitter({
      url: `/appPublicity/bigdata/getAlarmEvents`,
      method:'get',
  })
}

// 停车预警
export function getParkWarning(){
  return emitter({
      url: `/appPublicity/api/v2/bigdata/carpark/parkingWarning`,
      method:'get',
  })
}

// 人流预警 文档地址：http://192.168.1.124:8079/doc.html#/default/%E8%AE%BE%E5%A4%87%E5%AF%B9%E6%8E%A5-%E4%BA%BA%E6%B5%81/streamOfPeopleWarningUsingGET
export function getPeopleWarning(){
  return emitter({
      url: `/appPublicity/equipmentdocking/streamOfPeopleWarning`,
      method:'get',
  })
}

// 停车位监控 文档地址：http://192.168.1.124:8079/doc.html#/default/%E4%B8%9A%E5%8A%A1%E5%81%9C%E8%BD%A6%E5%9C%BA(%E5%A4%A7%E5%B1%8F%E6%8E%A5%E5%8F%A3)/parkingSpaceMonitoringUsingGET
export function getParkMonitor(){
  return emitter({
      url: `/appPublicity/api/v2/bigdata/carpark/parkingSpaceMonitoring`,
      method:'get',
  })
}

// 人流监控 文档地址：http://192.168.1.124:8079/doc.html#/default/%E8%AE%BE%E5%A4%87%E5%AF%B9%E6%8E%A5-%E4%BA%BA%E6%B5%81/crowdMonitoringUsingGET
export function getCrowdList(){
  return emitter({
      url: `/appPublicity/equipmentdocking/crowdMonitoring`,
      method:'get',
  })
}

// 重点区域视频监控（谢新）
export function getVideoList(){
  return emitter({
      url: `/appPublicity/api/v2/bigdata/carpark/importantVideo`,
      method:'get',
  })
}