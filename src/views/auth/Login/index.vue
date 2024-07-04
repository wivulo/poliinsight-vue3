<script>
import loginBanner from "@/assets/login/images/login-banner.png"
import { mapGetters } from 'vuex';
import Button from 'primevue/button';
import Image from 'primevue/image'
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import FloatLabel from 'primevue/floatlabel';
import Checkbox from 'primevue/checkbox';
import { setDocumentTitleMixin } from "@/config/document.title.js"

export default{
    name: 'Login',
    mixins: [setDocumentTitleMixin],
    components: {
        Button, Image, InputText, Password, FloatLabel, Checkbox,
    },
    data() {
        return {
          title: 'Login',
          user: {
            email: '',
            password: '',
          },
          remember: false,
          loginBanner: loginBanner
        };
    },
    methods: {
      redirectOnLogin(user){
        if(user.groupId === 1){
          this.$router.push({ name: 'admin.overview', params: {id: user.id} });
        }else if(user.groupId === 3){
          this.$router.push({ name: 'organizer.overview', params: {id: user.id} });
        }else{
          this.$router.push({ name: 'home.user', params: {id: user.id}});
        }
      },

      async login() {
          this.$store.dispatch('auth/login', this.user)
          .then(res => {
              if(res?.user){
                this.$toast.add({severity:'success', summary: 'Success', detail: 'Login successful', life: 2000});

                this.$store.dispatch("auth/fetchUser", res?.user.id)
                
                this.redirectOnLogin(res?.user)
              }else{
                this.$toast.add({severity:'error', summary: 'Error', detail: 'Login error', life: 2000});
              }
          })
          .catch(err => console.log(err));
      },

      goBack(){
          if(window.history.length > 0)
            this.$router.go(-1);
      }
    },
    computed: {
      isDisabled() {
            return !this.user.email || !this.user.password;
      },
      onLogin() {
          return this.$store.getters['auth/onLogin'];
      }
    }
}
</script>

<template>
<main>
  <div class="flex flex-col">
    <div class="mx-0 line-1">
        <Button severity="transparent" class="soft-hover" @click="goBack">
          <i class="fa fa-arrow-left" />
        </Button>
    </div>
    
    <div class="flex mx-0 line-2 basis-1/2 justify-center items-center self-center my-4 gap-2">
      
        <div class="flex border-r border-zinc-300/30 self-center px-4">
            <Image :src="loginBanner" alt="login banner" class="img-fluid object-cover" />
        </div>

      <!-- <b-col cols="3" class="flex flex-col gap-3 px-4" align-self="center"> -->
        <div class="flex flex-col gap-3 px-4">
            <p class="text-xl text-center text-red-500 font-bold relative" style="left: -5px">
                Poliinsights
            </p>

            <form @submit.prevent="login" class="flex gap-2 flex-col">

              <FloatLabel class="my-3">
                <InputText id="email" v-model="user.email" class="w-full border-zinc-300 h-9 hover:border-zinc-400 focus:outline-zinc-400" :required="true"/>
                <label for="email">
                  <i class="fas fa-envelope me-1 "></i> <small> Ex:. exemplo@poliinsight.ao </small>
                </label>
              </FloatLabel>


              <div class="my-3">
                <Password toggleMask id="password" v-model="user.password" class="w-full border-zinc-300 h-9 hover:border-zinc-400 focus:outline-zinc-400" :required="true"
                  placeholder="Ex.: Exemplo12$" :feedback="false" />
              </div>

            <div class="my-2">
                <Checkbox v-model="remember" :binary="true" class="h-5" />  Lembrar ?
                <!-- <p><a href="">Esqueceu a palavra passe?</a></p> -->
            </div>
            
            <div class="flex gap-2 justify-center ">
                <Button 
                    type="submit" size="small"
                    class="h-8 w-full flex justify-center items-center text-base" 
                    :disabled="isDisabled">
                    <i class="fas fa-spinner animate-spin mr-1" v-if="onLogin" />
                    <span>Login</span>
                </Button>
            </div>
            </form>

            <div class="flex justify-content-center">
                <p>
                    Não tens uma conta ? <router-link to="/signup" class=" text-blue-500">Criar conta</router-link>
                </p>
            </div>
        </div>
      <!-- </b-col> -->
    </div>
  </div>
</main>
</template>

<style scoped>
.line-1{
  height: 10vh;
}
.line-2{
  height: 90vh;
}
</style>
