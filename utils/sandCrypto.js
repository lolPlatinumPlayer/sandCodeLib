/* 
功能
- 加解密
- 可以判断输入decrypt的内容是否是由encrypt进行加密的

注意：解密空串永远会被判断为“已被篡改”

版本：0.0.0 2021.11.11
*/

export const 已被篡改=Symbol('已被篡改')

export function encrypt(待加密字符串){
  const dividedStr=String(待加密字符串).split('')
  const insertedStr=dividedStr.join(dividedStr[0])
  return window.btoa(encodeURIComponent(insertedStr))
}

export function decrypt(待解密字符串){
  let insertedStr
  try{
    insertedStr= decodeURIComponent(window.atob(待解密字符串))
  }catch(e){
    console.log('因程序报错所以判断为数据被篡改',e)
    return 已被篡改
  }
  const insertedStr_arrVersion=insertedStr.split('')
  const isTampered=!insertedStr_arrVersion
    .filter((x,i)=>i%2===1)
    .every(x=>x===insertedStr_arrVersion[0])
  if(isTampered){
    return 已被篡改
  }else{
    const dividedStr=insertedStr_arrVersion.filter((x,i)=>i%2===0)
    const decryptedResult= dividedStr.join('')
    if(decryptedResult){
      return decryptedResult
    }else{
      return 已被篡改 // 如果是空串，则判定为被篡改
    }
  }
}