// 判断对象是否为数组
export function isArr(o:any):boolean {
    return Object.prototype.toString.call(o) === '[object Array]';
}
