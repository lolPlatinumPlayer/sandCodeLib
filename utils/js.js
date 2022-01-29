/* 
版本：0.1.0 2022.01.21
深拷贝还是用lodash的好
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
如果第二个入参有属性是不是纯对象的话就会直接深拷贝（不会递归数组）
*/
function deepAddProperty(origin, objUsedToInsert) {
  for (const key in objUsedToInsert) {
    if ((isPureObj(objUsedToInsert[key]))&&(key in origin)) {
      deepAddProperty(origin[key], objUsedToInsert[key])
    } else {
      origin[key] = JSON.parse(JSON.stringify(objUsedToInsert[key]))
    }
  }
}

// 判断是否是纯对象
export function isPureObj(o) {
  return Object.prototype.toString.call(o) === '[object Object]'
}

// 加强版数组（补足数组和Set的不足）
export class ArrPlus extends Array{
  delete(inputItem){ // 在数组中去掉该元素（不管占了多少个位置都会去掉）
    for(let i=this.length-1;i>=0;i--){
      if(this[i]===inputItem){
        this.splice(i,1)
      }
    }
    return this
  }
  getLastOne(){
    return this[this.length-1]
  }
}

// 获得由对象的键组成的数组（不含原型链上的键）
export function getObjKeyList(obj) {
  const result = []
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result.push(key)
    }
  }
  return result
}