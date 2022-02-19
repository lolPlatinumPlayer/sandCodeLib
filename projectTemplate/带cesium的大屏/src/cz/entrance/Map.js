import {Evented,} from './evented'

class Map extends Evented {
  isRemoved = false
  constructor({
    container,
    basicImg/* : {
      serviceCode , 服务编码
      serviceToken, 服务token
      // isUseService
    } */ = {},
    startCenter = {
      lng: 119.3056,
      lat: 26.1344,
      type: 'lngLat',
    },
    zoom = 15,
  } = {}) {
    super()
    if (!container) {
      console.error(container, '不是符合要求的container值')
    }

    const mapboxToken =
      'pk.eyJ1IjoiZmpocnQiLCJhIjoiY2twNjludGJ4MXdndjJxcHF6OG4xNG8wNSJ9.uQgEAC3O1SEzfGCG4LCtRg';
    const hideConfig = {
      animation: false, //（下方）动画控制不显示
      timeline: false, //（下方）时间线不显示
      fullscreenButton: false, //（右下角）全屏按钮不显示
      homeButton: false, //（右上角）homePage按钮不显示
      baseLayerPicker: false, //（右上角）地图选择按钮不显示
      sceneModePicker: false, //（右上角）球体地图与平面地图切换按钮不显示
      geocoder: false, //（右上角）搜索按钮不显示
      navigationHelpButton: false, //（右上角）提示信息按钮不显示
    };
    const viewer = new Cesium.Viewer(container, {
      ...hideConfig,
      imageryProvider: new Cesium.MapboxImageryProvider({
        mapId: 'mapbox.satellite',
        accessToken: mapboxToken,
      }),
      baseLayerPicker: false,
    });
    viewer._cesiumWidget._creditContainer.style.display = 'none'; // （下方）ion文字不显示
    // 屏蔽默认双击事件（防止双击后选中物体）
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );
    

  }
  // /**
  //  * 设置镜头
  //  * @param {Object} 配置对象
  //  * @param {StandardPointCoordLike} 配置对象.center 视图中心点坐标
  //  * @param {Number} [配置对象.zoom] 镜头贴近地面的程度
  //  * @param {Boolean} [配置对象.isSmooth=true] 是否缓动镜头
  //  * @returns {Map} 返回自身以允许链式调用
  //  * @instance
  //  * @memberof Map
  //  */
  // setCamera({
  //   center,
  //   zoom,
  //   isSmooth = true,
  // }) {
  //   if (this._basicMapTechCode === 'Leaflet1') {
  //     console.warn('目前basicMapTechCode为Leaflet1时不支持setCamera方法')
  //   } else {
  //     this._thingToFaceBasicMap.setCamera({
  //       center: center ? new StandardPointCoord(center) : undefined,
  //       zoom,
  //       isSmooth,
  //     })
  //   }
  //   return this
  // }
  // getBound(){
  //   if (this._basicMapTechCode === 'Mapbox1') {
  //     return this._thingToFaceBasicMap.getBound()
  //   } else {
  //     console.error(
  //       'getBound方法仅在basicMapTechCode（基础地图技术）为Mapbox1时生效，当前basicMapTechCode为：',
  //       this._basicMapTechCode
  //     )
  //   }
  // }
  // /**
  //  * 移除地图
  //  * @instance
  //  * @memberof Map
  //  */
  // remove() {
  //   this._thingToFaceBasicMap.remove()
  //   this.isRemoved = true
  // }
}

export default Map