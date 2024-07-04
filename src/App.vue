<script>
import Toast from 'primevue/toast';
import { mapGetters } from 'vuex';

export default {
  name: "App",
  components: {
    Toast,
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
      token: "auth/token",
      userId: 'auth/userId'
    })
  },
  created() {
    if(this.userId){
      this.$store.dispatch("auth/fetchUser", this.userId)
      .then(res => {
        if(res?.error == 'Unauthenticated') this.$router.push({name: 'login'})
      })
    }
  },
}
</script>

<template>
  <div class="h-screen overflow-y-auto">
    <Toast />
    <RouterView />
  </div>
</template>