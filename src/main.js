import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'
import ConfirmationService from 'primevue/confirmationservice'
import ConfirmDialog from 'primevue/confirmdialog'

// Estilos correctos (ahora sí existen)
// import '@primeuix/themes/primeuixtheme.css'
// import '@primeuix/themes/dist/lara.css'
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
// import './assets/main.css'

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(PrimeVue)
app.use(ToastService)
app.component('Toast', Toast)
app.use(ConfirmationService)
app.component('ConfirmDialog', ConfirmDialog)
app.mount('#app')
