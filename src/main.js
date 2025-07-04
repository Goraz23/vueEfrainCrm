import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'

// Estilos correctos (ahora sí existen)
import 'primevue/resources/themes/lara-light-green/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import './assets/main.css'

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(PrimeVue)
app.mount('#app')
