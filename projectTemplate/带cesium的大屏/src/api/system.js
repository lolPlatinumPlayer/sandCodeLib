import emitter from '@/api/emitter/emitter';
import {setUserInfo,encrypt,} from '@/auth'

export function setUserName(name){
  return emitter({
    url: `/base/account/account/editPerson`,
    method:'put',
    data:{
      name,
    },
  }).then(resData=>{
    setUserInfo({
      username:name,
    })
  })
}

export function sePwd({
  oldPwd,
  newPwd,
  newPwd2,
}){
  return emitter({
    url: `/hlscplatform/user/password`,
    method:'put',
    data:{
      oldPassword:encrypt(oldPwd),
      password:encrypt(newPwd),
      password2:encrypt(newPwd2),
    },
  })
}