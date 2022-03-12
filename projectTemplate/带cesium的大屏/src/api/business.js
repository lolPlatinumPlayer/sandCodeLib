
import emitter from '@/api/emitter/emitter'

// 产业数据（页面）
export function getIndustryData() {
  return emitter({
    url: `/appPublicity/bigdata/getIndustryData`,
    method: 'get',
  })
}
