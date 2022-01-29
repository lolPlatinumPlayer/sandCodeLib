<template>
  <div class="login">
    <img class="bg" src="./img/bg.png" alt="">
    <div class="projectBanner red" :style="{paddingTop:statusBarHeight+'px'}">
      <i class="ico el-icon-arrow-left"
      ></i>
      <div class="text">登录</div>
    </div>
    <div class="content">
      <div class="imgTitleBox">
        <img class="imgTitle" src="./img/title.png" alt="">
      </div>
      <el-form class="form" ref="formEl" :model="formInputData" :rules="formRules"  align="center">
        <el-form-item prop="account" class="formItem">
          <el-input v-model="formInputData.account" placeholder="请输入用户名" clearable>
            <i slot="prefix" class="el-input__icon el-icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password" class="formItem">
          <el-input v-model="formInputData.password" placeholder="请输入密码" show-password>
            <i slot="prefix" class="el-input__icon el-icon-lock"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="verificationCode" class="formItem">
          <el-input
            v-model="formInputData.verificationCode" 
            placeholder="请输入验证码"
            :disabled="verificationCodeTokenStatus!=='已获得'"
          >
            <i slot="prefix" class="el-input__icon el-icon-edit"></i>
            <template slot="append">
              <div class="verificationCodeBox" @click="refreshVerificationCode">
                <el-image
                  class="verificationCodeImg"
                  v-if="verificationCodeTokenStatus==='已获得'"
                  :src="verificationCodeImgUrl"
                  fit="contain"
                ></el-image>
                <div v-else class="status">
                  {{verificationCodeTokenStatus}}
                </div>
              </div>
            </template>
          </el-input>
        </el-form-item>
        <div class="btn" @click="onSubmit">进入平台</div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { 
  loginReq,
  getVerificationCodeToken,
  verifyCode,
} from '../../../api/login';
import { Message } from 'element-ui';

export default {
  name: 'login',
  props: {},
  components: {},
  data() {
    return {
      formInputData:{
        account:undefined,
        password:undefined,
        verificationCode:undefined,
      },
      formRules:{
        account:[
          { required: true, message: '请输入帐号', trigger: 'blur' },
          { message: '帐号不允许包含空格', trigger: 'blur',
            validator(rule, val, callback) {
              if (/ /.test(val)) {
                callback(false);
              } else {
                callback();
              }
            },
          },
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        verificationCode:[
          { required: true, message: '请输入验证码', trigger: 'blur' },
        ],
      },
      verificationCodeToken:undefined,
      verificationCodeTokenStatus:'获取中',
      isVerificationCodeRight:false,
    }
  },
  computed:{
    verificationCodeImgUrl(){
      return `${
          process.env.VUE_APP_BASE_API
        }/captcha/captcha/getCaptcha/${
          this.verificationCodeToken
        }`
    },
    statusBarHeight(){
      return this.$root.$children[0].statusBarHeight
    },
  },
  mounted() {
    this.refreshVerificationCode()
  },
  methods: {
    refreshVerificationCode(){
      this.verificationCodeTokenStatus='获取中'
      getVerificationCodeToken()
        .then(({token} )=>{
          this.verificationCodeToken=token
          this.verificationCodeTokenStatus='已获得'
        })
        .catch(e=>{
          console.error(e)
          this.verificationCodeTokenStatus='获取失败'
        })
    },
    onSubmit() {
      this.$refs.formEl.validate((valid) => {
        if (valid) {
          verifyCode({
            token:this.verificationCodeToken,
            data:this.formInputData.verificationCode,
          })
            .then(()=>{
              loginReq(this.formInputData)
                .then(()=>{
                  this.$emit('pass')
                })
                .catch((e)=>{
                  if(e.message){
                    Message({
                      message:e.message,
                      type: "error",
                      duration: 2e3,
                      offset:this.statusBarHeight||32,
                    })
                  }else{
                    console.error('登录接口报错：',e)
                  }
                  this.refreshVerificationCode()
                  this.formInputData.verificationCode=null
                })
            })
            .catch((e)=>{
              if(e.msg){
                Message({
                  message:e.msg,
                  type: "warning",
                  duration: 2e3,
                  offset:this.statusBarHeight||32,
                })
              }else{
                console.error('验证码接口报错：',e)
              }
              this.refreshVerificationCode()
              this.formInputData.verificationCode=null
            })
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang='less'>
@import './login.less';
</style>