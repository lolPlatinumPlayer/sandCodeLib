
说明
- 不传视频地址的话则只渲染封面图
- 视频地址可以用liveVideoUrl传也可以用videoPlayerOption.sources[0].src传  
  （后者优先级更高）
- 有提供加载失败的占位插槽
  名为placeholder

注意
- 不要中途去变更配置项（videoPlayerOption）  
  不保证变更后会生效（播放地址除外）

已知bug
- 如果一开始就进入包含该组件的页面的话  
  不会默认播放

非重点内容
- 本组件比vue-video-player厉害的地方
  本组件在安卓webview里可以和ng配合限制refer
  vue-video-player限制后会播放失败（因为使用的video.js版本不够新）
- 可以中途变更liveVideoUrl和videoPlayerOption.sources[0].src

需要依赖
- jsUtil（版本不低于2021.10.18）
- 静态版video-js7.15.4

版本
1.0.0 2021.10.18
1版本和0版本的区别：1版本不需要依赖vue-video-player

<template>
  <div class='SandVideo' :style="sizeStyle">
    <template v-if="finalVideoUrl">
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
    <img v-else-if="coverImgPath" class="coverImg" :src="coverImgSrc" :alt="coverAlt">
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
  watch:{
    liveVideoUrl(){
      this.changeVideoUrl()
    },
    'videoPlayerOption.sources.0.src'(){
      this.changeVideoUrl()
    },
  },
  computed: {
    finalVideoUrl(){
      return this.videoPlayerOption?.sources?.[0]?.src??this.liveVideoUrl
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
        /* controlBar: {
          fullscreenToggle: false,
        }, */
        controls:true,
        flash: { hls: { withCredentials: false }},
        html5: { hls: { withCredentials: false }},
        poster: this.coverImgSrc,
      }
      const result=mergeObj(optionBeforeMerge,this.videoPlayerOption)
      result.sources[0].src=this.finalVideoUrl
      // console.log('finalVideoPlayerOption',result)
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
    this.$nextTick(this.initVideo)
  },
  beforeDestroy(){
    this.player.dispose()
  },
  methods:{
    initVideo(){
      if(!this.finalVideoUrl){ // 如果没输入视频地址则不初始化视频
        if(!this.coverImgPath){
          console.error('既没输入视频地址也没输入封面图地址')
        }
        return
      }

      // 这一块代码源自vue-video-player的playsinline prop。vue-video-player对此的注释是“ios fullscreen”
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
    changeVideoUrl(){
      if(this.player){
        this.player.src(this.finalVideoUrl)
      }else{
        this.$nextTick(()=>{
          this.initVideo()
          this.player.src(this.finalVideoUrl)
        })
      }
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