<script>
import TicketsService from '@/services/TicketsService.js';
import EventServices from '@/services/EventServices';
import { mapGetters } from 'vuex';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import { event } from '@/store/modules/event';


export default {
    name: "ModalNovoTicket",
    components: {
        Dialog, ProgressSpinner, Button,
        InputText, InputNumber, Dropdown
    },
    data(){
        return {
            visible: false,
            busy: false,
            ticket: {
                name: null,
                eventId: null,
                price: 0,
                quantity: 0,
            },
            events: {
                busy: false,
                data: [],
                selected: null,
            }
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
            this.fetchEvents();

            if(this.$route.query.openmodalnewticket && this.$route.query.eventid){
                this.fetchEvent();
            }
        },

        async fetchEvents(){
            this.events.busy = true
            const response = await EventServices.fetchEventsOrganizer(this.user.id)
            .catch(() => this.$toast.add({severity:'error', summary: 'Error', detail: 'Erro ao buscar os eventos', life: 3000}))
            this.events.data = response.data
            this.events.busy = false
        },

        async fetchEvent(){
            try {
                this.events.busy = true
                const response = await EventServices.show(this.$route.query.eventid)
                this.ticket.eventId = response.data?.id
            } catch (error) {
                this.$toast.add({severity:'error', summary: 'Error', detail: 'Erro ao buscar os eventos', life: 3000})
            } finally {
                this.events.busy = false
            }
        },
        

        async handleStore(){
            this.busy = true;
            // this.ticket.eventId = this.events.selected.id;
            const response = await TicketsService.store(this.ticket)
            .catch(() => this.handleErrorMessage())

            this.busy = false

            if(response.status == 201 && !response.data.error){
                this.$toast.add({severity:'success', summary: 'Success', detail: 'Ingresso criado com sucesso', life: 3000});
                this.$emit('created');
                this.reset();
                this.handlehidden();
                return;
            }else{
                this.handleErrorMessage();
            }

            this.handleErrorMessage();
        },

        handleErrorMessage(){
            this.$toast.add({severity:'error', summary: 'Error', detail: 'Erro ao criar o ticket', life: 3000});
        },

        reset(){
            this.visible = false;
            this.ticket = {
                name: null,
                eventId: null,
                price: 0,
                quantity: 0,
            }

            this.events = {
                busy: false,
                data: [],
                selected: null,
            }
        },

        handlehidden(){
            this.visible = false;
        },

        handleCancel(){
            this.handlehidden()
            this.reset()
        },
    }
}
</script>

<template>
    <Dialog v-model:visible="visible" modal header="Ingresso" :style="{ width: '30rem' }">
        <div>
            <div class="flex flex-col w-full">
                <label for="event">Evento</label>
                <Dropdown id="event" v-model="ticket.eventId" :options="events.data" optionLabel="name" optionValue="id" placeholder="Selecione um evento" 
                    class="w-full">
                    <template #value="slotProps">
                        <div v-if="slotProps.value" class="flex items-center text-slate-700">
                            {{ events.data.find(event => event.id === slotProps.value).name }}
                        </div>
                        <span v-else>
                            {{ slotProps.placeholder }}
                        </span>
                    </template>
                </Dropdown>
            </div>
            
            <div class="flex flex-col w-full my-2">
                <label for="name">Nome</label>
                <InputText id="name" v-model="ticket.name" class="w-full h-9" placeholder="Ex:. INDIVIDUAL"/>
            </div>

            <div class="flex gap-3 mt-2">
                <div class="flex flex-col w-1/2">
                    <label for="price">Preço</label>
                    <InputNumber id="price" v-model="ticket.price" mode="currency" currency="AOA" locale="pt-AO" :min="0" :max="500000" class="h-9"/>
                </div>
                <div class="flex flex-col w-1/2">
                    <label for="quantity">Quantidade</label>
                    <InputNumber id="quantity" v-model="ticket.quantity" :min="0" :max="100000" class="h-9"/>
                </div>
            </div>
        </div>

        <template #footer>
                <div class="flex gap-3 justify-end">
                    <Button severity="secondary" text @click="handleCancel" size="small" class="h-9">
                        <i class="fa fa-times mr-1"/> Cancelar
                    </Button>
                    <Button @click="handleStore" size="small" class="h-9" :loading="busy">
                        <i class="fas fa-spinner animate-spin mr-1" v-if="busy" />
                        <i class="fa fa-save mr-1"/> {{ busy ? 'Salvando...' : 'Salvar' }}
                    </Button>
                </div>
        </template>
    </Dialog>
</template>