import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import socketPlugin from './plugins/socket'
import './style.css'
import App from './App.vue'
import router from './routes'

const app = createApp(App)
app.use(createPinia())
app.use(router)
// app.use(socketPlugin);

app.mount('#app')
