<template>
  <div class='avatar'>
    <!-- {{$root.$children[0].username}} -->
    {{text}}
  </div>
</template>

<script>
import {getUserInfo,} from '@/auth'
import bus from '@/bus'

export default {
  name: 'avatar',
  props:{
  },
  components:{
  },
  data(){
    return {
      // text:undefined,
    }
  },
  computed:{
    text(){
      const storageUsername=this.$root.$children[0].username
      if(storageUsername===null){
        return null
      }else{
        return storageUsername.slice(0,2)
      }
    }
  },
  mounted(){
  },
  methods:{
  },
}
</script>

<style lang='less' scoped>
.avatar{
  background: #5193F3;
  border-radius: 50%;
  color:#fff;
  font-size: 64px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
</style>