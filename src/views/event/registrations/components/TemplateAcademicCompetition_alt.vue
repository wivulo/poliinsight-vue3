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

const props = defineProps(['event']);
const emit = defineEmits(['created:registration']);
const route = useRoute();
const router = useRouter();
const { notifyError, notifySuccess } = useNotification();

const registration = reactive({
    data: {},
    busy: false
});

const team = reactive({
    name: null,
    members: []
});

const TemplateAcademicCompetitionTeamMemberRef = ref([]);
const reset = () => {
    team.name = null;
    team.members = [];
    TemplateAcademicCompetitionTeamMemberRef.value.forEach(ref => ref.reset());
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
        if (!team.name || team.members.length < 2) throw new Error('Preencha todos os campos');

        const result = await SwalConfirmAlert()
        if (!result) return;

        registration.data = {
            team: team
        };

        registration.busy = true;

        const response = await RegistrationServices.store({
            eventId: route.params.id,
            ...registration.data,
        });

        if (response.data?.error || response.status > 299) throw new Error('Erro ao fazer a inscrição');

        notifySuccess('Inscrição feita com sucesso');
        emit('created:registration');
        router.push({ name: 'event.registrations.public.detail', params: {id: response.data.eventId, registrationid: response.data.id } });
        reset();
    } catch (error) {
        console.log(error);
        notifyError(error);
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
    <form @submit.prevent="handleMakeRegistration" class="flex gap-4 flex-col px-3">
        <div class="flex flex-col gap-3">
            <label for="name" class="ml-2">
                <i class="fas fa-users me-1 "></i> <small> Nome do Grupo </small>
            </label>
            <InputText id="name" v-model="team.name" class="w-full border-zinc-300 h-9" :required="true" placeholder="Ex.: We Solve Problems" />
        </div>

        <div class="flex flex-col gap-3 my-2">
            <p class="ml-2">
                <i class="fas fa-users me-1 "></i> <small> Integrantes: </small>
            </p>

            <div class="flex flex-wrap gap-5">
                <div v-for="i in [0, 1, 2]" :key="i" class="border border-slate-300 rounded-md pl-2">
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