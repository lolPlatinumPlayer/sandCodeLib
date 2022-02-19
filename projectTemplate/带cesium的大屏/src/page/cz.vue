<template>
  <div class="cz"></div>
</template>

<script>
import mapCenter from '../cz/mapCenter'

export default {
  name: 'cz',
  props:{
  },
  components:{
  },
  data(){
    return {
    }
  },
  mounted(){
    mapCenter.init({
      container:this.$el,
    })
  },
  methods:{
  },
}
</script>

<style lang='less' scoped>
.cz {
}
</style>