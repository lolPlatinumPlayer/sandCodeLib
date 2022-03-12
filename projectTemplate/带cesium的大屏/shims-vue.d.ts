declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

import VueRouter from 'vue-router';
import { Route } from 'vue-router';
declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter;
    $router: Route;
  }
}

declare module 'vue-seamless-scroll'

declare module '@/auth' 
declare module '@/bus' 
declare module '@/utils/flexible' 
declare module '@/assets/minimalImport/vant'
declare module '@/assets/minimalImport/echarts'
declare module '@/assets/minimalImport/element'

