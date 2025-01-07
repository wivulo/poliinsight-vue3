<script>
import { defineComponent, computed } from 'vue';
import Toast from 'primevue/toast';
import { useRouter } from 'vue-router';
import { mapGetters } from 'vuex';
import { useVuelidate } from '@vuelidate/core'
import ConfirmDialog from 'primevue/confirmdialog';

export default defineComponent({
  name: "App",
  components: {
    Toast, ConfirmDialog
  },
  setup() {
    const router = useRouter();
    const defaultLayout = 'default-layout';

    const layout = computed(() => {
      return router.currentRoute.value.meta.layout || defaultLayout;
    });

    return {
      layout,
      v$: useVuelidate(),
    };
  },
  computed: {
        ...mapGetters({
            user: 'auth/user',
            token: 'auth/token',
        }),
  },
  // mounted() {
  //   this.$primevue.config.ripple = true;
  // },
  watch: {
    $route(to, from) {
      if (!this.token && !this.user) {
        this.$router.push({ name: 'login' });
      }
    },
  },
});
</script>

<template>
  <div class="h-screen overflow-y-auto">
    <Toast />
    <!-- <RouterView /> -->
    <ConfirmDialog></ConfirmDialog>
    <transition name="page" mode="out-in">
      <component :is="layout" v-if="layout" :key="layout" />
    </transition>
  </div>
</template>