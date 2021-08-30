/* 
版本 2021.08.13
*/

// 判断对象是否为数组
export function isArr(o) {
  return Object.prototype.toString.call(o) === '[object Array]';
}

// 混合(普通)对象的方法
// （以后要写一个也能混合数组属性的版本，这样就能完全胜任“混合配置”这个应用场景了）
export function mergeObj(origin,input){
const output={}
for(const key in origin){
  if(key in input){
    if(isPureObj(input[key])){
      if(isPureObj(origin[key])){
        output[key]=mergeObj(origin[key],input[key])
      }else{
        output[key]=input[key]
      }
    }else{
      output[key]=input[key]
    }
  }else{
    output[key]=origin[key]
  }
}
deepAddProperty(output,input)
return output
}

// 输入2个纯对象，把第二个对象比第一个对象多的属性都加到第一个对象上（每一层的属性都会执行这个操作）
function deepAddProperty(origin,objUsedToAdd){
for(const key in objUsedToAdd){
  if(key in origin){
    deepAddProperty(origin[key],objUsedToAdd[key])
  }else{
    origin[key]=objUsedToAdd[key]
  }
}
}

// 判断是否是纯对象
function isPureObj(o){
return Object.prototype.toString.call(o) === '[object Object]'
}