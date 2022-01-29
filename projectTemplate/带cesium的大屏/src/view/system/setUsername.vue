<template>
  <div class="setUsername">
    <div class="desc">
      <b>修改用户名</b>
      <div>用户名长度不超过20个字符</div>
    </div>
    <van-form validate-first ref="formEl">
      <van-cell-group>
        <van-field
          v-model="username"
          name="username"
          label="用户名"
          placeholder="请输入用户名"
          autocomplete="off"
          :rules="usernameRule"
        >
          <template #button v-if="username">
            <van-icon
              class="clearBtn"
              name="close"
              @click="username=null"
            />
          </template>
        </van-field>
      </van-cell-group>
    </van-form>
    <div class="confirmBtn" @click="trySetUsername">
      确认
    </div>
  </div>
</template>

<script>
import Toast from 'vant/lib/toast';
import {getUserInfo,} from '@/auth'
import {setUserName} from '@/api/system'

export default {
  name: "setUsername",
  props: {},
  components: {},
  data() {
    return {
      username: getUserInfo().username,
      usernameRule:[
        {
          required: true,
          message:'请输入用户名'
        },
        {
          validator(val){
            return val.length<=20
          },
          message:'用户名不能多于20个字符'
        },
        {
          validator(val){
            return !/ /.test(val)
          },
          message:'用户名不允许包含空格'
        },
      ],
    };
  },
  mounted() {},
  methods: {
    trySetUsername(){
      this.$refs.formEl.validate()
        .then(x=>{
          setUserName(this.username)
            .then(e=>{
              Toast('用户名修改成功')
              this.$router.go(-1)
            })
            .catch(e=>{
              console.log(e);
              Toast(e.message||'用户名修改失败')
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
.setUsername {
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
  .clearBtn{
    font-size: 20px;
  }
  .confirmBtn{
    .confirmBtn()
  }
}
</style>
