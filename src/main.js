import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import Paginator from 'primevue/paginator'

// PrimeVue
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'
import ConfirmationService from 'primevue/confirmationservice'
import ConfirmDialog from 'primevue/confirmdialog'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Dropdown from 'primevue/dropdown'

// VeeValidate
import { Field, Form, ErrorMessage, configure } from 'vee-validate'

// Estilos
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

// App
const app = createApp(App)

// PrimeVue
app.use(PrimeVue)
app.use(ToastService)
app.use(ConfirmationService)

// PrimeVue componentes globales
app.component('Toast', Toast)
app.component('ConfirmDialog', ConfirmDialog)
app.component('Dialog', Dialog)
app.component('Button', Button)
app.component('InputText', InputText)
app.component('Password', Password)
app.component('Dropdown', Dropdown)
app.component('Paginator', Paginator)


// VeeValidate componentes globales
app.component('Field', Field)
app.component('Form', Form)
app.component('ErrorMessage', ErrorMessage)

// Configuración de mensajes de VeeValidate (opcional)
configure({
  generateMessage: (ctx) => {
    const messages = {
      required: `El campo ${ctx.field} es obligatorio.`,
      email: 'El correo no es válido.',
      min: `El campo ${ctx.field} es muy corto.`,
    }
    return messages[ctx.rule.name] || `El campo ${ctx.field} no es válido.`
  }
})

// Router & Pinia
app.use(router)
app.use(createPinia())

// Montaje
app.mount('#app')
