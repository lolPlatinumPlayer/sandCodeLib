<template>
  <div class='mainstay'>
    <div 
      class="projectBanner" 
      v-if="$route.meta.useBanner" 
      :class="[$route.meta.bannerBgColor,]"
      :style="{paddingTop:statusBarHeight}"
    >
      <i class="ico el-icon-arrow-left"
        v-if="$route.meta.useBannerBackBtn"
        @click="$router.go(-1)"
      ></i>
      <div class="text">{{$route.meta.bannerText}}</div>
      <avatar class="avatar" v-if="$route.meta.showAvatar" @click.native='$router.push("/yourInfo")'></avatar>
    </div>
    <transition>
      <router-view class="content"></router-view>
    </transition>
    <div class="bottomNavWrap" v-if="$route.meta.useBottomNav">
      <div class="bottomNav">
        <router-link 
          v-for="(dataItem,idx) in bottomNavData"
          :to="{name:dataItem.name}" 
          :key="idx"
          class="nav"
          :class="[
            dataItem.name,
            dataItem.name===$route.name||dataItem.name===$route.meta.fatherRoute?'selected':''
          ]"
          tag="div"
        >
          <div class="ico"></div>
          <div class="text">{{dataItem.text}}</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import avatar from '../view/system/avatar.vue'
import Dialog  from 'vant/lib/dialog';

export default {
  name: 'mainstay',
  props:{
  },
  components:{
    avatar,
  },
  data(){
    return {
      bottomNavData:[
        {
          name:'aaaaa',
          text:'aaaaa',
        },
        {
          name:'bbbb',
          text:'bbbb',
        },
        {
          name:'aaaaa',
          text:'',
        },
        {
          name:'bbbb',
          text:'bbbb',
        },
        {
          name:'aaaaa',
          text:'aaaaa',
        },
      ],
    }
  },
  computed:{
    statusBarHeight(){
      return this.$root.$children[0].statusBarHeight+'px'
    },
  },
  mounted(){
    this.$router.beforeEach ((to, from, next) => {
      // console.log('beforeEach',to, from)
      next()
    })
  },
  methods:{
    goBack(){
      this.$router.go(-1)
    },
  },
}
</script>

<style lang='less' scoped>
.mainstay{
  height: 100%;
  display: flex;
  flex-direction: column;
  .projectBanner,.bottomNavWrap{
    pointer-events: auto;
  }
  .avatar{
    background: #ed655d;
  }
  .content{
    flex-grow: 1;
    overflow: auto;
  }
  .bottomNavWrap{
    flex-shrink: 0;
    @spaceSize:5vw;
    height: 17.8vw-@spaceSize;

    .bottomNav{
      display: flex;
      height: 17.8vw;
      transform: translate(0,-@spaceSize);
      background-size: 100% 100%;
      .nav{
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        &.selected{
          .text{color:#E52317;}
        }
        .ico{
          width: 6vw;
          height: 6vw;
          background-size: 100% 100%;
        }
        .text{
          text-align: center;
          font-size: 3.2vw;
          line-height: 5.6vw;
          color:#666666;
        }
      }
    }
  }
}
</style>