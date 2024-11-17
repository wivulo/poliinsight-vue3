<script>
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import RadioButton from 'primevue/radiobutton';
import TicketsService from '@/services/TicketsService.js';
import currency from '@/helpers/currency';

export default {
    name: "event.registrations.paid",
    props: {
        event: {
            type: Object,
            required: true
        }
    },
    components: {
        FloatLabel, InputText, Checkbox, Button, Dropdown, Calendar, RadioButton
    },
    data() {
        return {
            registrattion: {
                registration_mode: null,
                payment_mode: null
            },
            payment_modes: [
                {label: 'Transferência Bancária', value: 'bank_transfer'},
                {label: 'Depósito Bancário', value: 'bank_deposit'},
                {label: 'Dinheiro em mão', value: 'cash'},
            ],
            tickets: {
                busy: false,
                data: []
            },
        };
    },
    created() {
        this.getTickets();
    },
    methods: {
        async getTickets(){
            try {
                this.tickets.busy = true;
                const response = await TicketsService.getByEventId(this.event.id)
                this.tickets.data = response.data;
            } catch (error) {
                this.$toast.add({severity:'error', summary:'Erro', detail: 'Erro ao buscar os tickets', life: 3000});
            } finally {
                this.tickets.busy = false;
            }
        },

        currency(value){
            return currency.KWAZA.format(value);
        }
    },
    watch: {
        registrattion: {
            handler: function (value) {
                this.$emit('update:registration', value)
            },
            deep: true
        }
    }
}
</script>

<template>
    <div class="flex flex-col gap-3 mt-4 mb-2 text-sm" v-if="event?.type === 'paid'">
        <p class="ml-2">
            <i class="fa fa-coins mr-2" />
            Taxa de inscrição
        </p>
        <div class="flex flex-col gap-2">
            <div v-if="tickets.data.length">
                <div v-for="ticket in tickets.data" :key="ticket.id" class="flex items-center">
                    <RadioButton v-model="registrattion.registration_mode" inputId="mode1" name="mode1" :value="ticket.name" />
                    <label for="mode1" class="ml-2 text-sm">{{ticket.name}} - {{ currency(ticket.price) }}</label>
                </div>
            </div>

            <div v-else class="flex flex-col items-center justify-center">
                <p class="text-sm text-gray-500">Não há Ingressos disponíveis</p>
                <RouterLink :to="{name: 'gestao-eventos.tickets', query: {openmodalnewticket: true, eventid: event.id}}" class="text-sm text-primary-500">adicionar Ingressos</RouterLink>
            </div>
        </div>

        <p class="mt-2 ml-2">Método de pagamento</p>
        <div class="flex flex-col gap-2">
            <Dropdown id="payment" v-model="registrattion.payment_mode" :options="payment_modes" optionLabel="label" placeholder="Selecione um método de pagamento" class="h-9 w-full">
                <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex items-center text-slate-800">
                        {{ slotProps.value.label }}
                    </div>
                    <span v-else>
                        {{ slotProps.placeholder }}
                    </span>
                </template>
            </Dropdown>
        </div>
    </div>
</template>