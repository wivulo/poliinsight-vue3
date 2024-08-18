import axios from "axios";
import Cookies from "js-cookie";
import Swal from 'sweetalert2'
import { store } from '@/store'

// Add a request interceptor
axios.interceptors.request.use(function (config) {

    let token = Cookies.get('token');

    if(token)
      config.headers = {...config.headers, 'Authorization': token }

    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
axios.interceptors.response.use(async function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if(error.response.data.error && error.response.data.error === 'Invalid token'){
      await Swal.fire({
        title: 'SESSÃO EXPIRADA!',
        text: 'A tua sessão expirou, por favor faça o login novamente.',
        icon: 'error',
      })

      Cookies.remove('token');
      store.dispatch('auth/logout');
      window.location.href = '/login';
    }

    if(error.response.status === 401 && error.response.data.error === 'Access denied'){
      await Swal.fire({
        title: 'ACESSO NEGADO!',
        text: 'Não tens permissão para aceder a este recurso.',
        icon: 'error',
      })

      Cookies.remove('token');
      store.dispatch('auth/logout');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  });