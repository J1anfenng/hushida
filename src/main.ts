import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import { Icon } from '@iconify/vue';

// 全局注册 Icon 组件

const app = createApp(App)
app.use(router)
app.mount('#app')
app.component('Icon', Icon);