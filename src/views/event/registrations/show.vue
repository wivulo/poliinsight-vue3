<script>
import EventServices from '@/services/EventServices';
import EventConfigServices from '@/services/EventConfigServices.js';
import ParticipantServices from '@/services/ParticipantServices.js'
import RegistrationServices from '@/services/RegistrationServices.js'
import { setDocumentTitleMixin } from "@/config/document.title.js"
import Image from 'primevue/image';
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import RadioButton from 'primevue/radiobutton';
import { event } from '@/store/modules/event';
import SingleInformation from './components/SingleInformation.vue';
import GroupInformation from './components/GroupInformation.vue';
import CompanyInformation from './components/CompanyInformation.vue';

export default {
    name: "event.registrations.show",
    mixins: [setDocumentTitleMixin],
    components: {
        Image, FloatLabel, InputText, Checkbox, Button, Dropdown,
        Calendar, RadioButton, SingleInformation, GroupInformation, CompanyInformation
    },
    data() {
        return {
            title: 'Poliinsight | Inscrever participante',
            busy: false,
            event: null,
            registration: {
                data: {},
                busy: false
            },
            payment_modes: [
                {label: 'Transferência Bancária', value: 'bank_transfer'},
                {label: 'Depósito Bancário', value: 'bank_deposit'},
                {label: 'Dinheiro em mão', value: 'cash'},
            ],
            eventConfig: {
                data: {},
                busy: false
            }
        };
    },
    async created(){
        await this.getEvent()
        this.getEventConfig(this.event?.category.name)
    },
    methods: {
        async getEvent(){
            this.busy = true
            this.eventConfig.busy = true
            const responde = await EventServices.show(this.$route.params.id)
            .catch(() => this.$toast.add({severity: 'error', summary: 'Erro', detail: 'Erro ao buscar evento'}))
            this.event = responde.data
            this.busy = false
        },

        async getEventConfig(eventType){
            const responde = await EventConfigServices.showByEventType(eventType)
            .catch(() => this.$toast.add({severity: 'error', summary: 'Erro', detail: 'Erro ao buscar configuração do evento'}))
            this.eventConfig.data = responde.data
            this.eventConfig.busy = false
        },

        async handleMakeRegistration(){
            try {
                this.registration.data = {
                    ...this.$refs.SingleInformation.data
                }

                this.registration.busy = true
                this.$toast.add({severity: 'info', summary: 'Salvando...', detail: 'A salvar as informaçºoes do participante', life: 2000})
                let response = await ParticipantServices.store(this.registration.data)

                if(response.data?.error || response.status > 299) throw new Error('Error')

                const participante = response.data

                this.$toast.add({severity: 'info', summary: 'Inscrevendo...', detail: 'A inscrever o participante', life: 2000})
                response = await RegistrationServices.store({
                    eventId: this.event?.id,
                    userId: null,
                    participantId: participante?.id,
                    ticketId: null
                })

                if(response.data?.error || response.status > 299) throw new Error('Error')


                this.$toast.add({severity: 'success', summary: 'Sucesso', detail: 'Participante inscrito com sucesso', life: 3000})
            } catch (error) {
                this.$toast.add({severity: 'error', summary: 'Erro', detail: 'Erro ao fazer a inscrição', life: 3000})
            } finally {
                this.registration.busy = false
            }
        },

        handleReset(){

        }
    }
}
</script>

<template>
    <div class="w-full flex flex-col relative">
        <div class="w-full h-1/2 overflow-hidden flex justify-between items-center">
            <i class="fas fa-spinner animate-spin mr-1" v-if="busy" />
            <Image :src="event?.imageURL" :alt="event?.name" class="object-cover" />
        </div>

        <div class="w-full h-1/2" />

        <div id="registration-box" class="bg-slate-50/95">
            <div v-if="eventConfig.busy" class="w-full h-full flex justify-center items-center">
                <i class="fas fa-spinner animate-spin" />
            </div>

            <div class="flex flex-col gap-5" v-else>
                <div class="text-slate-700">
                    <p class="text-xl font-bold">{{event?.name}}</p>
                    <p class="text-sm font-semibold">Boletim de inscrição</p>
                </div>

                <form @submit.prevent="handleMakeRegistration" class="flex gap-2 flex-col px-3">
                    <SingleInformation 
                        v-if="eventConfig?.data.registrationType == 'single'" 
                        :fields="eventConfig?.data.fields"
                        ref="SingleInformation"
                    />
                    <GroupInformation v-else :fields="eventConfig?.data.fields" />

                    <div class="flex flex-col gap-3 mt-4 mb-2 text-sm" v-if="event?.type === 'paid'">
                        <p class="ml-2">Taxa de inscrição</p>
                        <div class="flex flex-col gap-2">
                            <div class="flex align-items-center">
                                <RadioButton v-model="data.registration_mode" inputId="mode1" name="mode1" value="single" />
                                <label for="mode1" class="ml-2">Individual - 5000 Kz</label>
                            </div>
                            <div class="flex align " >
                                <RadioButton v-model="data.registration_mode" inputId="mode2" name="mode2" value="group" />
                                <label for="mode2" class="ml-2">Grupo - 10000 Kz</label>
                            </div>
                        </div>

                        <p class="mt-2 ml-2">Método de pagamento</p>
                        <div class="flex flex-col gap-2">
                            <Dropdown id="payment" v-model="data.payment_mode" :options="payment_modes" optionLabel="label" placeholder="Selecione um método de pagamento" class="h-9 w-full"  />
                        </div>
                    </div>

                    <div class="flex w-full justify-end my-2">
                        <Button type="submit" size="small" class="h-9" :loading="registration.busy">
                            <i class="fas fa-spinner animate-spin mr-2" v-if="registration.busy"/>
                            <i class="fas fa-save me-2" v-else/> {{registration.busy ? 'Inscrevendo': 'Inscrever'}}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
#registration-box{
    @apply absolute w-[600px] h-[520px] overflow-y-auto rounded-md px-6 py-6;
}
#registration-box {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>