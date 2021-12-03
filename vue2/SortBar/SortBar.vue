功能：列表排序
uniapp可用

注意
- 后期变更list（prop）是无效的

版本：0.0.1 2021.11.22

<template>
  <div class='SortBar'>
    <div class="title item">排序</div>
    <div 
      class="sortBtn item" 
      v-for="(item,i) in internalList" 
      @click="onSort(item)"
      :key="i"
    >
      <span class="label" :class="{isSelected:item.status}">
        {{item.label}}
      </span>
      <SortSymbol :status="item.status" />
    </div>
  </div>
</template>

<script>
import SortSymbol from './SortSymbol'

export default {
  name: 'SortBar',
  props:{
    list:{
      type:Array,
      default(){
        return [
          {label:'最新',key:'new'},
          {label:'热门',key:'hot'},
        ]
      }
    }
  },
  components:{
    SortSymbol,
  },
  data(){
    return {
      internalList:[],
    }
  },
  mounted(){
    this.internalList=this.list.map(x=>{
      return{
        status:undefined,
        ...x,
      }
    })
  },
  methods:{
    onSort(sortItemData){
      this.internalList.forEach((listItem,i)=>{
        if(listItem===sortItemData){
          if(sortItemData.status){
            sortItemData.status=sortItemData.status==='up'?'down':'up'
          }else{
            sortItemData.status='down'
          }
        }else{
          listItem.status=undefined
        }
      })
      this.$emit('change',JSON.parse(JSON.stringify(this.internalList)))
    },
  },
}
</script>

<style lang='scss' scoped>
.SortBar{
  position: sticky;
  top:calc(var(--status-bar-height) + 86rpx);
  display: flex;
  height: 88rpx;
  padding: 0 35rpx;
  justify-content: space-between;
  align-items: center;
  font-size: 32rpx;
  background: #FFFFFF;
  box-shadow: 0px 0px 15px rgba(31, 50, 74, 0.06);
  .title{
    color: #999999;
  }
  .sortBtn{
    display: flex;
    align-items: center;
    .label{
      margin-right: 8rpx;
      color: #333333;
      &.isSelected{
        color: #3671E2;
      }
    }
  }
}
</style>