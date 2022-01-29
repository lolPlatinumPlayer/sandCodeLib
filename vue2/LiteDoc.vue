组件名：轻文档

组件功能：
1. 产生段落
   识别段落的依据是：'---'
   （也就是说：输入的文本会依据'---'拆成各个段落）
2. 换行
   识别文本中的换行符，在有换行符的地方进行换行

版本：2021年4月左右 0.0.0

<template>
  <div class="liteDoc" :class="classList">
    <div class="errorDescriptionList" v-for="(info,idx) in errorDescription" :key="idx">
      {{info.text}}
      <div v-for="(childInfo,index) in info.children" :key="index">{{childInfo}}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LiteDoc',
  props: ['input'],
  computed: {
    errorDescription() {
      let errorDescription = this.input?.split('---') || [];
      return this.errorDescriptionerrorDescription(errorDescription);
    },
    classList() {
      return {
        errorDescription:
          this.errorDescription.length > 1 ||
          (this.errorDescription.children && this.errorDescription.children.length),
      };
    },
  },
  methods: {
    errorDescriptionerrorDescription(errorDescription) {
      // 格式整理
      return errorDescription.map((item) => {
        let info = item.split(/(\r\n|\n|\r)/gm);
        return { text: info[0], children: info.slice(1) };
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.liteDoc {
  flex: 1;
}
.errorDescription {
  display: block !important;
  .errorDescriptionList + .errorDescriptionList {
    margin-top: 10px;
  }
}
</style>