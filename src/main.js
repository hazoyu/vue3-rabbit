// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
// 引入初始化样式文件

import '@/styles/common.scss'

//引入懒加载指令插件并且注册
import {lazyPlugin} from '@/directives'
//引入全局组件
import {componentPlugin} from '@/components'

const pinia=createPinia()


const app = createApp(App)

//注册持久化插件
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

app.use(componentPlugin)
app.use(lazyPlugin)
app.use(router)
app.mount('#app')

