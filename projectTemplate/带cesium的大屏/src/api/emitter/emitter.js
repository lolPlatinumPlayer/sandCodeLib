import axios from 'axios'
import {removeUserInfo, getUserInfo} from '@/auth'
import {Toast} from 'vant'



axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

// const CancelToken = axios.CancelToken;
// const source = CancelToken.source()

const emitter = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : '',
  timeout: 30000 // request timeout
})
let loading
// 添加请求拦截器
emitter.interceptors.request.use(function(config) {
  loading = Toast.loading({
    message: '数据请求中..',
    forbidClick: true,
    type: 'loading',
    duration: 0
  })
  if (config.isLoginReq) {
    return config
  } else {
    const authorizationHeader = getUserInfo().authorizationHeader
    if (!authorizationHeader) {
      return Promise.reject('没有Authorization头部')
    } else {
      config.headers.Authorization = authorizationHeader
      return config
    }
  }
}, function(error) {
  loading.clear()
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
emitter.interceptors.response.use(function(res) {
  loading.clear()
  // 状态码为2xx的话会触发这个回调
  // 对响应数据做点什么
  // 服务端返回的数据会放在`res.data`里

  // 这些code并不是遵循restful的，是每个项目不同的
  if (res.data.code == 0/* 0代表无错误 */) {
    return res.data.data
  } else {
    if (res.data.code == 401/* 401代表无权限 */) {
      removeUserInfo()
      /* Message({
        message: '未经授权',
        type: "error",
        duration: 2000,
      }) */
      return Promise.reject(res.data)
    } else {
      /* Message({
        message: res.data.message||'服务端未定义错误',
        type: "error",
        duration: 2000,
      }) */
      return Promise.reject(res.data)
    }
  }
}, function(error) {
  loading.clear()
  // 状态码不是2xx的话会触发这个回调
  // 对响应错误做点什么
  /* Message({
    message: '请求失败',
    type: "error",
    duration: 2000,
  }) */
  return Promise.reject(error) // 控制台不会抛错
})

export default emitter
