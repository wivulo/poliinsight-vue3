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
import FloatLabel from 'primevue/floatlabel';
import templateSeminar from '@/views/event/registrations/components/TemplateSeminar.vue';
import templateAcademicCompetition from '@/views/event/registrations/components/TemplateAcademicCompetition.vue';
import PaidEvent from '@/views/event/registrations/components/PaidEvent.vue';


export default {
    name: "ModalNewRegistration",
    components: {
        Dialog, ProgressSpinner, Button,
        InputText, InputNumber, Dropdown, Checkbox,
        Calendar, RadioButton, SingleInformation,
        GroupInformation, CompanyInformation, FloatLabel, templateSeminar,
        templateAcademicCompetition, PaidEvent, 
    },
    data(){
        return {
            visible: false,
            busy: false,
            eventConfig: {
                data: {},
                busy: false
            },
            modalWidth: '35rem',
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
            try {
                const responde = await EventConfigServices.showByEventType(eventType)
                this.eventConfig.data = responde.data
            } catch (error) {
                this.$toast.add({severity: 'error', summary: 'Erro', detail: 'Erro ao buscar configuração do evento', life: 3000})
            } finally {
                this.eventConfig.busy = false

                if(this.eventConfig?.data.template === 'templateAcademicCompetition'){
                    this.modalWidth = '50rem'
                }
            }
        },

        handleErrorMessage(){
            this.$toast.add({severity:'error', summary: 'Error', detail: 'Erro ao fazer a inscrição', life: 3000});
        },

        handlehidden(){
            this.visible = false;
        },

        handleCancel(){
            this.handlehidden()
        },

        handleRegistrationCompleted(){
            this.$emit('created:registration')
        }
    }
}
</script>

<template>
    <Dialog v-model:visible="visible" modal header="Boletim de inscrição" :style="{ width: modalWidth }">

        <div v-if="eventConfig.busy" class="w-full h-full flex justify-center items-center">
            <i class="fas fa-spinner animate-spin" />
        </div>

        <div class="flex flex-col gap-5" v-else>
            <component 
                :is="eventConfig?.data.template" 
                :fields="eventConfig?.data.fields"
                :event="event"
                @created:registration="handleRegistrationCompleted"
            />
        </div>

        <!-- <template #footer>
            <div class="flex gap-3 justify-end">
                <Button severity="secondary" text @click="handleCancel" size="small" class="h-8">
                    <i class="fa fa-times mr-1"/> Cancelar
                </Button>
                <Button @click="handleStore" size="small" class="h-8" :loading="registration.busy">
                    <i class="fas fa-spinner animate-spin mr-1" v-if="registration.busy" />
                    <i class="fa fa-save mr-1"/> {{ registration.busy ? 'Inscrevendo...' : 'Inscrever' }}
                </Button>
            </div>
        </template> -->
    </Dialog>
</template>