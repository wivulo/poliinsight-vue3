<script setup>
import { ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotification } from '@/composables/useNotification';
import ParticipantServices from '@/services/ParticipantServices.js';
import RegistrationServices from '@/services/RegistrationServices.js';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import TemplateAcademicCompetitionTeamMember from './TemplateAcademicCompetitionTeamMember.vue';
import PaidEvent from './PaidEvent.vue';
import { SwalConfirmAlert } from '@/helpers/swalConfirmAlert';
import Checkbox from 'primevue/checkbox';

const props = defineProps(['event']);
const emit = defineEmits(['created:registration']);
const route = useRoute();
const router = useRouter();
const { notifyError, notifySuccess } = useNotification();

const registration = reactive({
    data: {},
    busy: false
});
// Adicionar validação de membros
const MAX_TEAM_MEMBERS = 3;
const MIN_TEAM_MEMBERS = 2;
const team = reactive({
    name: null,
    members: []
});

const termAndCondition = ref(false);

const TemplateAcademicCompetitionTeamMemberRef = ref([]);
const reset = () => {
    team.name = null;
    team.members = [];
    TemplateAcademicCompetitionTeamMemberRef.value.forEach(ref => ref.reset());
};

const validateTeam = () => {
    if (!team.name) throw new Error('Preencha todos os campos');

    if (team.members.length < MIN_TEAM_MEMBERS) {
        throw new Error(`Mínimo de ${MIN_TEAM_MEMBERS} membros por equipe`);
    }
    
    if (team.members.length > MAX_TEAM_MEMBERS) {
        throw new Error(`Máximo de ${MAX_TEAM_MEMBERS} membros por equipe`);
    }
  
    // Verificar emails e userIDs únicos
    const uniqueIds = new Set();
    team.members.forEach(member => {
        const id = member.userId || member.email;
        if (uniqueIds.has(id)) {
        throw new Error(`Membro duplicado: ${id}`);
        }
        uniqueIds.add(id);
    });
};

const handlerAddTeamMember = (member) => {
    if (!team.members.find(m => m.email === member.email)) {
        team.members = [...team.members, member];
    } else {
        team.members = team.members.map(m => {
            if (m.email === member.email) {
                return member;
            }
            return m;
        });
    }
};

const handleMakeRegistration = async () => {
    try {
        validateTeam(); // Nova validação

        const result = await SwalConfirmAlert()
        if (!result) return;

        // Adaptar estrutura para o backend
        const backendTeam = {
            name: team.name,
            members: team.members.map(member => {
                return member.userId 
                ? { userId: member.userId }
                : {
                    name: member.name,
                    email: member.email,
                    phone: member.phone,
                    birthdate: member.birthdate,
                    gender: member.gender
                };
            })
        };

        registration.busy = true;

        const response = await RegistrationServices.store({
            eventId: route.params.id,
            team: backendTeam // Nova estrutura
        });

        if (response.data?.error || response.status > 299) throw new Error('Erro ao fazer a inscrição');

        notifySuccess('Inscrição feita com sucesso');
        emit('created:registration');
        router.push({ name: 'event.registrations.public.detail', params: {id: response.data.eventId, registrationid: response.data.id } });
        reset();
    } catch (error) {
        console.log(error);
        const message = error.response?.data?.error || error.message;
        notifyError(message);
    } finally {
        registration.busy = false;
    }
};

const handleRegistrationUpdate = (value) => {
    registration.data = {
        ...registration.data,
        ...value
    };
};
</script>

<template>
    <!-- Atualizado: formulário com padding responsivo -->
    <form @submit.prevent="handleMakeRegistration" class="flex flex-col gap-4 md:px-4 lg:px-8">
        <div class="flex flex-col gap-3">
            <label for="name" class="ml-2">
                <i class="fas fa-users me-1 "></i> <small> Nome do Grupo </small>
            </label>
            <InputText id="name" v-model="team.name" class="w-full border-zinc-300 h-9" :required="true" placeholder="Ex.: We Solve Problems" />
        </div>

        <!-- Seção dos integrantes: em telas pequenas exibe em 1 coluna; em telas médias, 2 colunas -->
        <div class="flex flex-col gap-3 my-2">
            <p class="ml-2">
                <i class="fas fa-users me-1 "></i> <small> Integrantes: </small>
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div v-for="i in [0, 1, 2]" :key="i" class="border border-slate-300 rounded-md md:pl-2 px-2">
                    <TemplateAcademicCompetitionTeamMember
                        ref="TemplateAcademicCompetitionTeamMemberRef"
                        :index="i" 
                        @update:member="handlerAddTeamMember"
                        class="py-3"
                    />
                </div>
            </div>
        </div>

        <PaidEvent
            v-if="event?.type === 'paid'" 
            :event="event" 
            @update:registration="handleRegistrationUpdate" 
        />

        <!-- Adicionar indicador de tamanho da equipe -->
        <div class="flex justify-between items-center">
            <p class="ml-2">
            <i class="fas fa-users me-1"></i> 
            <small> Integrantes: {{ team.members.length }}/{{ MAX_TEAM_MEMBERS }}</small>
            </p>
            <small v-if="team.members.length < MIN_TEAM_MEMBERS" class="text-red-500">
            Mínimo {{ MIN_TEAM_MEMBERS }} membros
            </small>
        </div>

        <!-- ...existing code, mantendo container responsivo para PaidEvent e botão... -->
        <div class="flex w-full justify-between my-2 flex-col md:flex-row">
            <div class="flex items-center">
                <Checkbox v-model="termAndCondition" class="me-2" :binary="true" />
                <small class="text-surface-400">Aceito os <a href="#" class="text-primary-500">termos e condições</a> do evento</small>
            </div>

            <Button type="submit" size="small" class="h-9" :loading="registration.busy"
                :disabled="!termAndCondition || team.members.length < MIN_TEAM_MEMBERS"
            >
                <i class="fas fa-spinner animate-spin mr-2" v-if="registration.busy"/>
                <i class="fas fa-save me-2" v-else/> {{registration.busy ? 'Inscrevendo': 'Inscrever'}}
            </Button>
        </div>
    </form>
</template>

<style>

</style>