
import emitter from '@/utils/emitter/emitter';

// 获取乡村概况
export function getRuralSurvey() {
    return emitter({
        url: `/appPublicity/bigdata/getRuralSurvey`,
        method:'get',
    })
}

// 获取智慧党建
export function getWisdomData() {
  return emitter({
      url: `/appPublicity/bigdata/getWisdomData`,
      method:'get',
  })
}