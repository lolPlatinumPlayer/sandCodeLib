分段加载组件（uniapp可用）
- 功能  
  - 分段加载  
  - 状态展示
  - 状态判断
- 使用方式
  - 必传参数
    - 列表数据（data）：list  
      初始值应为undefined  
    - 请求：req
    - 将后端数据转为前端数据的方法：getFrontEndData
  - 方法
    - 尝试请求：tryQueryNextFragment  
      - 方法参数即请求参数（不需要传『分段长度』和『分段序号』）  
      - 应在页面触底等需要加载数据的时候调用这个方法  
      - 方法返回一个promise，应将then方法的形参赋值给『列表数据（data）：list』  
      - 参数变更后，接到响应会用响应数据重置列表
    - 判断状态：getStatus  
      枚举值：undefined、加载中、加载成功、加载失败  
      其中undefined代表未开始加载
  - demo：pages/eNews/indexBody.vue
  - 更多内容  
    - props源码非必传部分
    - slot
    - methods（本组件的方法都是给外部调用的）

可优化空间
- 考虑把list prop做成双向绑定的
- 下拉后出现底部内容
  （用一句话说这个事有点抽象）  
  具体说就是目前上拉到尽头后页面里只有列表，而名为loading的slot只有在加载数据时才出现  
  上拉到尽头后就出现才是符合直觉的（甚至还没到尽头就应该出现）

版本：1.0.0 2021.11.11

<template>
  <div class='ProgressiveLoad' :style="comStyle">
    <template v-if="list">
      <slot></slot>
    </template>
    <slot name="loading" v-if="listStatus==='加载中'">
      <view class="status">
        数据加载中..
      </view>
    </slot>
    <view class="status" v-if="listStatus==='加载失败'">
      数据加载失败
    </view>
    <template v-if="list">
      <slot name="noMore" v-if="listMaxLen_real!==undefined&&list.length>=listMaxLen_real&&list.length!==0">
        <view class="status">没有更多了~</view>
      </slot>
      <slot name="noData" v-if="list.length===0 && listStatus==='加载成功'">
        <view class="status">暂无数据</view>
      </slot>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ProgressiveLoad',
  props:{
    list:{ // 枚举类型：undefined（或null）、数组 
      required:true,
    },
    req:{
      type:Function,
      required:true,
    },
    getFrontEndData:{
      type:Function,
      required:true,
    },

    fragmentLen:{ // 分段中每一段的长度
      type:Number,
      default:10,
    },
    fragmentLenParam:{ // 接口中代表分段长度的请求参数
      type:String,
      default:'pageSize',
    },
    fragmentIdxParam:{ // 接口中代表分段序号的请求参数
      type:String,
      default:'pageNo',
    },
    fragmentIdxStart:{ // 接口中分段序号（请求参数）从哪个数字开始
      type:Number,
      default:1,
    },
    getTotal:{ // 接口响应数据中代表总数的字段
      type:Function,
    },
    // listMaxLen:Number, // 列表最大长度（不输入的话会自己通过getTotal prop获得）
    comStyle:{},
  },
  components:{
  },
  data(){
    return {
      listStatus:undefined,//枚举值：undefined、加载中、加载成功、加载失败
      reqIdx:0,
      listMaxLen_real:undefined,
      lastReqNormalParams:undefined,
    }
  },
  mounted(){
  },
  methods:{
    tryQueryNextFragment(reqNormalParams={}){
      let list

      // 如果不是第一次请求，且当前请求参数和上一次不一致，则重置列表（这么做可以适应排序、搜索等场景）
      if(
        this.lastReqNormalParams!==undefined
        &&
        this.lastReqNormalParams!==JSON.stringify(reqNormalParams)
      ){
        list=undefined
        this.reqIdx=0
      }else{
        list=this.list
      }
      this.lastReqNormalParams=JSON.stringify(reqNormalParams)

      if(
        this.listStatus==='加载中'
        ||
        (
          list
          &&
          this.listMaxLen_real!==undefined
          &&
          list.length>=this.listMaxLen_real
        )
      ){return emptyPromise}
      this.listStatus='加载中'
      const {reqIdx}=this
      return this.req({
        ...reqNormalParams,
        [this.fragmentLenParam]:this.fragmentLen,
        [this.fragmentIdxParam]:reqIdx+this.fragmentIdxStart,
      })
        .then((resData) => {

          // 对于中途增减文章的情况。可以少渲染，但是不能出现请求不到尽头的bug
          const total=(this.getTotal??getTotalDefault)(resData)
          /* const _this=this
          debugger */
          if(this.listMaxLen_real===undefined){
            this.listMaxLen_real=total
          }else{
            this.listMaxLen_real=Math.min(this.listMaxLen_real,total)
          }

          const listFragment=this.getFrontEndData(resData)
          if(list===undefined||list===null/* 小程序里undefined传进组件会变成null */){
            list=[]
          }
          for(let i=0;i<listFragment.length;i++){
            // console.log('list',list)
            this.$set(list,reqIdx*this.fragmentLen+i,listFragment[i]) // 看起来好像没必要用$set
          }
          this.reqIdx=reqIdx+1
          this.listStatus='加载成功'
          return list
        })
        .catch(e=>{
          console.error(e)
          this.listStatus='加载失败'
          throw e
        })
    },
    getStatus(){
      return this.listStatus
    },
  },
}

function getTotalDefault(resData){
  return resData?.page?.totalElements
}

var emptyPromise=new Promise(()=>{})
</script>

<style lang='scss' scoped>
.ProgressiveLoad{
  .status{
    color: #ccc;
    font-size: 24rpx;
    text-align: center;
    padding: 28rpx 0;
  }
}
.no-data-img{
  width: 240rpx;
  height: 240rpx;
  display: block;
  margin: 0 auto;
}
</style>