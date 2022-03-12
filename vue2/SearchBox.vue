唯一和外部耦合的是elTabs.less，不过影响不大，不用也可以

版本：0.0.0 2022.03.04

<template>
  <div class="comp__searchBox">
    <div class="searchHead">
      <div class="inputMain">
        <div class="inputBox">
          <el-input
            v-model="searchWord"
            prefix-icon="el-icon-search"
            placeholder="请输入你要搜索的资源"
            @click.native="onInputClick"
            clearable
          ></el-input>
        </div>
        <div class="inputBtn" @click="onSearchBtnClick">搜索</div>
      </div>
    </div>
    <div class="searchResultBox popup" v-show="isShowSearchResult">
      <template v-if="searchResult">
        <div class="header">
          <div class="searchResultTotal">
            搜索结果
            <span class="searchResultTotalNum"> （{{ searchResult.length }}个） </span>
          </div>
          <div class="closeBtn" @click="isShowSearchResult = false">
            <i class="el-icon-close"></i>
          </div>
        </div>
        <div class="body">
          <div
            class="detailItem"
            v-for="item in searchResult"
            @click="onResultClick(item)"
            :key="item.id"
          >
            <div class="title">{{ item.name }}</div>
            <div class="address">位置：{{ item.site }}</div>
          </div>
        </div>
      </template>
      <template v-else>{{ dataSourceStatus }}</template>
    </div>
    <div class="quickSearch popup" v-if="isShowQuickSearch">
      <div class="header">
        <el-tabs v-model="quickSearchTab">
          <el-tab-pane label="快捷搜索" name="recommended"></el-tab-pane>
          <el-tab-pane label="搜索历史" name="history"></el-tab-pane>
        </el-tabs>
        <div class="closeBtn" @click="isShowQuickSearch = false">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div
        v-if="quickSearchTab === 'recommended'"
        class="recommendedBody body"
        v-loading="recommendedSearchStatus === '数据加载中'||!dataSource"
        key="recommended"
      >
        <template v-if="recommendedSearchStatus === '数据加载成功'&&dataSource">
          <div
            v-for="(text, i) in recommendedSearchList"
            class="item" 
            @click="onRecommendedWordClick(text)"
            :key="i"
          >
            {{ text }}
          </div>
        </template>
        <div class="loadFail" v-if="recommendedSearchStatus === '数据加载失败'">
          数据加载失败
        </div>
      </div>
      <div v-if="quickSearchTab === 'history'" class="body" key="history">
        <div
          class="detailItem"
          v-for="item in historyItemList"
          @click="onResultClick(item)"
          :key="item.id"
        >
          <div class="title">{{ item.name }}</div>
          <div class="address">位置：{{ item.site }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Toast from 'vant/lib/toast';
import { Message } from 'element-ui';
import { getRecommendedSearch } from '@/api/business';

export default {
  name: 'SearchBox',
  props:{
    /* 
    有可能为undefined
    有值的话是一个子项为对象的一维数组
    子项为：{
      name:搜索结果的名称,
      site:搜索结果的位置,
    }
    */
    dataSource:{
      type:Array,
    },
    dataSourceStatus:{
      type:String,
      required:true,
      validator:val=>{
        return ['数据加载中','数据加载成功','数据加载失败'].some(x=>x===val)
      },
    },
    reloadDataSource:{
      type:Function,
      required:true,
    },
  },
  components: {},
  data() {
    return {
      searchWord: '',

      // 虽然isShowSearchResult和isShowQuickSearch控制的面板在外观上是否相似
      // 但是在开关逻辑上极少重叠，唯一一处重叠就是点击搜索结果后都要关闭
      isShowSearchResult: false,
      isShowQuickSearch: false,

      quickSearchTab: 'recommended',
      recommendedSearchStatus: undefined,
      recommendedSearchList: undefined,
      historyItemList: undefined,
    };
  },
  watch: {
    dataSource:{
      handler(dataSource){
        if(dataSource){
          this.historyItemList = getHistoryItemListAndStorageWord(dataSource,getStorageHistoryWordList());
        }
      },
      immediate:true,
    },
    searchWord(val) {
      if (val) {
        this.isShowQuickSearch = false;
      }
    },
  },
  computed: {
    searchResult() {
      // console.log('this.searchWord',this.searchWord)
      if (this.searchWord) {
        if (this.dataSource) {
          this.isShowSearchResult = true;
          return this.dataSource.filter((x) => {
            return new RegExp(this.searchWord, 'i').test(x.name);
          });
        }
      } else {
        this.isShowSearchResult = false;
      }
    },
  },
  created() {
    this.recommendedSearchStatus = '数据加载中';
    getRecommendedSearch()
      .then((resData) => {
        this.recommendedSearchList = resData.list.map((x) => x.keyName);
        this.recommendedSearchStatus = '数据加载成功';
      })
      .catch((e) => {
        this.recommendedSearchStatus = '数据加载失败';
      });
  },
  methods: {
    onSearchBtnClick() {
      if (this.searchWord) {
        switch (this.dataSourceStatus) {
          case '数据加载中':
            this.isShowSearchResult = true;
            break;
          case '数据加载成功':
            if (this.isShowSearchResult) {
              Toast.success('搜索成功');
            } else {
              this.isShowSearchResult = true;
            }
            break;
          case '数据加载失败':
            this.isShowSearchResult = true;
            this.reloadDataSource();
            break;
        }
      } else {
        Message({
          message: '请输入文字再进行搜索',
          type: 'warning',
          duration: 2000,
          showClose: true,
        });
      }
    },
    onInputClick() {
      if (!this.searchWord) {
        this.isShowQuickSearch = true;
        this.quickSearchTab = this.$options.data().quickSearchTab;
      }
    },
    onResultClick(item) {

      // 关于搜索历史的处理
      const historyWordList=getStorageHistoryWordList()
      const {name:word}=item
      if(historyWordList.some(x=>x===word)){
        const seenIdx=historyWordList.findIndex(x=>x===word)
        historyWordList.unshift(historyWordList.splice(seenIdx,1)[0])
      }else{
        historyWordList.unshift(word)
      }
      this.historyItemList=getHistoryItemListAndStorageWord(this.dataSource,historyWordList)
    
      this.isShowSearchResult = false;
      this.isShowQuickSearch=false
      this.$emit('clickResult', item);
    },
    onRecommendedWordClick(text){
      // 100%有dataSource，因为在没有dataSource的时候禁止了推荐词的显示
      const data= this.dataSource.find((x) => {
        return text===x.name
      });
      if(data){
        this.onResultClick(data)
      }else{
        Message({
          message: '对不起，该词无法搜索',
          type: 'error',
          duration: 2000,
          showClose: true,
        });
        console.error('后端返回的快捷搜索用词在整体数据里找不到（整体数据也是后端返回的）')
      }
    },
  },
};

function getHistoryItemListAndStorageWord(dataSource,oldHistoryWordList) { 
  const historyItemList =[]
  const newHistory=oldHistoryWordList.filter(word=>{
    return dataSource.some(sourceItem=>{
      const isInDataSource=sourceItem.name===word
      if(isInDataSource){
        historyItemList.push(sourceItem)
      }
      return isInDataSource
    }) 
  })
  localStorage.setItem('historyWordList',JSON.stringify(newHistory))
  return historyItemList;
}

function getStorageHistoryWordList(){
  const origin=localStorage.getItem('historyWordList')
  return origin?JSON.parse(origin):[]
}
</script>
<style lang="less" scoped>
@import '../../../style/elTabs.less';

.comp__searchBox {
  position: relative;
  pointer-events: auto;
  .searchHead {
    .inputMain {
      .inputBox {
        display: inline-block;
        width: 283px;
        height: 40px;
        clip-path: polygon(20px 0, 100% 0, 263px 100%, 0 100%);
        background: linear-gradient(90deg, #071a35, #092c5b);
        ::v-deep {
          .el-input {
            .el-input__prefix {
              left: 20px;
              color: #0054e4;
            }
            .el-input__inner {
              background: none;
              border: 0;
              padding: 0 30px 0 50px;
              color: #fff;
            }
          }
        }
      }
      .inputBtn {
        display: inline-block;
        width: 83px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        font-size: 14px;
        color: #fff;
        clip-path: polygon(20px 0, 100% 0, 63px 100%, 0 100%);
        background: linear-gradient(90deg, #00265d, #0045a2);
        margin-left: -20px;
        cursor: pointer;
      }
    }
  }
  .quickSearch {
    .header {
      .elTabs();
      ::v-deep .el-tabs__item {
        height: 55px !important;
        line-height: 55px;
      }
    }
    .recommendedBody {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-start;
      align-content: flex-start;
      padding-left: 0 !important;
      padding-top: 4px;
      .item {
        margin-left: 20px;
        margin-top: 16px;
        font-size: 14px;
        line-height: 22px;
        color: #00bbff;
        border: 1px solid #00bbff;
        opacity: 1;
        border-radius: 4px;
        box-sizing: border-box;
        padding: 0 11px;
        cursor: pointer;
        &:hover {
          background: rgba(0, 187, 255, 1);
          color: #02114a;
        }
      }
      .loadFail {
        padding: 20px 10px;
        opacity: 0.7;
        text-align: center;
      }
    }
  }
  .popup {
    position: absolute;
    z-index: 2;
    width: 100%;
    left: 0;
    top: 60px;
    background: #02114a;
    border: 1px solid #26bcf3;
    color: #fff;
    border-radius: 2px;
    .header {
      height: 54px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.18);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      .searchResultTotal {
        .searchResultTotalNum {
          // color: #409eff;
        }
      }
      .closeBtn {
        cursor: pointer;
      }
    }
    .body {
      padding: 0 20px 20px;
      height: 300px;
      overflow: auto;
      box-sizing: border-box;
      .detailItem {
        position: relative;
        cursor: pointer;
        padding: 20px 0 20px 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.18);
        &::before {
          content: '\e617';
          font-family: 'iconfont' !important;
          position: absolute;
          left: 0;
          top: 25px;
          color: #09dcfb;
        }
        .title {
          font-size: 16px;
          color: #09dcfb;
        }
        .address {
          margin-top: 10px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }
  }
}
</style>
