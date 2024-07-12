<script>
import PasswordServices from "@/services/PasswordServices.js"
import { setDocumentTitleMixin } from "@/config/document.title.js"
import Password from 'primevue/password';
import Button from "primevue/button";

export default {
    name: 'ResetPasswordEmail',
    mixins: [setDocumentTitleMixin],
    components: {
        Password, Button
    },
    data() {
        return {
            title: 'Redefinir senha',
            busy: false,
            senha: null,
            cSenha: null,
        };
    },
    methods: {
        handleResetPassword(){
            if(!this.senha || !this.cSenha) return

            if(this.senha !== this.cSenha){
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: 'As senhas não coincidem' });
                return
            }

            this.busy = true
            PasswordServices.resetPasswordEmail({ senha: this.senha, token: this.$route.query.token})
            .then(() => {
                this.$toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Senha redefinida com sucesso' });
                this.$router.push({ name: 'login' })
            })
            .catch(() => {
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: 'Ocorreu um erro ao redefinir a senha' });
            })
            .finally(() => {
                this.busy = false
            })
        }
    },
};
</script>

<template>
     <main id="content" role="main" class="w-full  max-w-md mx-auto p-6">
        <div class="mt-7 bg-white  rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2">
            <div class="p-4 sm:p-7">

                <div class="text-center mb-2">
                    <h1 class="block text-2xl font-bold text-gray-800 dark:text-white">
                        Redefinir senha
                    </h1>
                </div>
            
                <form @submit.prevent="handleResetPassword">
                    <div class="flex flex-col gap-y-1 mb-3">
                        <label for="email" class="block text-sm font-bold ml-1 mb-1 dark:text-white">
                            Nova senha <span class="text-red-600">*</span>
                        </label>

                        <div class="relative">
                            <input
                                    v-model="senha"
                                    type="password" id="password" name="password" 
                                    class="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm shadow-sm" required>
                        </div>
                    </div>

                    <div class="flex flex-col gap-y-1 mb-3">
                        <label for="email" class="block text-sm font-bold ml-1 mb-1 dark:text-white">
                            Confirmar senha <span class="text-red-600">*</span>
                        </label>

                        <div class="relative">
                            <input
                                    v-model="cSenha"
                                    type="password" id="password" name="password" 
                                    class="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm shadow-sm" required>
                        </div>
                    </div>

                    <Button 
                        type="submit" size="small"
                        class="py-3 w-full flex justify-center items-center text-base"
                    >
                        <i class="fas fa-spinner animate-spin mr-1" v-if="busy" />
                        <span>Redefinir senha</span>
                    </Button>
                </form>
            </div>
        </div>
    </main>
</template>