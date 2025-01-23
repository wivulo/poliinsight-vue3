import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'

//interceptors
import "@/plugin/axios"

//PrimeVue
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';
import Lara from '@/presets/lara';
import ToastService from 'primevue/toastservice';
import Ripple from 'primevue/ripple';
import 'primeicons/primeicons.css'
import ConfirmationService from 'primevue/confirmationservice';

//local css
import './assets/main.css'
import '@/assets/fonts/fontawesome-free-6.5.1-web/css/all.css'

//SweetAlert2
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

//Layouts
import DefaultLayout from '@/layouts/default.vue'
import ErrorLayout from './layouts/error.vue'
import EmptyLayout from './layouts/empty.vue'
import NavbarLayout from './layouts/navbar-layout.vue'

//vuelidate
import Vuelidate from '@vuelidate/core'

//HTML to Paper
import VueHtmlToPaper from 'vue-html-to-paper'
const vueHtmlToPaperOptions = {
  name: '_blank',
  specs: [
    'scrollbars=yes'
  ],
  styles: [
    '/css/report.css'
  ],
  timeout: 1000, // default timeout before the print window appears
  autoClose: false // if false, the window will not close after printing
}

//Vue Multiselect
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'

//dayjs
import dayjs from 'dayjs';
import 'dayjs/locale/pt'; // Importa o português
dayjs.locale('pt');

export const app = createApp(App)

app.use(router)
app.use(store)
app.use(PrimeVue, {
    unstyled: true,
    pt: Lara,
    ripple: true
});
app.use(ToastService);
app.directive('ripple', Ripple);
app.directive('tooltip', Tooltip);

app.use(ConfirmationService);

// app.use(BootstrapVue)
// app.use(IconsPlugin)

const options = {
  reverseButtons: true,
  showCancelButton: true,
  confirmButtonColor: '#EF4444',
  cancelButtonColor: '#CBD5E1',
};
app.use(VueSweetalert2, options);

app.component("default-layout", DefaultLayout)
app.component("error-layout", ErrorLayout)
app.component("empty-layout", EmptyLayout)
app.component("navbar-layout", NavbarLayout)

//vuelidate
app.use(Vuelidate)

//HTML to Paper
app.use(VueHtmlToPaper, vueHtmlToPaperOptions)

//Vue Multiselect
app.component('Multiselect', Multiselect)

//dayjs
app.config.globalProperties.$dayjs = dayjs;
app.directive('formatDate', {
  mounted(el, binding) {
    el.innerHTML = dayjs(binding.value).format('dddd, D [de] MMMM');
  }
})

app.directive('formatDateDDMMMYYY', {
  mounted(el, binding) {
    el.innerHTML = dayjs(binding.value).format('DD [de] MMMM YYYY');
  }
})

app.directive('formatTime', {
  mounted(el, binding) {
    el.innerHTML = dayjs(binding.value).format('HH:mm');
  }
})

app.mount('#app')
