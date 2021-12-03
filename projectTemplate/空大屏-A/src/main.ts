import Vue from 'vue'
import App from './App.vue'
import less from 'less'
// import 'amfe-flexible'
import scroll from 'vue-seamless-scroll'
import 'overlayscrollbars/css/OverlayScrollbars.css';
import OverlayScrollbars from 'overlayscrollbars'
import importVant from '@/assets/minimalImport/vant'
import importEcharts from '@/assets/minimalImport/echarts'
import importElement from '@/assets/minimalImport/element'
importVant()
importEcharts()
importElement()

console.log('process.env.NODE_ENV',process.env.NODE_ENV)

declare global {
  interface Window { 
    basicComponent:Vue;
  }
}

document.addEventListener("DOMContentLoaded", function() {
  //The first argument are the elements to which the plugin shall be initialized
  //The second argument has to be at least a empty object or a object with your desired options
  OverlayScrollbars(document.querySelectorAll('body'), {});
});

Vue.use(scroll)

// Or you can set the globally registered component name yourself. The default registered component name is vue-tableau-slider
Vue.use(scroll,{componentName: 'scroll-seamless'})
// Vue.use(less)


Vue.prototype.$emptyTip=function(originVal:any){
  const tip='暂无'
  if(['',null,undefined].some(x=>x===originVal)){
    return tip
  }else{
    return originVal
  }
}

Vue.config.productionTip = false

window.basicComponent=new Vue({
  render: h => h(App),
}).$mount('#app')
