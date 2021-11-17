import axios from 'axios';
// import * as requestCode from './requestCode';
import { Message } from 'element-ui';
// import store from '@/store';
import qs from 'qs'
import bus from '@/bus'



axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

const CancelToken = axios.CancelToken;
const source = CancelToken.source()

let emitter = axios.create({
    baseURL:process.env.NODE_ENV==='production'?process.env.VUE_APP_BASE_API:'', 
    // baseURL:process.env.VUE_APP_BASE_API, 
    timeout: 30000 // request timeout
}); 

// 添加请求拦截器
emitter.interceptors.request.use(function (config) {
  if(config.isLoginReq){
    return config
  }else{
    if(!bus.authorizationHeader){
      return Promise.reject('没有Authorization头部')
    }else{
      config.headers.Authorization=bus.authorizationHeader
      return config
    }
  }
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
})

// 添加响应拦截器
emitter.interceptors.response.use(function (res) {
  // 状态码为2xx的话会触发这个回调
  // 对响应数据做点什么
  // 服务端返回的数据会放在`res.data`里

  if(res.data.code==200){
    return res.data.data;
  }else{
    if(res.data.code==401){
      bus.authorizationHeader=''
      sessionStorage.setItem('authorizationHeader',bus.authorizationHeader)
      bus.vueRootInstance.pageName='login'
      /* Message({
        message: '未经授权',
        type: "error",
        duration: 2000,
      }) */
      return Promise.reject(res.data)
    }else{
      /* Message({
        message: res.data.message||'服务端未定义错误',
        type: "error",
        duration: 2000,
      }) */
      return Promise.reject(res.data)
    }
  }
}, function (error) {
  // 状态码不是2xx的话会触发这个回调
  // 对响应错误做点什么
  /* Message({
    message: '请求失败',
    type: "error",
    duration: 2000,
  }) */
  return Promise.reject(error); // 控制台不会抛错
})

export default emitter;
