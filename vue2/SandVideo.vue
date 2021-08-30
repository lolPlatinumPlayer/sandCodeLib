目前只做了直播功能（要不要加普通视频的功能还没想好）

说明
- 不要中途去变更配置项（videoPlayerOption）  
  不保证变更后会生效

需要依赖
- "vue-video-player": "^5.0.2"
- jsUtil

版本
2021.08.24 相对于2021.08.16版本来说，只是加了注释和调试代码

<template>
  <div class='SandVideo'>
    <template v-if="liveVideoUrl">
      <div v-if="isPlayFail"
        class="liveFailReason"
      >
        视频加载失败
      </div>
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
    <img v-else class="coverImg" :src="coverImgSrc" :alt="isUseAlt?'封面图未取得':''">
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
import { Message } from 'element-ui';

// Message({message:6661})


export default {
  name: 'SandVideo',
  props:{
    liveVideoUrl:[String,Boolean],
    coverImgPath:String,
    isUseAlt:{
      type:Boolean,
      default:true,
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
      const optionBeforeMerge= {
        fluid:true,
        autoplay:true,
        sources: [{
          withCredentials: false,
          type: "application/x-mpegURL",
          src:this.liveVideoUrl,
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