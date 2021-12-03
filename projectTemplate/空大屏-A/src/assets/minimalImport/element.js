import Vue from 'vue'
import { Carousel,CarouselItem,Option,Cascader,Loading ,Form,FormItem,Input, Button,Image,} from 'element-ui';

export default function importElement(){
  Vue.use(Carousel)
  Vue.use(CarouselItem)
  Vue.use(Option)
  Vue.use(Cascader)
  Vue.use(Loading)
  Vue.use(Form)
  Vue.use(FormItem)
  Vue.use(Input)
  Vue.use(Button)
  Vue.use(Image)
}