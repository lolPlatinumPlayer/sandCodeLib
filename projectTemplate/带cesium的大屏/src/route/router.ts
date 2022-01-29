import Vue from "vue";
import VueRouter from "vue-router"
import routeDescription from './routeDescription'
import bus from '@/bus'
import {getUserInfo,} from '@/auth'
import {Toast} from 'vant'

Vue.use(VueRouter)

const router=new VueRouter({
  routes:routeDescription,
})

type Loading={
  clear:Function;
}

let loading:Loading

router.beforeEach((to, from, next) => {
  // console.log('beforeEach',to, from)
  loading = Toast.loading({
    message: '页面加载中..',
    forbidClick: true,
    type: 'loading',
    duration: 0
  })
  console.time('路由切换耗时')
  next() // 不管是否登录，路由都是要跳转的，不然跳到登录页再登录后会出现空白页
  if(getUserInfo().authorizationHeader===null){
    /* 
    初次进入页面的话是没有vueRootInstance的  
    这个时候app.vue会判断是否跳到登录页
    因此这里不需要判断
    */
    if(bus.vueRootInstance!==undefined){
      bus.vueRootInstance.changeLoginStatus(false)
    }
  }
})

/* 
不用捕获错误的原因：
Toast.loading已经加了全局遮罩禁止用户操作了
所以不会出现在生态治理页面狂点监控出现的报错
*/

router.afterEach((to, from,) => {
  loading.clear()
  console.timeEnd('路由切换耗时')
})

export default router