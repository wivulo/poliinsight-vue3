import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'

//interceptors
import "@/plugin/axios"

//PrimeVue
import PrimeVue from 'primevue/config';
import Lara from '@/presets/lara';
import ToastService from 'primevue/toastservice';

//local css
import './assets/main.css'
import '@/assets/fonts/fontawesome-free-6.5.1-web/css/all.css'

//SweetAlert2
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const options = {
    confirmButtonColor: '#059669',
    cancelButtonColor: '#ff7674',
};


const app = createApp(App)

app.use(router)
app.use(store)
app.use(PrimeVue, {
    unstyled: true,
    pt: Lara,
});
app.use(ToastService);


// app.use(BootstrapVue)
// app.use(IconsPlugin)
app.use(VueSweetalert2, options);

app.mount('#app')
