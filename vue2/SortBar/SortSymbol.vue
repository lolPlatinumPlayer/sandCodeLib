<template>
  <div class="SortSymbol" :class="status">
    <i class="top"></i>
    <i class="bottom"></i>
  </div>
</template>

<script>



export default {
  name: 'SortSymbol',
  props:{
    status:{
      validator(val){
        const ENUM=[null,undefined,'up','down']
        return ENUM.some(x=>x===val)
      }
    }
  },
  components:{
  },
  data(){
    return {
    }
  },
  mounted(){
  },
  methods:{
  },
}
</script>

<style lang='scss' scoped>
.SortSymbol{
  $size:8rpx;
  &.up i.top{
    border-bottom-color: #3671E2;
  }
  &.down i.bottom{
    border-top-color: #3671E2;
  }
  i{
    display: block;
    width: 0;
    height: 0;
    border-left:$size solid transparent;
    border-right: $size solid transparent;
    &.top{
      border-bottom-width: $size*1.4;
      border-bottom-style: solid;
      border-bottom-color: #ccc;
      margin-bottom: $size/2;
    }
    &.bottom{
      border-top-width: $size*1.4;
      border-top-style: solid;
      border-top-color: #ccc;
    }
  }
}
</style>