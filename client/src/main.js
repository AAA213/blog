import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import { router } from '@/route'
import axios from 'axios'
import { createDiscreteApi, darkTheme, lightTheme } from 'naive-ui'
const { message, notification, dialog } = createDiscreteApi([
  'message',
  'dialog',
  'notification'
])

const app = createApp(App)
// 全局注入
app.provide('message', message)
app.provide('dialog', dialog)
app.provide('notification', notification)

app.use(createPinia())
app.use(router)

app.mount('#app')
