<script>
import AuthServices from "@/services/AuthServices"

import Button from 'primevue/button';
import Image from 'primevue/image'
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import FloatLabel from 'primevue/floatlabel';
import Checkbox from 'primevue/checkbox';
import Card from 'primevue/card';
import { setDocumentTitleMixin } from "@/config/document.title.js"
import AppLogo from "@/components/AppLogo.vue";

export default{
    name: 'Login',
    mixins: [setDocumentTitleMixin],
    components: {
      AppLogo,
      Button, Image, InputText, Password, FloatLabel, Checkbox, Card,
    },
    data() {
        return {
          title: 'Login',
          busy: false,
          user: {
            email: '',
            password: '',
          },
          remember: false,
        };
    },
    methods: {
      redirectOnLogin(user){
        if(user.groupId === 3){
          this.$router.push({ name: 'home', params: {id: user.id}});
        }else{
          this.$router.push({ name: 'dashboard.overview', params: {id: user.id} });
        }
      },

      async login() {
        this.busy = true
        const response = await AuthServices.login(this.user)
        .catch(() => this.$toast.add({severity:'error', summary: 'Error', detail: 'Erro ao entrar no sistema', life: 2000}))
        .finally(() => this.busy = false)

        if(response.status === 200 && response.data.error){
          this.$toast.add({severity:'error', summary: 'Error', detail: "E-mail ou senha estão incorretos!", life: 3000})
          return
        }
        
        if(response.status === 200){
          this.$toast.add({severity:'success', summary: 'Success', detail: 'A entrar....', life: 2000});
          this.$store.dispatch("auth/fetchUser", response.data.user.id)
          this.$store.dispatch("auth/saveToken", { token: response.data.token, remember: false })
          this.$store.dispatch("auth/fetchNavAndRoles", response.data.user.id)
          this.redirectOnLogin(response.data.user)
          return
        }

        this.$toast.add({severity:'error', summary: 'Error', detail: 'Erro ao entrar no sistema', life: 2000})
      },

      goBack(){
          if(window.history.length > 0)
            this.$router.go(-1);
      },
    },
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
          <div class="absolute top-0 left-0 w-[400px] h-[400px] z-40 bg-red-500"></div>

          <div class="flex gap-2 w-full justify-center items-center z-50 relative">
            <div class="flex flex-col basis-1/2 px-4 text-slate-50">
                <p class="text-xl font-semibold mb-2 tracking-wider">Poliinsight</p>
                <p class="text-justify text-sm">
                  O Poliinsight é um software de gestão de eventos integrada, com ele, é possível gerenciar de forma 
                  eficiente diversos processos ligados a gestão de eventos e os dados relacionado aos eventos.
                </p>
            </div>

            <div class="flex flex-col gap-3 px-4 basis-1/2">
              <div class="w-full h-auto flex justify-center items-center">
                <AppLogo :textIsVisible="false" :width="60" :height="60" />
              </div>

              <p class="text-sm text-center text-red-500 font-bold relative tracking-wide -top-4">
                  Poliinsights
              </p>

              <form @submit.prevent="login" class="flex gap-2 flex-col px-3">

                <FloatLabel class="my-2">
                  <InputText id="email" v-model="user.email" class="w-full border-zinc-300 h-9" :required="true"/>
                  <label for="email">
                    <i class="fas fa-envelope me-1 "></i> <small> Ex:. exemplo@poliinsight.ao </small>
                  </label>
                </FloatLabel>

                <div class="flex justify-end">
                  <p class="text-xs">
                    <router-link :to="{name: 'forgot.password'}">
                      Esqueci minha senha.
                    </router-link>
                  </p>
                </div>


                <div class="my-2 float-label relative">
                  <Password toggleMask id="password" v-model="user.password" class="w-full border-zinc-300 h-9" :required="true"
                    :feedback="false" />

                    <label for="password" class="text-zinc-500" >
                      <i class="fa fa-lock mr-1" /> <small>Ex.: Exemplo12$</small>
                    </label>
                </div>

                <div class="my-2">
                    <Checkbox v-model="remember" :binary="true" class="h-5" />  Lembrar ?
                </div>
              
                <div class="flex gap-2 justify-center ">
                    <Button
                        :loading="busy"
                        type="submit" size="small"
                        class="h-8 w-full flex justify-center items-center text-base">
                        <i class="fas fa-spinner animate-spin mr-1" v-if="busy" />
                        <span>Login</span>
                    </Button>
                </div>
              </form>

              <div class="flex justify-content-center px-3">
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
