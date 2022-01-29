<template>
  <div class="setPsw">
    <div class="desc">
      <b>修改账户密码</b>
      <div>密码包含6~20个字符，同时包含数字和字母</div>
    </div>
    <van-form validate-first ref="formEl">
      <van-cell-group>
        <van-field
          v-model="form.oldPwd"
          name="oldPwd"
          label="旧密码"
          :type="isHideOldPwd ? 'password' : ''"
          placeholder="请输入旧密码"
          autocomplete="off"
          :rules="[{
          required:true,
        }]"
        >
          <template #button>
            <van-icon
              class="switch"
              :name="isHideOldPwd ? 'eye-o' : 'closed-eye'"
              @click="isHideOldPwd = !isHideOldPwd"
            />
          </template>
        </van-field>
        <van-field
          v-model="form.newPwd"
          name="newPwd"
          label="新密码"
          :type="isHideNewPwd ? 'password' : ''"
          placeholder="请输入新密码"
          autocomplete="off"
          :rules="pwdRule"
        >
          <template #button>
            <van-icon
              class="switch"
              :name="isHideNewPwd ? 'eye-o' : 'closed-eye'"
              @click="isHideNewPwd = !isHideNewPwd"
            />
          </template>
        </van-field>
        <van-field
          v-model="form.newPwd2"
          name="newPwd2"
          label="新密码"
          :type="isHideNewPwd2 ? 'password' : ''"
          placeholder="请再次输入新密码"
          autocomplete="new-password"
          :rules="pwdRule"
        >
          <template #button>
            <van-icon
              class="switch"
              :name="isHideNewPwd2 ? 'eye-o' : 'closed-eye'"
              @click="isHideNewPwd2 = !isHideNewPwd2"
            />
          </template>
        </van-field>
      </van-cell-group>
    </van-form>
    <div class="confirmBtn" @click="trySetPwd">
      确认
    </div>
  </div>
</template>

<script>
import Toast from 'vant/lib/toast';
import {getUserInfo,} from '@/auth'
import {sePwd} from '@/api/system'

export default {
  name: "setPsw",
  props: {},
  components: {},
  data() {
    return {
      form:{
        oldPwd: undefined,
        newPwd: undefined,
        newPwd2: undefined,
      },
      isHideOldPwd:true,
      isHideNewPwd: true,
      isHideNewPwd2: true,
      pwdRule:[
        {
          validator(val){
            return val.length>=6
          },
          message:'密码不能少于6个字符'
        },
        {
          validator(val){
            return val.length<=20
          },
          message:'密码不能多于20个字符'
        },
        {
          validator(val){
            return /[a-zA-Z]/.test(val)
          },
          message:'密码缺少字母'
        },
        {
          validator(val){
            return /[0-9]/.test(val)
          },
          message:'密码缺少数字'
        },
      ],
    };
  },
  mounted() {},
  methods: {
    trySetPwd(){
      this.$refs.formEl.validate()
        .then(x=>{
          sePwd(this.form)
            .then(e=>{
              Toast('密码修改成功')
              this.$router.go(-1)
              // this.$router.push({name:'yourInfo'})
            })
            .catch(e=>{
              Toast(e.message||'密码修改失败')
            })
        })
        .catch(e=>{
          console.log('表单校验不通过',e)
        })
    },
  },
};
</script>

<style lang="less" scoped>
@import './confirmBtn';
.setPsw {
  .desc {
    padding: 27px;
    b {
      font-size: 32px;
    }
    div {
      font-size: 24px;
      margin-top: 10px;
    }
  }
  .switch{
    font-size: 42px;
  }
  .confirmBtn{
    .confirmBtn()
  }
}
</style>
