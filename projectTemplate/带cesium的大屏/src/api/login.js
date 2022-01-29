import emitter from './emitter/emitter';
import {setUserInfo,encrypt} from '../auth'

// 登录
export function loginReq({account,password}) {
  const encryptedPwd=encrypt(password)
  return emitter({
    url: `/auth/login`,
    method:'post',
    data:{
      "username":account,
      "password":encryptedPwd,
      "appCode":"SNXC-ADMIN","code":""
    },
    isLoginReq:true,
  })
  .then(resData=>{
    setUserInfo({
      authorizationHeader:`${resData.token_type} ${resData.access_token}`,
      username:resData.name,
    })
    return resData
  })
}

// 获取验证码token
export function getVerificationCodeToken(){
  return emitter({
    url: `/captcha/captcha`,
    method:'get',
    isLoginReq:true,
  })
}

/* // 获取验证码图片
export function getVerificationCodeImg(token){
  return emitter({
      url: `/captcha/captcha/getCaptcha/${token}`,
      method:'get',
  })
} */

// 验证验证码
/* 
参数
token ：传第一个接口的token 
data: 验证码
*/
export function verifyCode(params){
  return emitter({
    url: `/captcha/captcha/check`,
    method:'get',
    params,
    isLoginReq:true,
  })
}