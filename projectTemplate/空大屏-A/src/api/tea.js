
import emitter from '@/utils/emitter/emitter';

// 定制茶园数据
export function getTeaInfo(type) {
    return emitter({
        url: `/appPublicity/bigdata/chayuan/list/${type}`,
        method:'get',
    })
}

// 初次获取视频链接
export function getInitLiveUrl() {
    return emitter({
        url: `/appPublicity/bigTeaGarden/get`,
        method:'get',
    })
}

