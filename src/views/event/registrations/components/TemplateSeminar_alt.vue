<script setup>
import { ref, reactive, toRefs, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { useNotification } from '@/composables/useNotification';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import PaidEvent from './PaidEvent.vue';
import ParticipantServices from '@/services/ParticipantServices.js';
import RegistrationServices from '@/services/RegistrationServices.js';
import Button from 'primevue/button';
import useVuelidate from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import InlineMessage from 'primevue/inlinemessage';
import { SwalConfirmAlert } from '@/helpers/swalConfirmAlert';
import Checkbox from 'primevue/checkbox';
import ModalUseLoggedUserData from './ModalUseLoggedUserData.vue';

const props = defineProps(['fields', 'event']);
const emit = defineEmits(['created:registration']);
const route = useRoute();
const router = useRouter();
const store = useStore();
const { notifyError, notifySuccess, notifyWarn } = useNotification();

const data = ref({
    name: null,
    email: null,
    phone: null,
    birthdate: null,
    gender: null,
    userId: null
});

const termAndCondition = ref(false);

const registration = reactive({
    data: {},
    busy: false
});

const genders = [
    'Masculino',
    'Feminino'
];

const rules = {
    name: { required },
    email: { required, email },
    birthdate: { required },
};

const v$ = useVuelidate(rules, data);

function reset() {
    Object.keys(data).forEach(key => {
        data[key] = null;
    });
    v$.value.$reset();
}

async function handleMakeRegistration() {
    v$.value.$touch();
    if (v$.value.$invalid) {
        notifyError('Preencha todos os campos obrigatórios corretamente');
        return;
    }

    try {
        const result = await SwalConfirmAlert()
        if (!result) return;

        registration.data = { ...registration.data, ...toRefs(data.value) }

        registration.busy = true;

        let participant = {
            eventId: route.params.id,
            team: null,
            ticketId: registration.data?.ticket ? registration.data?.ticket?.ticketId : null,
            data: {
                ...registration.data?.data,
                paymentMode: registration.data?.ticket ? registration.data?.ticket.payment_mode : null
            }
        }

        if(data.value.userId) {
            participant = {
                ...participant,
                userId: data.value.userId
            }
        } else {
            participant = {
                ...participant,
                participant: {
                    name: data.value.name,
                    email: data.value.email,
                    phone: data.value.phone,
                    birthdate: data.value.birthdate,
                    gender: registration.data?.gender
                }
            }
        }

        const response = await RegistrationServices.store(participant);

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
}

function handleRegistrationUpdate(value) {
    registration.data = {
        ...registration.data,
        ticket: value
    };
}

const ModalUseLoggedUserDataRef = ref(null);
function ShowModalUseLoggedUserData() {
    const user = store.getters['auth/user'];
    if (user && user?.id) {
        ModalUseLoggedUserDataRef.value?.show();
        return
    }
}

function checkAuth({ isConfirmed }) {
    try {
        if (isConfirmed) {
            const user = store.getters['auth/user'];
            if (user) {
                data.value = {
                    ...data,
                    userId: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    birthdate: user.birthdate,
                    gender: user.gender
                }

                return
            }

            notifyWarn('Aviso', 'Você precisa estar logado para fazer a inscrição');
        }
    } catch (error) {
        console.log(error);
        notifyError(error);
    }
}

onMounted(() => {
    ShowModalUseLoggedUserData();
});
</script>

<template>
    <form @submit.prevent="handleMakeRegistration" class="flex gap-3 flex-col px-3">
        <ModalUseLoggedUserData ref="ModalUseLoggedUserDataRef" @useuserdata="checkAuth" />

        <div class="flex flex-wrap gap-3">
            <div class="form-group w-full">
                <label for="name" class="ml-2">
                    <i class="fas fa-user me-1 "></i> <small> Nome </small> 
                </label>
                <InputText id="name" v-model="data.name" class="w-full h-9" :invalid="v$.name.$error" placeholder="Ex.: João da Silva" />
                
                <InlineMessage v-if="v$.name.$error" severity="error" class="text-sm">
                    Nome é obrigatório
                </InlineMessage>
            </div>

            <div class="form-group">
                <label for="email" class="ml-2">
                    <i class="fas fa-envelope me-1 "></i> <small> Email </small> 
                </label>
                <InputText id="email" v-model="data.email" class="w-full h-9" :invalid="v$.email.$error" placeholder="Ex.: joaosilva@gmail.com" />
                
                <InlineMessage v-if="v$.email.$error" severity="error" class="text-sm">
                    Email é obrigatório
                </InlineMessage>
            </div>

            <div class="form-group">
                <label for="phone" class="ml-2">
                    <i class="fas fa-phone me-1 "></i> <small> Telefone </small> 
                </label>
                <InputText id="phone" v-model="data.phone" class="w-full h-9" placeholder="Ex.: (244) 999xxxxxx" />
            </div>

            <div class="form-group">
                <label for="birthdate" class="ml-2">
                    <i class="fas fa-calendar me-1 "></i> <small> Data de Nascimento </small>
                </label>
                <Calendar 
                    id="birthdate" v-model="data.birthdate" dateFormat="dd/mm/yy" 
                    class="w-full border-zinc-300 hover:border-zinc-400 h-9" 
                    placeholder="Ex.: 01/01/2000"
                    :invalid="v$.birthdate.$error"
                />

                <InlineMessage v-if="v$.birthdate.$error" severity="error" class="text-sm">
                    Data de Nascimento é obrigatório
                </InlineMessage>
            </div>

            <div class="form-group">
                <label for="gender" class="ml-2">
                    <i class="fas fa-venus-mars me-1 "></i> <small> Gênero <span class="text-surface-400">(opcional)</span> </small>
                </label>

                <Dropdown id="gender" v-model="data.gender" :options="genders" class="w-full border-zinc-300 h-9" placeholder="Ex.: Masculino" />
            </div>
        </div>

        <PaidEvent
            v-if="event?.type === 'paid'" 
            :event="event" 
            @update:registration="handleRegistrationUpdate" 
        />

        <div class="flex w-full justify-between my-2">
            <div>
                <Checkbox v-model="termAndCondition" class="me-2" :binary="true" />
                <small class="text-surface-400">Aceito os <a href="#" class="text-primary-500">termos e condições</a> do evento</small>
            </div>
            <Button type="submit" size="small" class="h-9" :loading="registration.busy" :disabled="registration.busy || !termAndCondition">
                <i class="fas fa-spinner animate-spin mr-2" v-if="registration.busy"/>
                <i class="fas fa-save me-2" v-else/> {{registration.busy ? 'Inscrevendo': 'Inscrever'}}
            </Button>
        </div>
    </form>
</template>

<style>
.form-group {
    @apply my-1 w-[47%]
}
</style>