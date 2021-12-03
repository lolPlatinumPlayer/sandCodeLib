import Vue from 'vue'

// import Toast from 'vant/lib/toast';
import 'vant/lib/toast/style';
// import ImagePreview from 'vant/lib/image-preview';
import 'vant/lib/image-preview/style';

import Form  from 'vant/lib/form';
import 'vant/lib/form/style';
import Field from 'vant/lib/field';
import 'vant/lib/field/style';
import CellGroup from 'vant/lib/cell-group';
import 'vant/lib/cell-group/style';
import Cell from 'vant/lib/cell';
import 'vant/lib/cell/style';
import Icon  from 'vant/lib/icon';
import 'vant/lib/icon/style';
// import IndexBar from 'vant/lib/index-bar';
// import 'vant/lib/index-bar/style';
// import IndexAnchor from 'vant/lib/index-anchor';
// import 'vant/lib/index-anchor/style';
import Tabs from 'vant/lib/tabs';
import 'vant/lib/tabs/style';
import Tab from 'vant/lib/tab';
import 'vant/lib/tab/style';
import Swipe from 'vant/lib/swipe';
import 'vant/lib/swipe/style';
import Swipeitem from 'vant/lib/swipe-item';
import 'vant/lib/swipe-item/style';
import ActionSheet  from 'vant/lib/action-sheet';
import 'vant/lib/action-sheet/style';
import Dialog  from 'vant/lib/dialog';
import 'vant/lib/dialog/style';

export default function importVant(){
  Vue.component('van-form',Form )
  Vue.component('van-field',Field)
  Vue.component('van-cell-group',CellGroup)
  Vue.component('van-cell',Cell)
  Vue.component('van-icon',Icon )
  // Vue.component('van-index-bar',IndexBar )
  // Vue.component('van-index-anchor',IndexAnchor )
  Vue.component('van-tabs',Tabs )
  Vue.component('van-tab',Tab )
  Vue.component('van-swipe',Swipe )
  Vue.component('van-swipe-item',Swipeitem)
  Vue.component('van-action-sheet',ActionSheet)
  // Dialog应该不属于组件，不需要用Vue.component
}