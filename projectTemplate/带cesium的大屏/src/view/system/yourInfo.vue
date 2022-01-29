<template>
  <div class='yourInfo'>
    <div class="avatarBox">
      <avatar ref="avatar" />
    </div>
    <van-cell-group>
      <van-cell  title="用户名" @click="$router.push('/setUserName')" :value="username" is-link />
      <van-cell  title="修改密码" @click="$router.push('/setPsw')" is-link />
    </van-cell-group>
    <div class="confirmBtn" @click="logout">
      退出登录
    </div>
  </div>
</template>

<script>
import avatar from './avatar.vue'
import Toast from 'vant/lib/toast';
import {getUserInfo,removeUserInfo,} from '@/auth'
import {setUserName} from '@/api/system'

export default {
  name: 'yourInfo',
  props:{
  },
  components:{
    avatar,
  },
  data(){
    return {
      username:getUserInfo().username,
    }
  },
  mounted(){
  },
  methods:{
    logout(){
      removeUserInfo()
    },
  },
}
</script>

<style lang='less'>
@import './confirmBtn';
.yourInfo{
  .avatarBox{
    background: white;
    overflow: hidden;
    .avatar{
      width: 190px;
      height: 190px;
      margin: 45px auto 65px;
    }
  }
  .van-field__control{
    text-align: right;
  }
  .confirmBtn{
    .confirmBtn();
  }
}
</style>