<template>
  <div class='App' id="app">
    <cz class="fullScreen" />
    <mainstay v-if="isLogin" class="fullScreen" />
    <login v-else @pass="isLogin=true" class="fullScreen" />
  </div>
</template>

<script>
import mainstay from './page/mainstay'
import login from './page/system/login/login'
import bus from './bus'
import {getUserInfo} from './auth'
import cz from './cz'

export default {
  name: 'App',
  props:{
  },
  components:{
    mainstay,
    login,
    cz,
  },
  data(){
    const userInfo=getUserInfo()
    return {
      isLogin:!!userInfo.authorizationHeader,

      // 以下data专门给外部使用的（放在这里让数据变成响应式的）
      username:userInfo.username, 
      statusBarHeight:undefined,
    }
  },
  // ↓↓↓↓↓放入iframe所需的代码↓↓↓↓↓
  watch:{
    $route(){
      window.dispatchEvent(new CustomEvent("routeChange"))
    },
  },
  // ↑↑↑↑↑放入iframe所需的代码↑↑↑↑↑
  beforeCreate(){
    bus.vueRootInstance=this
  },
  mounted(){
  },
  methods:{
    changeLoginStatus(isLogin){ // 专门给外部使用的
      this.isLogin=isLogin
    },
  },
}
</script>

<style lang='less'>
@import './style/common.less';
.App{
  height: 100%;
  background: #000;
  .mainstay{
    pointer-events: none;
  }
  .fullScreen{
    position: absolute;
    left: 0;top: 0;
    width: 100%;
    height: 100%;
  }
}
.el-message{
  min-width:auto;width: calc(100% - 52px); // 取消原本的min-width以解决部分在部分手机上显示过宽的问题
  .el-message__icon{ // 调整登录页提示图标大小
    font-size: 24px;
  }
}
</style>