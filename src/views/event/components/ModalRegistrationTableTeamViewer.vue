<script>
import EventServices from '@/services/EventServices';
import EventConfigServices from '@/services/EventConfigServices.js';
import ParticipantServices from '@/services/ParticipantServices.js'
import RegistrationServices from '@/services/RegistrationServices.js'
import EventTeamParticipantService from '@/services/EventTeamParticipantService';
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
    name: "ModalRegistrationTableTeamViewer",
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
            team: {
                data: null,
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
        async show(teamId){
            this.visible = true;
            this.fetchTeam(teamId);
        },

        async fetchTeam(id){
            try {
                this.team.busy = true;
                const response = await EventTeamParticipantService.show(id);
                this.team.data = response.data;
            } catch (error) {
                this.handleErrorMessage(error);
            } finally {
                this.team.busy = false;
            }
        },

        handleErrorMessage(message){
            this.$toast.add({severity:'error', summary: 'Erro', detail: message, life: 3000});
        },

        handlehidden(){
            this.visible = false;
        },
    }
}
</script>

<template>
    <Dialog v-model:visible="visible" modal :header="team.data?.name" :style="{ width: '35rem' }">

        <div v-if="team.busy" class="w-full h-full flex justify-center items-center">
            <i class="fas fa-spinner animate-spin" />
        </div>

        <div class="flex flex-col gap-5" v-else>
           <div class="flex flex-col gap-3 my-3 px-3">
                <div v-for="participant in team.data?.participants" :key="participant.id" class="border border-secondary px-2 py-3">
                    <p class="flex justify-between">
                        <span>{{ participant.name }}</span> - 
                        <span>{{ participant.email }}</span> - 
                        <span>{{ participant.phone }}</span>
                    </p>
                </div>
           </div>
        </div>
    </Dialog>
</template>