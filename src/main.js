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
import Ripple from 'primevue/ripple';

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

const options = {
    confirmButtonColor: '#059669',
    cancelButtonColor: '#ff7674',
};


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


// app.use(BootstrapVue)
// app.use(IconsPlugin)
app.use(VueSweetalert2, options);

app.component("default-layout", DefaultLayout)
app.component("error-layout", ErrorLayout)
app.component("empty-layout", EmptyLayout)
app.component("navbar-layout", NavbarLayout)

app.mount('#app')
