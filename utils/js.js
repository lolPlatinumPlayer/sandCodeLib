/* 
版本：2021.09.29
*/

// 判断对象是否为数组
export function isArr(o) {
  return Object.prototype.toString.call(o) === '[object Array]'
}

// 混合(普通)对象的方法
// 注意：目前只做了纯对象的支持，如果包含数组的话不保证正常工作
// （以后要写一个也能混合数组属性的版本，这样就能完全胜任“混合配置”这个应用场景了）
export function mergeObj(origin, input) {
  const output = {}
  for (const key in origin) {
    if (key in input) {
      if (isPureObj(input[key])&&isPureObj(origin[key])) {
        output[key] = mergeObj(origin[key], input[key])
      } else {
        output[key] = input[key]
      }
    } else {
      output[key] = origin[key]
    }
  }
  deepAddProperty(output, input)
  return output
}

/* 
输入2个纯对象，把第二个对象比第一个对象多的属性都加到第一个对象上
会递归（每一层的属性都会执行这个操作）
如果第二个入参有属性是不是纯对象的话就会直接使用（不会递归数组）
*/
function deepAddProperty(origin, objUsedToInsert) {
  for (const key in objUsedToInsert) {
    if ((isPureObj(objUsedToInsert[key]))&&(key in origin)) {
      deepAddProperty(origin[key], objUsedToInsert[key])
    } else {
      origin[key] = objUsedToInsert[key]
    }
  }
}

// 判断是否是纯对象
export function isPureObj(o) {
  return Object.prototype.toString.call(o) === '[object Object]'
}