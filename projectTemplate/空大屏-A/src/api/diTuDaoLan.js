// 对应页面：生态治理
import emitter from '@/utils/emitter/emitter';

// 获得基础点位
export function getBasicPointList(){
  return emitter({
      url: `/appPublicity/bigdata/getPointList`,
      method:'get',
  })
}

// 景点详情
export function getJingDianDetail(id){
  /* return new Promise(r=>{ // 测试代码
    setTimeout(()=>{
      r(emitter({
        url: `bigdata/getScenicDetail`,
        method:'get',
        params:{
          id,
        }
      }))
    },1111)
  }) */


  return emitter({
    url: `/appPublicity/bigdata/getScenicDetail`,
    method:'get',
    params:{
      id,
    }
  })
}

// 民宿详情
export function getMinSuDetail(id){
  return emitter({
    url: `/appPublicity/bigdata/getAccommodationDetail`,
    method:'get',
    params:{
      id,
    }
  })
}

// 自定义点位详情
export function getDiyPointDetail(id){
  return emitter({
    url: `/appPublicity/bigdata/getCustomDetail`,
    method:'get',
    params:{
      id,
    }
  })
}


