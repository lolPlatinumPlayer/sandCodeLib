<template>
  <div class='App' id="app">
    <mainstay />
  </div>
</template>

<script>
import mainstay from './views/mainstay'
import bus from './bus'

export default {
  name: 'App',
  props:{
  },
  components:{
    mainstay,
  },
  data(){
    return {
    }
  },
  beforeCreate(){
    bus.vueRootInstance=this
  },
  mounted(){
  },
  methods:{
  },
}
</script>

<style lang='less'>
@import './style/common.less';
.App{
  height: 100%;
}
</style>