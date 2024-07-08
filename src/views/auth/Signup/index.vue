<script>
import loginBanner from "@/assets/login/images/login-banner.png"
import Step_1_PersonalData from "./components/Step_1_PersonalData.vue"
import Step_2_academicData from './components/Step_2_academicData.vue'
import Step_3_finish from './components/Step_3_finish.vue'
import { databaseURL } from "@/config"
import { setDocumentTitleMixin } from "@/config/document.title.js"
import Button from 'primevue/button';
import Image from 'primevue/image'
import Steps from 'primevue/steps';
import Card from 'primevue/card';
import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';
import { emailValidator, minLength } from "@/helpers/validations"
import axios from "axios"

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
                nickname: '',
                email: '',
                password: '',
                confirmPassword: '',
                gender: "",
                username: "",
                course: "",
                institution: "Instituto Superior Politécnico de Benguela",
                birthDate: "",
                isISPBStudent: false,
                isEventOrganizer: false,
                office: "N/D",
                department: "",
                groupId: 2,
                documentProving: "N/D"
            },
            busy: false,
            loginBanner: loginBanner,
            items: [
                { label: 'Dados Pessoais', icon: 'pi pi-user' },
                { label: 'Dados Acadêmicos', icon: 'pi pi-book' },
                { label: 'Finalizar', icon: 'pi pi-check' }
            ],
        }
    },
    methods: {
        async signup() {
            try {
                this.busy = true

                if(!emailValidator(this.user.email)){
                    throw new Error('E-mail inválido!')
                }

                if(this.user.password != this.user.confirmPassword) {
                    throw new Error('A confirmação da password não conscide!')
                }

                const { data } = await axios.post(`${databaseURL}/signup`, this.user)

                if(data.error) {
                    throw new Error(data.error)
                }

                this.$toast.add({severity:'success', summary: 'Success', detail: 'Conta criada com sucesso!', life: 2000});

                this.busy = false

                setTimeout(() => this.$router.push({name: "login"}), 1000)
            } catch (error) {
                this.$swal.fire('', error.message , 'error')
                this.busy = false
            }
        },
        goBack(){
            if(window.history.length > 0)
                this.$router.go(-1);
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

            <div class="flex mx-0 vh-90 basis-1/2 justify-center items-center self-center my-4 gap-2">

                <Card>
                    <template #title>Criar conta</template>
                    <template #content>
                        <Stepper v-model:activeStep="step">
                            <StepperPanel :header="items[0].label">
                                <template #content="{ nextCallback }">
                                    <Step_1_PersonalData :user="user" />

                                    <div class="flex pt-4 justify-end">
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
                                    <Step_3_finish :user="user" />

                                    <div class="flex pt-4 justify-end gap-2">
                                        <Button size="small" class="h-8 text-base" severity="secondary" @click="prevCallback">
                                            <span>Anterior</span>
                                        </Button>

                                        <Button :loading="busy" size="small" class="h-8 text-base" @click="signup">
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