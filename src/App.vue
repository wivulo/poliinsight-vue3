<script>
import { defineComponent, computed } from 'vue';
import Toast from 'primevue/toast';
import { useRouter } from 'vue-router';
import { mapGetters } from 'vuex';

export default defineComponent({
  name: "App",
  components: {
    Toast,
  },
  setup() {
    const router = useRouter();
    const defaultLayout = 'default-layout';

    const layout = computed(() => {
      return router.currentRoute.value.meta.layout || defaultLayout;
    });

    return {
      layout,
    };
  },
  computed: {
        ...mapGetters({
            user: 'auth/user',
            token: 'auth/token',
        }),
  },
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
    <transition name="page" mode="out-in">
      <component :is="layout" v-if="layout" :key="layout" />
    </transition>
  </div>
</template>