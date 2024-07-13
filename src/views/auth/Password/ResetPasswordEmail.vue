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
            tokenIsValid: true,
        };
    },
    created() {
        this.checkToken()
    },
    methods: {
        async checkToken(){
            const response = await PasswordServices.checkToken({ token: this.$route.params.token })
            .catch(e => {
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: 'Ocorreu um erro ao verificar o token', life: 2000})
                this.tokenIsValid = false
            })

            this.tokenIsValid = response.data.error ? false : true
        },

        async handleResetPassword(){
            if(!this.senha || !this.cSenha) return

            if(this.senha !== this.cSenha){
                this.$toast.add({ severity: 'error', summary: 'Erro', detail: 'As senhas não coincidem' });
                return
            }

            this.busy = true
            const response = await PasswordServices.resetPasswordEmail({email: this.$route.query.email, senha: this.senha, token: this.$route.params.token})
            .catch(e => this.$toast.add({ severity: 'error', summary: 'Erro', detail: 'Ocorreu um erro ao redefinir a senha' }))
            .finally(() => this.busy = false )

            if(response.status === 200) {
                this.$toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Senha redefinida com sucesso' });
                this.$router.push({ name: 'login' })
                return
            }

            this.$toast.add({ severity: 'error', summary: 'Erro', detail: 'Ocorreu um erro ao redefinir a senha' });
        }
    },
};
</script>

<template>
     <main id="content" role="main" class="w-full  max-w-lg mx-auto p-6">
        <template v-if="!tokenIsValid">
            <div class="w-full h-full flex flex-col justify-center items-center">
                <p class="text-base">
                    Token inválido! Por favor, solicite um novo link de redefinição de senha.
                </p>
                <router-link :to="{name: 'forgot.password'}" class="text-red-500 ml-1">Clique aqui</router-link>
            </div>
        </template>
        
        <div v-else class="mt-7 bg-white  rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2">
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
                            <Password
                                v-model="senha"
                                feedback
                                toggleMask
                                class="text-sm w-full"
                                required
                            />
                        </div>
                    </div>

                    <div class="flex flex-col gap-y-1 mb-3">
                        <label for="email" class="block text-sm font-bold ml-1 mb-1 dark:text-white">
                            Confirmar senha <span class="text-red-600">*</span>
                        </label>

                        <div class="relative">
                            <Password
                                v-model="cSenha"
                                feedback
                                toggleMask
                                class="text-sm w-full"
                                required
                            />
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