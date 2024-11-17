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
import SingleInformation from './components/SingleInformation.vue';
import GroupInformation from './components/GroupInformation.vue';
import CompanyInformation from './components/CompanyInformation.vue';
import templateSeminar from './components/TemplateSeminar.vue';
import templateAcademicCompetition from './components/TemplateAcademicCompetition.vue';
import PaidEvent from './components/PaidEvent.vue';

export default {
    name: "event.registrations.show",
    mixins: [setDocumentTitleMixin],
    components: {
        Image, FloatLabel, InputText, Checkbox, Button, Dropdown,
        Calendar, RadioButton, SingleInformation, GroupInformation, CompanyInformation,
        PaidEvent, templateSeminar, templateAcademicCompetition
    },
    data() {
        return {
            title: 'Poliinsight | Inscrever participante',
            busy: false,
            event: null,
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

        // handleRegistrationUpdate(value){
        //     this.registration.data = {
        //         ...this.registration.data,
        //         ...value
        //     }
        // },
    }
}
</script>

<template>
    <div class="w-full flex flex-col relative">
        <div class="w-full h-2/3 overflow-hidden flex justify-between items-center">
            <i class="fas fa-spinner animate-spin mr-1" v-if="busy" />
            <Image :src="event?.imageURL" :alt="event?.name" class="object-cover w-full" image-class="w-full" />
        </div>

        <div class="w-full h-1/3" />

        <div id="registration-box" class="bg-slate-50/95 rounded-md shadow-md w-[600px]"
            :class="{ 'w-[800px]': eventConfig?.data.template === 'templateAcademicCompetition'}"
        >
            <div v-if="eventConfig.busy" class="w-full h-full flex justify-center items-center">
                <i class="fas fa-spinner animate-spin" />
            </div>

            <div class="flex flex-col gap-5" v-else>
                <div class="text-slate-700">
                    <RouterLink :to="{name: 'event.show', params: {id: event?.id}}" class="text-xl font-bold hover:text-primary-500">
                        {{event?.name}}
                    </RouterLink>
                    <p class="text-sm font-semibold">Boletim de inscrição</p>
                </div>

                <component 
                    :is="eventConfig?.data.template" 
                    :fields="eventConfig?.data.fields"
                    :event="event"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
#registration-box{
    @apply absolute h-[520px] overflow-y-auto rounded-md px-6 py-6;
}
#registration-box {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>