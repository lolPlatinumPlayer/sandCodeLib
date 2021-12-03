数据源：list（prop）
- 子项属性
  - name  
    后续变更无效
  - backEndPath

版本：0.0.1 2021.11.17

<template>
  <div class="FileList">
    <div
      class="oneFile"
      v-for="(item, idx) in fileList"
      @click="onFileClick(item)"
      :class="{
        notSupport:
          item.openableStatus === '不可打开且原因未知' ||
          item.openableStatus === '格式不支持',
        isLastFile:idx===fileList.length-1,
      }"
      :key="idx"
    >
      <div class="firstRow">
        <div class="left">
          <i class="fileIco"></i>
          <span class="name com-ellipse">{{ item.name }}</span>
        </div>
        <span class="right">
          <template v-if="item.downloadStatus === '未下载'"> 下载 </template>
          <template v-if="item.downloadStatus === '下载中'">
            {{ item.percent }}%
          </template>
          <template v-if="item.downloadStatus === '下载成功'">
            <template
              v-if="
                item.openableStatus === '不可打开且原因未知' ||
                item.openableStatus === '格式不支持'
              "
            >
              无法打开
            </template>
            <template v-else> 打开 </template>
          </template>
          <template v-if="item.downloadStatus === '下载失败'">
            下载失败
          </template>
        </span>
      </div>
      <!-- <div class="secondRow">
        <i></i>
        <div class="text">暂不支持查看该格式附件，请转至公众号查看</div>
      </div> -->
    </div>
  </div>
</template>

<script>
/* 
下载成功的文件都会存进这个对象。存有2个属性：本地路径、是否可打开。
（其中本地路径在下载成功后是临时文件的路径，在保存成功后是长期存储的路径）
*/
const backendPathToFileInfo=new Map()

export default {
  name: "FileList",
  props: {
    list: Array,
    fileUrlPrefix:{
      type:String,
      default:''
    }
  },
  components: {},
  data() {
    return {
      fileList:[],
    };
  },
  mounted() {
    this.fileList=this.list.map(x=>{
      const fileInfo={
        name:x.name,
        backEndPath:x.backEndPath,
        downloadStatus:'未下载', // 枚举值：未下载、下载中、下载成功、下载失败
        saveStatus:'未保存', // 枚举值：未保存、保存中、保存成功、保存失败
        /* 
        openableStatus不可打开时是“格式不支持”还是“不可打开且原因未知”并不保证100%准确
        判断依据是后缀名，2021.09.26时谢新就表示后缀名有可能出现不正确情况
        其次，支持格式是从uniapp官网抄来的。在安卓等端就已经发现该列表不正确了，而且在未来是有可能变更的

        只要打不开就提示格式不支持（寿宁项目中2021.09.26和真真口头确认的）
        */
        openableStatus:'未知', // 枚举值：未知、可打开、格式不支持、不可打开且原因未知
        percent:0,
        localPath:undefined,
      }
      if(backendPathToFileInfo.has(fileInfo.backEndPath)){
        const cacheData=backendPathToFileInfo.get(fileInfo.backEndPath)
        fileInfo.downloadStatus='下载成功'
        fileInfo.localPath=cacheData.localPath
        fileInfo.openableStatus=cacheData.openableStatus
      }
      return fileInfo
    })
  },
  methods: {
    onFileClick(item) {
      switch (item.downloadStatus) {
        case "未下载":
        case "下载失败":
          this.download(item);
          break;
        case "下载成功":
          this.openFile(item);
          break;
      }
    },
    download(item) {
      const { backEndPath } = item;
      const downloadUrl = this.fileUrlPrefix + backEndPath; // 谢新说和查看接口图片的前缀一致 2021.09.09am
      console.log('下载地址：',downloadUrl)

      // #ifdef H5
      window.open(downloadUrl, "_blank ");
      // #endif

      // #ifndef H5
      item.downloadStatus = "下载中";
      const downloadTask = uni.downloadFile({
        url: downloadUrl,
        success: (res) => {
          if (res.statusCode === 200) { // 官网对statusCode的解释：开发者服务器返回的HTTP状态码
            const { tempFilePath } = res;
            console.log("下载成功", tempFilePath);
            item.localPath = tempFilePath;
            backendPathToFileInfo.set(backEndPath, {
              localPath: tempFilePath,
              openableStatus: "未知",
            });
            item.downloadStatus = "下载成功";

            item.saveStatus = "保存中";
            uni.saveFile({
              tempFilePath: res.tempFilePath,
              success: (x) => {
                item.localPath = x.savedFilePath;
                backendPathToFileInfo.get(backEndPath).localPath =
                  x.savedFilePath;
                item.saveStatus = "保存成功";
              },
              fail: (e) => {
                console.log("保存失败", e);
                item.saveStatus = "保存失败";
                uni.showToast({ title: "保存失败", icon: "none" });
              },
            });
          } else {
            console.log("success 的下载失败",res);
            item.downloadStatus = "下载失败";
          }
        },
        fail: (res) => {
          console.log("fail 的下载失败",res);
          item.downloadStatus = "下载失败";
        },
      });
      downloadTask.onProgressUpdate((res) => {
        item.percent = res.progress;
        // console.log('已经下载的数据长度' + res.totalBytesWritten);
        // console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);
      });
      // #endif
    },
    openFile(item) {
      const fileInfo = backendPathToFileInfo.get(item.backEndPath);
      uni.showLoading({
        title: "正在打开文件",
      });
      uni.openDocument({
        /* 
        - 不加escape
          安卓app、安卓小程序可用
        - 加escape  
          安卓小程序不可用
          https://www.cnblogs.com/lizhao123/p/11498948.html里说iOS要这样写对于文件名为中文的文件才可以成功
        */
        filePath: item.localPath,
        // filePath: escape(item.localPath),
        success: function (res) {
          console.log(item);
          item.openableStatus = "可打开"; // 这行在2021.09.23其实没被用到，只是为了方便调试增加的
          fileInfo.openableStatus = "可打开";
        },
        fail(e) {
          console.log(item);
          console.error("打开失败", e);
          const supportList = [
            "doc",
            "xls",
            "ppt",
            "pdf",
            "docx",
            "xlsx",
            "pptx",
          ];
          const fileExtension = item.backEndPath.split(".").slice(-1)[0];
          const isInSupportList = supportList.some((x) => x === fileExtension);
          const status = isInSupportList ? "不可打开且原因未知" : "格式不支持";
          item.openableStatus = status;
          fileInfo.openableStatus = status;
        },
        complete() {
          uni.hideLoading();
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.FileList {
  .oneFile {
    padding: 16rpx 0;
    border-bottom: 1px solid #eee;
    $icoSize: 48rpx;
    &.notSupport {
      .secondRow {
        display: flex;
      }
      .right {
        color: #999999 !important;
      }
    }
    &.isLastFile{
      border-bottom: none;
    }
    .firstRow {
      display: flex;
      justify-content: space-between;
      .left {
        display: flex;
        align-items: center;
        overflow: hidden;
        .fileIco {
          flex-shrink: 0;
          width: $icoSize;
          height: $icoSize;
          margin-right: 24rpx;
          border-radius: 4rpx;
          background-color: rgba(54, 113, 226, 1);
          background-image: url("https://snxc.fjoss.xstore.ctyun.cn/static/images/eNews/clip_white.png");
          // background-image: url('./clip_white.png');
          background-size: 28rpx 28rpx;
          background-position: center center;
          background-repeat: no-repeat;
        }
      }
      .right {
        flex-shrink: 0;
        color: rgba(54, 113, 226, 1);
      }
    }
    .secondRow {
      display: none;
      // justify-content: space-between;
      i {
        width: $icoSize;
        margin-right: 24rpx;
        flex-shrink: 0;
      }
      .text {
        color: #999999;
        font-size: 24rpx;
      }
    }
  }
}
</style>
