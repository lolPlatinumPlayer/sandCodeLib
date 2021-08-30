
程序流程
1. 判断超长
2. 拆成多行
3. 加上“更多”

功能说明
1. 目前没有做判断最大行数的功能，最大行数是手动输入的
2. 目前没有做判断单行最大英文字母数的功能，这个值是手动设置的

问题排查
1. 处于最大行数，但是被判断为超长  
   这个应该是样式问题  
   需要检查下样式里是不是设置了height而且height不是line-height的整数倍

版本
2021.08.25am

<template>
  <div class='SandMultiParagraph' :class="{isOverflowMode}" :style="isChangeDom?{height:'auto',opacity:0}:{}">
    <template v-if="isOverflowMode">
      <div
        class="row" 
        :class="getRowClass(row,idx)" 
        v-for="(row,idx) in rowList" 
        :key="idx"
      >
        <div class="moreBtn" v-if="idx+1===maxRowNum" @click="$emit('moreBtnClick')">
          【更多】
        </div>
        <span v-if="!row.text&&row.text!==0" v-html="'&nbsp;'"><!-- 在空串或没有文本时也占据一行 --></span>
        {{row.text}}
      </div>
    </template>
    <template v-else>
      <div class="paragraph" v-for="(paragraph,idx) in paragraphList" :key="idx">
        {{paragraph}}
      </div>
    </template>
  </div>
</template>

<script>
const zhWiderThenNum=1.75//目前测量得到一个中文字符相当于1.75个数字字符

export default {
  name: 'SandMultiParagraph',
  props:{
    paragraphList:Array,
    maxRowNum:{
      type:Number,
      default:4,
    },
    maxLetterNum:{ // 如果都是英文的话，一行最多放多少字
      type:Number,
      default:46,
    },
  },
  components:{
  },
  data(){
    return {
      isChangeDom:false,
      isOverflowMode:false,
      rowList:undefined,//溢出模式（overflowMode）下每行的文本
    }
  },
  watch:{
    paragraphList:{
      handler(paragraphList){
        this.onChange()
      },
      immediate:true,
    }
  },
  /* // 目前都是宽高写死，没必要监听窗口变化了
  mounted(){
    window.addEventListener('resize',this.onChange)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onChange)
  }, */
  methods:{
    onChange(){
      // console.log(this,'outside')
      if(this.$el===undefined){
        this.$nextTick(core)
      }else{
        core.bind(this)()
      }

      function core(){
      // console.log(this,'inside')
        const dom=this.$el
        const domH=dom.getBoundingClientRect().height
        this.isChangeDom=true
        this.$nextTick(()=>{
          const domFreeH=dom.getBoundingClientRect().height
          // const isOverflow=false
          // debugger
          const isOverflow=domFreeH>domH
          if(isOverflow){
            this.goOverflowMode()
          }else{
            this.isOverflowMode=false
          }
          this.isChangeDom=false
        })
      }
    },
    goOverflowMode(){
      this.rowList=[]
      for(let i=0;i<this.paragraphList.length;i++){
        const paragraphText=this.paragraphList[i]
        const paragraphCharacterNum=paragraphText.length
        for(let addedCharacterNum=0;addedCharacterNum<paragraphCharacterNum;){
          const currentAddCharacterNum=getCharacterNum({
            str:paragraphText,
            beginIdx:addedCharacterNum,
            maxLetterNum:addedCharacterNum===0
              ?this.maxLetterNum-Math.ceil(zhWiderThenNum*2) // 只能多减不能少减
              :this.maxLetterNum
          })
          this.rowList.push({
            isFirstRowOfParagraph:addedCharacterNum===0,
            text:paragraphText.slice(addedCharacterNum,addedCharacterNum+currentAddCharacterNum)
          })
          addedCharacterNum+=currentAddCharacterNum

          if(this.rowList.length===this.maxRowNum){
            this.isOverflowMode=true
            return
          }
        }
      }
      this.isOverflowMode=true
    },
    getRowClass(row,idx){
      const isLastRow=idx+1===this.maxRowNum
      return{
        isFirstRowOfParagraph:row.isFirstRowOfParagraph,
        isLastRow,
        oneRowText:isLastRow,
      }
    },
  },
}

/* 
返回指定长度下的字符数量（这个长度指的是视图上的长度）

输入字符串、初始开始检索的字符的序号、长度（相当于多少个英文字母）
*/
function getCharacterNum({
  str,
  beginIdx=0,
  maxLetterNum/*最长相当于多少个英文字母*/,
}){
  let sum=0//累计长度相当于多少个英文字母
  const restStr=str.slice(beginIdx)
  for(let i=0;i<restStr.length;i++){
    if(isZhWidth(restStr[i])){
      sum+=zhWiderThenNum
    }else{
      sum++
    }

    if(sum===maxLetterNum){
      return i+1
    }else if(sum>maxLetterNum){
      return i
    }
  }
  return restStr.length
}

function isZhWidth(character){ // 判断字符是不是有中文字符那么宽
  if(typeof character!=='string'||character.length!==1){
    console.error('出现了错误')
    debugger
  }
  // 和中文字符一样宽的字符                            微软雅黑上”“‘’这4个字符是和汉字一样宽的
  const reg=/[\u4e00-\u9fa5]|[。]|[？]|[！]|[，]|[、]|[”]|[“]|[‘]|[’]|[；]|[：]|[（]|[）]|[《]|[》]|[（]|[）]|[【]|[】]|[『]|[』]|[「]|[」]|[﹃]|[﹄]|[〔]|[〕]|[～]|[﹏]|[￥]|[｛]|[｝]/
  return reg.test(character)
}
</script>

<style lang='less'>
.SandMultiParagraph{
  position: relative;
  overflow: hidden;
  @paragraphTextIndent:30px;
  &.isOverflowMode{
    .row{
      &.isFirstRowOfParagraph{
        text-indent: @paragraphTextIndent;
        // padding-left: @paragraphTextIndent;
      }
      &.isLastRow{
        // padding-right: 60px;
      }
    }
    .moreBtn{
      float: right;
      cursor: pointer;
      color:rgba(37, 223, 252, 1);
      position: relative;//不加这个在firefox下会被东西盖住（应该是文本盖的）
    }
  }
  .paragraph{
    text-indent: @paragraphTextIndent;
  }
}
</style>