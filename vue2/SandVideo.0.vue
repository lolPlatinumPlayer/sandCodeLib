
说明
- 不传视频地址的话则只渲染封面图
- 有提供加载失败的占位插槽
  名为placeholder

注意
- 不要中途去变更配置项（videoPlayerOption）  
  不保证变更后会生效

需要依赖
- "vue-video-player": "^5.0.2"
- jsUtil

版本
0.1.0 2021.11.05

<template>
  <div class='SandVideo' :style="sizeStyle">
    <template v-if="videoUrl">
      <template v-if="isPlayFail">
        <slot v-if="$slots.placeholder" name="placeholder"></slot>
        <div v-else class="liveFailReason">
          视频加载失败
        </div>
      </template>
      <videoPlayer
        v-else
        ref="videoPlayer"
        class="video-player vjs-custom-skin"
        :playsinline="true"
        :options="finalVideoPlayerOption"
        @loadeddata="onPlayerLoadeddata($event)"
        @error="isPlayFail=true"
      />
    </template>
    <img v-else class="coverImg" :src="coverImgSrc" :alt="coverAlt">
  </div>
</template>

<script>
import {mergeObj} from '@/utils/js'
import { videoPlayer } from 'vue-video-player';
import 'video.js/dist/video-js.css';

// 为直播增加的代码
import videojs from 'video.js'
window.videojs = videojs // 这行也是必需的
require('videojs-contrib-hls/dist/videojs-contrib-hls.js')

export default {
  name: 'SandVideo',
  props:{
    videoUrl:[String,Boolean],
    videoType:{
      type:String,
      validator(val){
        return ['live','static'].some(x=>x===val)
      },
      default:'live'
    },
    coverImgPath:String,
    coverAlt:{
      type:String,
      default:'封面图未取得',
    },
    videoPlayerOption:{
      type:Object,
      default:function () {
        return {}
      },
    },
  },
  components:{
    videoPlayer,
  },
  data(){
    return {
      isPlayFail:null,
    }
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player;
    },
    finalVideoPlayerOption(){
      const videoTypeToSourceType={
        live:"application/x-mpegURL",
        static:'video/mp4',
      }
      const optionBeforeMerge= {
        fluid:true,
        autoplay:true,
        sources: [{
          type: videoTypeToSourceType[this.videoType],
          src:this.videoUrl,
        }],
        controlBar: {
          timeDivider: false,
          durationDisplay: false,
        },
        flash: { hls: { withCredentials: false }},
        html5: { hls: { withCredentials: false }},
        poster: this.coverImgSrc,
      }
      const result=mergeObj(optionBeforeMerge,this.videoPlayerOption)
      return result
    },
    coverImgSrc(){
      return `${process.env.VUE_APP_STATIC_RESOURCE_PREFIX}${this.coverImgPath}`
    },
    sizeStyle(){ // 如果设置了视频尺寸，那占位图的尺寸也要保持一致
      const style={}
      if('width' in this.finalVideoPlayerOption){
        style.width=this.finalVideoPlayerOption.width+'px'
      }
      if('height' in this.finalVideoPlayerOption){
        style.height=this.finalVideoPlayerOption.height+'px'
      }
      return style
    },
  },
  mounted(){
  },
  methods:{
    onPlayerLoadeddata(player) {
      // alert(1)
      // Message({message:this.finalVideoPlayerOption.autoplay})
      if(this.finalVideoPlayerOption.autoplay){
        // player.play()
      }
    },
  },
}
</script>

<style lang='less' scoped>
.SandVideo{
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 100px;
  .video-player{
    flex-grow: 1;
    align-self: flex-start;
  }
  .liveFailReason{
    font-size: 16px;
    letter-spacing: 2px;
  }
  .coverImg{
    // position: absolute;left: 0;top: 0;
    width: 100%;
    height: 100%;
  }
  /deep/.video-js{
    margin: auto;
  }
}
</style>