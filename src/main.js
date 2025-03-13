// import './assets/main.css'
import {createApp} from 'vue'

import App from './App.vue'
// 引入路由
import router from './router'
// 引入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 暗夜模式
import 'element-plus/theme-chalk/dark/css-vars.css'
// 引入部分自定义样式
import './assets/style/index.scss'



// 引入pinia
import store from './stores'
// 引入注册的element图标
import ElementIcons from './assets/icons/el-icons.js'
// 引入鉴权命令
import Permission from "@/directives/permission.js";
// 引入loading命令
import Loading from '@/directives/loading'

// 引入 vite-plugin-svg-icons
import 'virtual:svg-icons-register'
// 引入全局组件
import WlIcon from "@/components/icons/wlIcon.vue";
import WlSelect from "@/components/select/wlSelect.vue";
import WlCheckbox from "@/components/checkbox/wlCheckbox.vue";
import WlRadio from "@/components/radio/wlRadio.vue";
import WlDict from "@/components/dict/wlDict.vue"


const app = createApp(App)


app.use(store)
app.use(router)
app.use(ElementPlus, {locale: zhCn,})
app.use(ElementIcons)
// 注册loading命令 区别原本的 v-loading
app.directive('wl-loading', Loading)
// 注册权限命令
app.directive('permission', Permission)
// 注册全局组件
app.component('wl-icon', WlIcon);
app.component('wl-select', WlSelect);
app.component('wl-checkbox', WlCheckbox);
app.component('wl-radio', WlRadio);
app.component('wl-dict', WlDict);

app.mount('#app')
