组件名：字典下拉框 
只需要输入字典编码，就可以使用该组件
- 会全局缓存字典 
- 有状态 
  - 有加载中状态 
  - 有加载失败状态 
- 有所有el-select的传参与事件 
- 默认有“全部”这个选项  
  不想要的话可以把isShowAllOption设为false

版本：0.0.1 2021.12.07
<template>
  <div v-if="status==='加载失败'" class="DictDropdown fail">
    加载失败
  </div>
  <el-select
    v-else
    class="DictDropdown"
    ref="select"
    v-loading="status==='加载中'"
    v-bind:value="value"
    v-on:input="$emit('input', $event)"
    v-bind="$attrs"
  >
    <el-option
      v-for="item in list"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    ></el-option>
  </el-select>
</template>

<script>
import { getDataDictionaryList } from "@/api/wordBooks";
const cacheDict = {};
const FAIL_TEXT='加载失败'

export default {
  name: "DictDropdown",
  props: {
    value:{},
    code:{
      type:String,
      required:true,
    },
    isShowAllOption:{
      type:Boolean,
      default:true
    }
  },
  components: {},
  data() {
    return {
      list:[],
      status:undefined, // 枚举值：undefined 加载中 加载成功 加载失败
      FAIL_TEXT,
    };
  },
  mounted() {
    for (const eventName in this.$listeners) {
      const listener = this.$listeners[eventName];
      this.$refs.select.$on(eventName, listener);
    }

    const queryResult=queryDict(this.code)
    if(queryResult instanceof Promise){
      this.status='加载中'
      queryResult
        .then(originList=>{
          this.setList(originList)
          this.status='加载成功'
        })
        .catch(e=>{
          this.status='加载失败'
        })
    }else{
      this.setList(queryResult)
    }
  },
  methods: {
    setList(origin){
      if(this.isShowAllOption){
        this.list=[
          {label:'全部',value:''},
          ...origin,
        ]
      }else{
        this.list=origin
      }
    },
  },
};

function queryDict(code) {
  if (code in cacheDict && cacheDict[code]!==FAIL_TEXT) {
    return cacheDict[code];
  } else {
    return req(code);
  }
}
function req(code) {
  return getDataDictionaryList({dictType: code, parentCode:code})
    .then(res => {
      cacheDict[code] = res.data.map(x=>{
        return{
          label:x.dictName,
          value:x.dictCode
        }
      })
      return JSON.parse(JSON.stringify(cacheDict[code]))
    })
    .catch(e=>{
      cacheDict[code] = FAIL_TEXT;
      console.error(e)
    })
}
</script>

<style lang="scss" scoped>
.DictDropdown.fail {
  color:gray;
}
</style>
