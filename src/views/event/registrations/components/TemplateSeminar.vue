<script setup>
import { ref, reactive } from 'vue';
import { useRoute } from 'vue-router';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import { useNotification } from '@/composables/useNotification';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import PaidEvent from './PaidEvent.vue';
import ParticipantServices from '@/services/ParticipantServices.js';
import RegistrationServices from '@/services/RegistrationServices.js';
import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import InlineMessage from 'primevue/inlinemessage';
import { ConfirmSwal } from '@/helpers/fireSwal';

const props = defineProps({
    fields: Array,
    event: Object
});
const emit = defineEmits(['created:registration', 'update:registration']);

const route = useRoute();
const { notifyError, notifySuccess } = useNotification();

const formData = reactive({
    name: null,
    email: null,
    phone: null,
    birthdate: null,
    gender: null
});

const registration = reactive({
    data: {},
    busy: false
});

const savedRegistration = ref(null);

const genders = ['Masculino', 'Feminino'];

const rules = {
    name: { required },
    email: { required },
    phone: { required }
};
const v$ = useVuelidate(rules, formData);

const activeStep = ref(0);
function goToStep(index) {
    console.log('goToStep: ', index);
    activeStep.value = index;
    console.log('activeStep: ', activeStep.value);
}

function handleErrorMessage(message = 'Erro ao fazer a inscrição') {
    notifyError(message);
}

function reset () {
    formData.name = null;
    formData.email = null;
    formData.phone = null;
    formData.birthdate = null;
    formData.gender = null;
    registration.data = {};
    savedRegistration.value = null;
    activeStep.value = 0;
}

// Salva informações pessoais e avança para o passo 2
async function handleSavePersonalInfo() {

    if (savedRegistration.value) {
        goToStep(1);
        return;
    }

    await v$.value.$validate();
    if (v$.value.$invalid) {
        handleErrorMessage('Preencha todos os campos obrigatórios');
        return;
    }

    registration.busy = true;
    try {
        const result = await ConfirmSwal();
        if (!result.isConfirmed) return;

        const response = await RegistrationServices.store({
            eventId: route.params.id,
            participant: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                birthdate: formData.birthdate,
                gender: formData.gender
            },
            team: null,
            ticketId: null,
            data: {}
        });

        if (response.status === 201) {
            savedRegistration.value = response.data;
            notifySuccess('Informações pessoais salvas com sucesso');
            registration.data = { ...registration.data, ...formData };
            goToStep(1);
            return true
        }

        throw new Error();
    } catch (error) {
        console.error(error);
        handleErrorMessage(error.message || error);
        return false;
    } finally {
        registration.busy = false;
    }
}

function validatePayment() {
    if (!registration.data?.ticket) {
        handleErrorMessage('Adicione as informações de pagamento');
        return false;
    }

    if (!registration.data.ticket?.ticketId) {
        handleErrorMessage('Selecione um ticket');
        return false;
    }

    if (!registration.data.ticket?.method) {
        handleErrorMessage('Selecione um método de pagamento');
        return false;
    }

    if (
        ['bank_transfer', 'bank_deposit'].includes(registration.data.ticket?.method) 
        && 
        !registration.data.ticket?.bankAccountId
    ) {
        handleErrorMessage('Selecione uma conta bancária');
        return false;
    }

    if (
        ['bank_transfer', 'bank_deposit', 'tpa'].includes(registration.data.ticket?.method) 
        && 
        !registration.data.ticket?.transationReference
    ) {
        handleErrorMessage('Adicione a referência da transação');
        return false;
    }

    return true;
}

// Salva o método de pagamento usando storeTicket
async function handleSavePayment() {
    if (!validatePayment()) return;

    try {
        const result = await ConfirmSwal();
        if (!result.isConfirmed) return;

        registration.busy = true;
        const response = await RegistrationServices.payment({
            registrationId: savedRegistration.value?.id,
            ...registration.data.ticket
        });

        if (!response.data?.error && response.status === 201) {
            notifySuccess('Incrição concluida com sucesso');
            emit('created:registration');
            reset();
            return
        }

        throw new Error(response.data?.error || 'Erro ao salvar pagamento');
    } catch (error) {
        console.error(error);
        handleErrorMessage(error.message || error);
    } finally {
        registration.busy = false;
    }
}

function handleRegistrationUpdate(value) {
    registration.data = { ...registration.data, ticket: value };
    emit('update:registration', value);
}
</script>

<template>
    <Stepper v-model:activeIndex="activeStep" :readonly="true">
        <StepperPanel>
            <template #header="{ index }">
                <button class="bg-transparent border-none inline-flex items-center justify-center w-10 h-10 rounded-full">
                    <span :class="['border w-10 h-10 flex justify-center items-center rounded-full', { 'bg-primary': index <= activeStep, 'border-surface-400': index > activeStep }]">
                        <i class="pi pi-user text-white" />
                    </span>
                </button>
            </template>

            <template #content="{ nextCallback }">

            <div class="flex flex-wrap gap-3">
                <!-- Campo Nome -->
                <div class="form-group w-full">
                    <label for="name" class="ml-2">
                        <i class="fas fa-user me-1"></i> <small> Nome </small> <span class="text-primary-500">*</span>
                    </label>

                    <InputText id="name" 
                        v-model="formData.name" class="w-full h-9" 
                        :required="true"
                        placeholder="Ex.: João da Silva"
                        :invalid="v$.name.$error"
                    />
                    <InlineMessage v-if="v$.name.$error" severity="error">
                        Campo obrigatório
                    </InlineMessage>
                </div>

                <!-- Campo Email -->
                <div class="form-group">
                    <label for="email" class="ml-2">
                        <i class="fas fa-envelope me-1"></i> <small> Email </small> <span
                            class="text-primary-500">*</span>
                    </label>
                    <InputText id="email" v-model="formData.email" class="w-full h-9" :required="true"
                        placeholder="Ex.: joaosilva@gmail.com" :invalid="v$.email.$error" />
                    <InlineMessage v-if="v$.email.$error" severity="error">
                        Campo obrigatório
                    </InlineMessage>
                </div>

                <!-- Campo Telefone -->
                <div class="form-group">
                    <label for="phone" class="ml-2">
                        <i class="fas fa-phone me-1"></i> <small> Telefone </small> <span
                            class="text-primary-500">*</span>
                    </label>
                    <InputText id="phone" v-model="formData.phone" class="w-full h-9" :required="true"
                        placeholder="Ex.: (244) 999xxxxxx" :invalid="v$.phone.$error" />
                    <InlineMessage v-if="v$.phone.$error" severity="error">
                        Campo obrigatório
                    </InlineMessage>
                </div>

                <!-- Campo Data de Nascimento e Gênero permanecem sem validação -->
                <div class="form-group">
                    <label for="birthdate" class="ml-2">
                        <i class="fas fa-calendar me-1"></i> <small> Data de Nascimento </small>
                    </label>
                    <Calendar id="birthdate" v-model="formData.birthdate" dateFormat="dd/mm/yy"
                        class="w-full border-zinc-300 hover:border-zinc-400 h-9" :required="true"
                        placeholder="Ex.: 01/01/2000" />
                </div>

                <div class="form-group">
                    <label for="gender" class="ml-2">
                        <i class="fas fa-venus-mars me-1"></i> <small> Gênero </small>
                    </label>
                    <Dropdown id="gender" v-model="formData.gender" :options="genders"
                        class="w-full border-zinc-300 h-9" placeholder="Ex.: Masculino" />
                </div>
            </div>

                <div class="flex w-full justify-end my-2">
                    <Button type="button" size="small" class="h-9" :loading="registration.busy"
                        @click="async () =>  (await handleSavePersonalInfo()) && nextCallback()">Próximo</Button>
                </div>
            </template>
        </StepperPanel>

        <StepperPanel>
            <template #header="{ index }">
                <button class="bg-transparent border-none inline-flex items-center justify-center w-10 h-10 rounded-full">
                    <span :class="['border w-10 h-10 flex justify-center items-center rounded-full', { 'bg-primary': index <= activeStep, 'border-surface-400': index > activeStep }]">
                        <i class="pi pi-credit-card" :class="{'text-white': index <= activeStep, 'text-surface-800': index > activeStep}" />
                    </span>
                </button>
            </template>

            <template #content="{ prevCallback }">
                <!-- Informações de pagamento -->
                <PaidEvent v-if="props.event?.type == 'Pago'" :event="props.event"
                    @update:registration="handleRegistrationUpdate" 
                />

                <div class="flex w-full justify-end my-2 gap-2">
                    <Button type="button" size="small" class="h-9" @click="() => prevCallback() && goToStep(0)">Voltar</Button>
                    <Button type="button" size="small" class="h-9" :loading="registration.busy" @click="handleSavePayment">
                        <i class="fas fa-spinner animate-spin mr-2" v-if="registration.busy" />
                        <i class="fas fa-save me-2" v-else /> {{ registration.busy ? 'Salvando' : 'Concluir' }}
                    </Button>
                </div>
            </template> 
        </StepperPanel>
    </Stepper>
</template>

<style>
.form-group {
    @apply my-1 w-[47%];
}
</style>