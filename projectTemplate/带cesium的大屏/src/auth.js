import CryptoJS from 'crypto-js'
import bus from './bus'

const userInfoKeyList=['authorizationHeader','username']

export function setUserInfo(input){
  userInfoKeyList.forEach(key=>{
    if(key in input){
      localStorage.setItem(key,input[key])
      if(key==='username'){
        bus.vueRootInstance.username=input.username
      }
    }
  })
}

export function getUserInfo(){
  const userInfo={}
  userInfoKeyList.forEach(key=>{
    userInfo[key]=localStorage.getItem(key)
  })
  return userInfo
}

export function removeUserInfo(){
  userInfoKeyList.forEach(key=>{
    localStorage.removeItem(key)
  })
  bus.vueRootInstance.changeLoginStatus(false)
}

export function encrypt(str) {
  var key = CryptoJS.enc.Utf8.parse('2b72cc3d1426554818da16e13f6a249c')
  var srcs = CryptoJS.enc.Utf8.parse(str)
  var encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
  return encrypted.toString()
}