<script>
import { setDocumentTitleMixin } from "@/config/document.title.js"
import PasswordServices from "@/services/PasswordServices.js"

export default {
    name: "ForgotPassword",
    mixins: [setDocumentTitleMixin],
    data() {
        return {
          title: 'Login',
          busy: false,
          email: null
        }
    },
    methods: {
        async handleResetPassword(){
            if(!email) return
            
            this.busy = true
            const response = await PasswordServices.forgotPassword(email)
            console.log(response)
            this.busy = false
        }
    }
}
</script>

<template>
    <main id="content" role="main" class="w-full  max-w-md mx-auto p-6">
        <div class="mt-7 bg-white  rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2">
            <div class="p-4 sm:p-7">
                <div class="text-center">
                    <h1 class="block text-2xl font-bold text-gray-800 dark:text-white">Esqueceu a senha?</h1>
                    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Lembras a senha?
                        <router-link to="/login" class="text-blue-600 decoration-2 hover:underline font-medium">
                            faça Login aqui
                        </router-link>
                    </p>
                </div>

                <div class="mt-5">
                    <form @submit.prevent="handleResetPassword">
                        <div class="grid gap-y-4">
                            <div>
                                <label for="email" class="block text-sm font-bold ml-1 mb-2 dark:text-white">
                                    Endereço de E-mail <span class="text-red-600">*</span>
                                </label>

                                <div class="relative">
                                    <input
                                        v-model="email"
                                        type="email" id="email" name="email" 
                                        class="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm shadow-sm" required aria-describedby="email-error">
                                </div>

                                <p class="hidden text-xs text-red-600 mt-2" id="email-error">E-mail inválido</p>
                            </div>

                            <button 
                                type="submit" 
                                class="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                            >
                                <i class="fas fa-spinner animate-spin mr-1" v-if="busy" />
                                Redefinir senha
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </main>
</template>