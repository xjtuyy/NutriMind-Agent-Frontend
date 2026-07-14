import { createApp } from 'vue'
import '@fontsource/barlow/400.css'
import '@fontsource/barlow/500.css'
import '@fontsource/barlow/600.css'
import '@fontsource/barlow-condensed/500.css'
import '@fontsource/barlow-condensed/600.css'
import '@fontsource/barlow-condensed/700.css'
import '@/assets/styles/global.scss'
import App from './App.vue'
import router from './router'
import pinia from './stores'

createApp(App).use(pinia).use(router).mount('#app')
