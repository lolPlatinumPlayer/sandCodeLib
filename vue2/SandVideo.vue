目前只做了直播功能（要不要加普通视频的功能还没想好）

说明
- 不传视频地址的话则只渲染封面图
- 视频地址可以用liveVideoUrl传也可以用videoPlayerOption.sources[0].src传
- 有提供加载失败的占位插槽
  名为placeholder

注意
- 不要中途去变更配置项（videoPlayerOption）  
  不保证变更后会生效

已知bug
- 如果一开始就进入包含该组件的页面的话  
  不会默认播放

非重点内容
- 本组件比vue-video-player厉害的地方
  本组件在安卓webview里可以和ng配合限制refer
  vue-video-player限制后会播放失败（因为使用的video.js版本不够新）

需要依赖
- jsUtil
- 静态版video-js7.15.4

版本
2021.09.29

<template 不要在sn大屏里更新（因为要改.video-player，还要改依赖）>
  <div class='SandVideo' :style="sizeStyle">
    <template v-if="finalVideoPlayerOption.sources[0].src">
      <template v-if="isPlayFail">
        <slot v-if="$slots.placeholder" name="placeholder"></slot>
        <div v-else class="liveFailReason">
          视频加载失败
        </div>
      </template>
      <div v-else class="container">
        <video ref="video" class="video-js"></video>
      </div>
    </template>
    <img v-else class="coverImg" :src="coverImgSrc" :alt="coverAlt">
  </div>
</template>

<script>
import {mergeObj} from '@/utils/js'

export default {
  name: 'SandVideo',
  props:{
    liveVideoUrl:[String,Boolean],
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
  data(){
    return {
      isPlayFail:null,
      player:undefined,
    }
  },
  computed: {
    finalVideoPlayerOption(){
      const optionBeforeMerge= {
        fluid:true,
        autoplay:true,
        sources: [{
          withCredentials: false,
          type: "application/x-mpegURL",
          src:this.liveVideoUrl,
        }],
        /* controlBar: {
          fullscreenToggle: false,
        }, */
        controls:true,
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
      /* console.log('finalVideoPlayerOption:')
      console.log(this.finalVideoPlayerOption)
      console.log('style:')
      console.log(style) */
      return style
    },
  },
  mounted(){
    this.$nextTick(this.init)
  },
  beforeDestroy(){
    this.player.dispose()
  },
  methods:{
    init(){
      // 这一块代码源自vue-video-player的playsinline prop
      this.$refs.video.setAttribute('playsinline', this.playsinline)
      this.$refs.video.setAttribute('webkit-playsinline', this.playsinline)
      this.$refs.video.setAttribute('x5-playsinline', this.playsinline)
      this.$refs.video.setAttribute('x5-video-player-type', 'h5')
      this.$refs.video.setAttribute('x5-video-player-fullscreen', false)

      const self = this
      this.player = videojs(this.$refs.video, this.finalVideoPlayerOption, function onPlayerReady() {
        this.on('loadeddata',()=>{
          self.onPlayerLoadeddata(self.player)
          self.$emit('loadeddata',self.player)
        })
        this.on('error',()=>{
          self.isPlayFail=true
          self.$emit('error',self.player)
        })
        this.on('ended',()=>{
          self.$emit('ended',self.player)
        })
      })
    },
    onPlayerLoadeddata(player) {
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
  .container{
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
}
::v-deep{
  .video-js{
    margin: auto;
  }
  .vjs-big-play-button { // 居中video.js的播放按钮
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .vjs-poster{ // 调整video.js的封面图尺寸
    background-size: cover;
  }
}
</style>