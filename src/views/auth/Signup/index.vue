<script>
import AuthServices from "@/services/AuthServices"
import Step_1_PersonalData from "./components/Step_1_PersonalData.vue"
import Step_2_academicData from './components/Step_2_academicData.vue'
import Step_3_finish from './components/Step_3_finish.vue'
import { setDocumentTitleMixin } from "@/config/document.title.js"
import Button from 'primevue/button';
import Image from 'primevue/image'
import Steps from 'primevue/steps';
import Card from 'primevue/card';
import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';

export default {
    name: 'SignUp',
    mixins: [setDocumentTitleMixin],
    components: {
        Step_1_PersonalData,
        Step_2_academicData,
        Step_3_finish,
        Button, Image, Steps, Card, Stepper, StepperPanel
    },
    data() {
        return {
            title: 'Criar conta',
            step: 0,
            user: {
                name: '',
                email: '',
                password: '',
                gender: "",
                username: "",
                course: "",
                institution: "Instituto Superior Politécnico de Benguela",
                birthdate: "",
                department_id: null,
            },
            confirmPassword: null,
            busy: false,
            items: [
                { label: 'Dados Pessoais', icon: 'pi pi-user' },
                { label: 'Dados Acadêmicos', icon: 'pi pi-book' },
                { label: 'Finalizar', icon: 'pi pi-check' }
            ],
            media: window.innerWidth
        }
    },
    methods: {
        async signup() {
                try {
                    this.busy = true
                    const response = await AuthServices.signup(this.user)

                    if(response?.status == 201) {
                        this.toastMessage()
                        setTimeout(() => this.$router.push({name: "login"}), 1000)
                        return
                    }

                    throw new Error()
                } catch (error) {
                    this.toastMessage('error', 'Erro ao criar conta!', 'Erro')
                } finally {
                    this.busy = false
                }
        },

        async handleSubmit(){
            if(this.user.password !== this.confirmPassword) {
                this.toastMessage('error', 'A confirmação de senha não corresponde!', 'Erro')
                return
            }

            const result = await this.$swal.fire({
                title: 'Tem certeza?',
                text: "Deseja criar a conta com os dados fornecidos?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sim, criar conta!',
                cancelButtonText: 'Cancelar'
            })

            if(result.isConfirmed) {
                this.signup()
            }
        },

        toastMessage(type = 'success', message = 'Conta criada com sucesso!', summary = 'Successo') {
            this.$toast.add({severity: type, summary: summary, detail: message, life: 3000});
        },

        goBack(){
            if(window.history.length > 0)
                this.$router.go(-1);
        },

        handleCPasseChange(passe) {
            this.confirmPassword = passe
        }
    }
}
</script>

<template>
    <main>
        <div class="flex flex-col px-0">
            <div class="mx-0 vh-10">
                <Button severity="transparent" class="soft-hover" @click="goBack">
                  <i class="fa fa-arrow-left" />
                </Button>
            </div>

            <div class="flex mx-0 vh-90 w-full md:w-auto basis-full md:basis-1/2 justify-center items-center self-center my-4 gap-2">

                <Card class="w-full">
                    <template #title>
                        <p class="text-lg md:text-2xl">Criar conta</p>
                    </template>
                    <template #content>
                        <Stepper 
                          v-model:activeStep="step" 
                          :orientation="media >= 768 ? 'horizontal' : 'vertical'">
                            <StepperPanel :header="items[0].label">
                                <template #content="{ nextCallback }">
                                    <Step_1_PersonalData :user="user" />

                                    <div class="flex pt-2 justify-end">
                                        <Button size="small" class="h-8 text-base"  @click="nextCallback">
                                            <span>Próximo</span>
                                        </Button>
                                    </div>
                                </template>
                            </StepperPanel>

                            <StepperPanel :header="items[1].label">
                                <template #content="{ prevCallback, nextCallback }">
                                    <Step_2_academicData :user="user" />

                                    <div class="flex pt-4 justify-end gap-2">
                                        <Button size="small" class="h-8 text-base" 
                                            severity="secondary" @click="prevCallback">
                                            <span>Anterior</span>
                                        </Button>

                                        <Button size="small" class="h-8 text-base" 
                                            @click="nextCallback">
                                            <span>Próximo</span>
                                        </Button>
                                    </div>
                                </template>
                            </StepperPanel>

                            <StepperPanel :header="items[2].label">
                                <template #content="{ prevCallback }">
                                    <Step_3_finish :user="user" @changeCpassword="handleCPasseChange" />

                                    <div class="flex pt-4 justify-end gap-2">
                                        <Button size="small" class="h-8 text-base" severity="secondary" @click="prevCallback">
                                            <span>Anterior</span>
                                        </Button>

                                        <Button :loading="busy" size="small" class="h-8 text-base" @click="handleSubmit">
                                            <i class="fas fa-spinner animate-spin mr-1" v-if="busy" />
                                            <span>Criar conta</span>
                                        </Button>
                                    </div>
                                </template>
                            </StepperPanel>
                        </Stepper>
                    </template>
                </Card>       

            </div>
        </div>
    </main>
</template>