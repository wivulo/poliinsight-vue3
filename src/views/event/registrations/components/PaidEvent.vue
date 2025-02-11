<script setup>
import { reactive, ref, onMounted, watch } from 'vue';
import { useNotification } from '@/composables/useNotification';
import BanckAccountServices from '@/services/BanckAccountServices';
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import RadioButton from 'primevue/radiobutton';
import TicketsService from '@/services/TicketsService.js';
import currency from '@/helpers/currency';

// Registrar componentes se necessário ou utilizar auto-import
// Ex: defineOptions({ components: { FloatLabel, InputText, Checkbox, Button, Dropdown, Calendar, RadioButton } })

const props = defineProps({
    event: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['update:registration']);
const { notifyError } = useNotification();

const registration = reactive({
    ticketId: null,
    method: null,
    bankAccountId: null,
    transationReference: null
});

const payment_modes = ref([
    { label: 'Transferência Bancária', value: 'bank_transfer' },
    { label: 'Depósito Bancário', value: 'bank_deposit' },
    { label: 'TPA', value: 'tpa' },
    { label: 'Dinheiro em mão', value: 'cash' },
]);

const tickets = reactive({
    busy: false,
    data: []
});

const banksAccount = reactive({
    busy: false,
    data: []
});


async function fetchTickets() {
    try {
        tickets.busy = true;
        const response = await TicketsService.getByEventId(props.event.id);
        tickets.data = response.data;
    } catch (error) {
        notifyError('Erro ao buscar os tickets');
    } finally {
        tickets.busy = false;
    }
}

async function fetchBanksAccount() {
    try {
        banksAccount.busy = true;
        const response = await BanckAccountServices.index();
        if(response.status === 200) {
            banksAccount.data = response.data;
            return;
        }

        throw new Error();
    } catch (error) {
        console.error(error);
        notifyError('Erro ao buscar as contas bancárias');
    } finally {
        banksAccount.busy = false;
    }
}

function formatCurrency(value) {
    return currency.KWAZA.format(value);
}

onMounted(() => {
    fetchTickets();
    fetchBanksAccount();
});

watch(registration, (value) => {
    emit('update:registration', value);
}, { deep: true });

</script>

<template>
    <div class="flex flex-col gap-3 mt-4 mb-2 text-sm" v-if="props.event?.type === 'Pago'">
        <p class="ml-2">
            <i class="fa fa-coins mr-2" />
            Taxa de inscrição
        </p>

        <div class="flex flex-col gap-2">
            <div v-if="tickets.data.length">
                <div v-for="ticket in tickets.data" :key="ticket.id" class="flex items-center">
                    <RadioButton v-model="registration.ticketId" inputId="mode1" name="mode1" :value="ticket.id" />
                    <label for="mode1" class="ml-2 text-sm">{{ ticket.name }} - {{ formatCurrency(ticket.price) }}</label>
                </div>
            </div>
            <div v-else class="flex flex-col items-center justify-center">
                <p class="text-sm text-gray-500">Não há Ingressos disponíveis</p>
                <RouterLink :to="{name: 'gestao-eventos.tickets', query: {openmodalnewticket: true, eventid: props.event.id}}" class="text-sm text-primary-500">adicionar Ingressos</RouterLink>
            </div>
        </div>

        <div class="flex flex-col gap-3">
            <label for="paymentmethod" class="ml-2">Método de pagamento</label>
            
            <Dropdown id="paymentmethod" v-model="registration.method" :options="payment_modes" optionLabel="label" optionValue="value" placeholder="Selecione um método de pagamento" class="h-9 w-full">
                <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex items-center text-slate-800">
                        {{ payment_modes.find(mode => mode.value === slotProps.value).label }}
                    </div>
                    <span v-else>
                        {{ slotProps.placeholder }}
                    </span>
                </template>
            </Dropdown>
        </div>

        <div class="flex flex-col gap-3">
            <label for="bankaccount" class="ml-2">Conta bancária</label>
            
            <Dropdown id="bankaccount" v-model="registration.bankAccountId" :options="banksAccount.data" optionLabel="bank" optionValue="id" placeholder="Selecione uma conta bancária" class="h-9 w-full">
                <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex items-center text-slate-800">
                        {{ banksAccount.data.find(bank => bank.id === slotProps.value)?.bank }}
                    </div>
                    <span v-else>
                        {{ slotProps.placeholder }}
                    </span>
                </template>
            </Dropdown>
        </div>

        <div class="flex flex-col gap-3">
            <label for="transationReference" class="ml-2">Referência da transação</label>
            <InputText id="transationReference" v-model="registration.transationReference" class="h-9 w-full" 
                placeholder="Referência da transação"
            />
        </div>
    </div>
</template>