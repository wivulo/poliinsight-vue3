<script>
import EventServices from '@/services/EventServices';
import EventConfigServices from '@/services/EventConfigServices.js';
import ParticipantServices from '@/services/ParticipantServices.js'
import RegistrationServices from '@/services/RegistrationServices.js'
import { mapGetters } from 'vuex';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Checkbox from 'primevue/checkbox';
import Calendar from 'primevue/calendar';
import RadioButton from 'primevue/radiobutton';
import SingleInformation from '@/views/event/registrations/components/SingleInformation.vue';
import GroupInformation from '@/views/event/registrations/components/GroupInformation.vue';
import CompanyInformation from '@/views/event/registrations/components/CompanyInformation.vue';


export default {
    name: "ModalNewRegistration",
    components: {
        Dialog, ProgressSpinner, Button,
        InputText, InputNumber, Dropdown, Checkbox,
        Calendar, RadioButton, SingleInformation,
        GroupInformation, CompanyInformation
    },
    data(){
        return {
            visible: false,
            busy: false,
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
        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/user',
        }),
    },
    methods : {
        async show(){
            this.visible = true;
            await this.getEvent();
            this.getEventConfig(this.event?.category.name)
        },

        async getEvent(){
            this.busy = true
            this.eventConfig.busy = true
            const responde = await EventServices.show(this.$route.params.id)
            .catch(() => this.$toast.add({severity: 'error', summary: 'Erro', detail: 'Erro ao buscar evento', life: 3000}))
            this.event = responde.data
            this.busy = false
        },

        async getEventConfig(eventType){
            const responde = await EventConfigServices.showByEventType(eventType)
            .catch(() => this.$toast.add({severity: 'error', summary: 'Erro', detail: 'Erro ao buscar configuração do evento', life: 3000}))
            this.eventConfig.data = responde.data
            this.eventConfig.busy = false
        },

        async handleStore(){
            try {
                this.registration.data = this.$refs.SingleInformation.data

                this.registration.busy = true
                let response = await ParticipantServices.store(this.registration.data)

                if(response.data?.error || response.status > 299) throw new Error('Error')

                const participante = response.data

                response = await RegistrationServices.store({
                    eventId: this.event?.id,
                    userId: null,
                    participantId: participante?.id,
                    ticketId: null
                })

                if(response.data?.error || response.status > 299) throw new Error('Error')


                this.$swal.fire('Sucesso', 'Inscrição feita com sucesso', 'success')
                this.$emit('created')
                this.handleReset()
                this.handlehidden()
            } catch (error) {
                this.handleErrorMessage()
            } finally {
                this.registration.busy = false
            }
        },

        handleReset(){
            this.$refs.SingleInformation.reset()
        },

        handleErrorMessage(){
            this.$toast.add({severity:'error', summary: 'Error', detail: 'Erro ao fazer a inscrição', life: 3000});
        },

        handlehidden(){
            this.visible = false;
        },

        handleCancel(){
            this.handlehidden()
            this.handleReset()
        },
    }
}
</script>

<template>
    <Dialog v-model:visible="visible" modal header="Boletim de inscrição" :style="{ width: '35rem' }">

        <div v-if="eventConfig.busy" class="w-full h-full flex justify-center items-center">
            <i class="fas fa-spinner animate-spin" />
        </div>

        <div class="flex flex-col gap-5" v-else>
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
            </form>
        </div>

        <template #footer>
            <div class="flex gap-3 justify-end">
                <Button severity="secondary" text @click="handleCancel" size="small" class="h-9">
                    <i class="fa fa-times mr-1"/> Cancelar
                </Button>
                <Button @click="handleStore" size="small" class="h-9" :loading="registration.busy">
                    <i class="fas fa-spinner animate-spin mr-1" v-if="registration.busy" />
                    <i class="fa fa-save mr-1"/> {{ registration.busy ? 'Inscrevendo...' : 'Inscrever' }}
                </Button>
            </div>
        </template>
    </Dialog>
</template>