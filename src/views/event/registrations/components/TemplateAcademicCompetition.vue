<script>
import ParticipantServices from '@/services/ParticipantServices.js'
import RegistrationServices from '@/services/RegistrationServices.js'
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import TemplateAcademicCompetitionTeamMember from './TemplateAcademicCompetitionTeamMember.vue';
import PaidEvent from './PaidEvent.vue';

export default {
    name: 'Registration.template.academicCompetition',
    props: ['event'],
    components: {
        InputText, InputNumber, Button, PaidEvent,
        Dropdown, Calendar, TemplateAcademicCompetitionTeamMember
    },
    data(){
        return {
            registration: {
                data: {},
                busy: false
            },
            team: {
                name: null,
                members: []
            },
        }
    },
    methods: {
        reset(){
            this.team = {
                name: null,
                members: []
            }

            this.$refs.TemplateAcademicCompetitionTeamMember.forEach(ref => ref.reset())
        },

        handlerAddTeamMember(member){
            //add a member if it doesn't exist
            if(!this.team.members.find(m => m.email === member.email)){
                this.team.members = [...this.team.members, member]
            }else{
                //update the member
                this.team.members = this.team.members.map(m => {
                    if(m.email === member.email){
                        return member
                    }
                    return m
                })
            }
        },

        async handleMakeRegistration(){
            try {

                if(!this.team.name || this.team.members.length === 0) throw new Error('Preencha todos os campos')

                const result = await this.$swal.fire({
                    text: 'Tem a certeza?',
                    icon: 'warning',
                    showCancelButton: true,
                    cancelButtonText: 'Não',
                    confirmButtonText: 'Sim, tenho',
                    confirmButtonColor: '#EF4444',
                    cancelButtonColor: '#CBD5E1',
                })

                if(!result.isConfirmed) return

                this.registration.data = {
                    team: this.team
                }

                this.registration.busy = true

                const response = await RegistrationServices.store({
                    eventId: this.$route.params.id,
                    ...this.registration.data,
                })

                if(response.data?.error || response.status > 299) throw new Error('Erro ao fazer a inscrição')


                this.$swal.fire('', 'Inscrição feita com sucesso', 'success')
                this.$emit('created:registration')
                this.reset()
            } catch (error) {
                console.error(error)
                this.$toast.add({severity: 'error', summary: 'Erro', detail: error, life: 3000})
            } finally {
                this.registration.busy = false
            }
        },

        handleRegistrationUpdate(value){
            this.registration.data = {
                ...this.registration.data,
                ...value
            }
        },
    },
}
</script>

<template>
    <form @submit.prevent="handleMakeRegistration" class="flex gap-2 flex-col px-3">
        <div>
            <label for="name" class="ml-2">
                <i class="fas fa-users me-1 "></i> <small> Nome do Grupo </small> <span class="text-primary-500">*</span>
            </label>
            <InputText id="name" v-model="team.name" class="w-full border-zinc-300 h-9" :required="true" placeholder="Ex.: We Solve Problems" />
        </div>

        <div class="flex flex-col my-2">
            <p class="ml-2">
                <i class="fas fa-users me-1 "></i> <small> Integrantes: </small>
            </p>

            <div class="flex flex-wrap gap-5 pl-8">
                <div v-for="i in [0, 1, 2]" :key="i" class="border border-slate-300 rounded-md pl-2">
                    <TemplateAcademicCompetitionTeamMember
                        ref="TemplateAcademicCompetitionTeamMember"
                        :index="i" 
                        @update:member="handlerAddTeamMember"
                    />
                </div>
            </div>
        </div>

        <PaidEvent
            v-if="event?.type === 'paid'" 
            :event="event" 
            @update:registration="handleRegistrationUpdate" 
        />

        <div class="flex w-full justify-end my-2">
            <Button type="submit" size="small" class="h-9" :loading="registration.busy">
                <i class="fas fa-spinner animate-spin mr-2" v-if="registration.busy"/>
                <i class="fas fa-save me-2" v-else/> {{registration.busy ? 'Inscrevendo': 'Inscrever'}}
            </Button>
        </div>
    </form>
</template>

<style>
.form-group {
    @apply w-[47%]
}
</style>