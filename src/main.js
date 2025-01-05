import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Icon from 'mdi-vue'; // 导入图标组件
import 'mdi/css/materialdesignicons.css';
// 注册 Icon 为全局组件
Vue.component('Icon', Icon);
createApp(App).mount('#app')
