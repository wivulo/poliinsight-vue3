<script setup >
import { computed, watch } from 'vue';
import Toast from 'primevue/toast';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core'
import { useStore } from 'vuex';

const router = useRouter();
const v$ = useVuelidate();
const store = useStore();

const defaultLayout = 'default-layout';
const layout = computed(() => {
  return router.currentRoute.value.meta.layout || defaultLayout;
});

const user = computed(() => store.getters['auth/user']);
const busy = computed(() => store.getters['auth/busy']);
const token = computed(() => store.getters['auth/token']);


watch(() => router.currentRoute.value, (to, from) => {
  //array de rotas que não precisam de autenticação
  const publicRoutes = ['login', 'signup', 'forgot.password', 'reset.password', 'home'];
  
  if (!publicRoutes.includes(to.name)) {
    const unwatch = watch(busy, (newBusy) => {
      if (!newBusy) {
        if (!token.value || !user.value) {
          router.push({ name: 'login' });
        }
        unwatch();
      }
    });
  }
});

defineExpose({
  v$,
  router,
  user,
  token,
  layout,
});
</script>

<template>
  <div class="h-screen overflow-y-auto">
    <Toast />
    <!-- <RouterView /> -->
    <transition name="page" mode="out-in">
      <component :is="layout" v-if="layout" :key="layout" />
    </transition>
  </div>
</template>