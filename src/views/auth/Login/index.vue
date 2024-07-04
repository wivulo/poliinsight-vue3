<script>
import loginBanner from "@/assets/login/images/login-banner.png"
import { mapGetters } from 'vuex';
import Button from 'primevue/button';
import Image from 'primevue/image'
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import FloatLabel from 'primevue/floatlabel';
import Checkbox from 'primevue/checkbox';
import Card from 'primevue/card';
import { setDocumentTitleMixin } from "@/config/document.title.js"

export default{
    name: 'Login',
    mixins: [setDocumentTitleMixin],
    components: {
        Button, Image, InputText, Password, FloatLabel, Checkbox, Card,
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
<main class="h-screen">
  <div class="flex flex-col relative justify-center items-center h-screen">
    <div class="absolute left-0 top-0">
        <Button severity="transparent" class="soft-hover" @click="goBack">
          <i class="fa fa-arrow-left" />
        </Button>
    </div>
    
    <div class="flex w-[800px] h-[400px] justify-center items-center relative">
      <Card class="h-full flex justify-center items-center">
        <template #content>
          <div class="absolute top-0 left-0 w-[400px] h-[400px] z-40 bg-red-300"></div>

          <div class="flex gap-2 w-full justify-center items-center z-50 relative">
            <div class="flex flex-col basis-1/2 px-4 text-white/80">
                <!-- <Image :src="loginBanner" alt="login banner" class="img-fluid object-cover" /> -->
                <p class="text-xl font-semibold mb-2 tracking-wider">Poliinsight</p>
                <p class="text-justify text-sm">
                  O Poliinsight é um software de gestão de eventos integrada 
                  desenvolvido para atender às demandas específicas do Instituto Superior Politécnico
                  de Benguela. Com ele, é possível gerenciar de forma eficiente diversos processos 
                  ligados a gestão de eventos e os dados relacionado aos eventos.
                </p>
            </div>

            <div class="flex flex-col gap-3 px-4 basis-1/2">
              <p class="text-xl text-center text-red-500 font-bold relative uppercase tracking-widest" style="left: -5px">
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
          </div>
        </template>
      </Card>
    </div>
  </div>
</main>
</template>
