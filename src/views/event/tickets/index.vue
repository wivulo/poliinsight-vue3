<script>
import TicketsService from '@/services/TicketsService.js';
import { setDocumentTitleMixin } from "@/config/document.title.js"
import { mapGetters } from 'vuex';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import SplitButton from 'primevue/splitbutton';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import ModalNewTicket from './components/ModalNovoTicket.vue';
import ModalEditTicket from './components/ModalEditTicket.vue';
import ModalDeleteTicket from './components/ModalDeleteTicket.vue';
import InputNumber from 'primevue/inputnumber';

export default {
    name: "event.tickets",
    mixins: [setDocumentTitleMixin],
    components: {
        DataTable, Column, SplitButton, Button, InputText, InputGroup, 
        ModalNewTicket, ModalEditTicket, ModalDeleteTicket,
        InputNumber
    },
    data(){
        return {
            title: 'Poliinsight | Ingressos',
            tickets: {
                busy: false,
                data: []
            },
            isItemSelected: false,
            itemSelected: null,
            filter: null,
            
            selectedTickets: [],
            showFilters: false,

            selectionModeIsVisible: false,

            searchActions: [
                {
                    label: 'Mostrar caixa de seleção',
                    icon: 'fa fa-check-square',
                    command: () => {
                        this.selectionModeIsVisible = !this.selectionModeIsVisible;
                    }
                },
            ],
        }
    },
    created(){
        this.getTickets();
    },
    computed: {
        ...mapGetters({
            user: 'auth/user',
        }),
    },
    methods: {
        async getTickets(){
            this.tickets.busy = true;
            const response = await TicketsService.getByUserId(this.user.id)
            .catch(error => {
                this.$toast.add({severity:'error', summary:'Erro', detail: 'Erro ao buscar os tickets', life: 3000});
            });
            this.tickets.data = response.data;
            this.tickets.busy = false;
        },

        handleHideSelectionMode(){
            this.selectionModeIsVisible = false;
            this.selectedTickets = [];
        },

        onRowSelected(item){
            this.selectedTickets.push(item.data);
            this.isItemSelected = true;
        },
        onRowUnselected(item){
            this.selectedTickets = this.selectedTickets.filter(user => user.id !== item.data.id);

            if(this.selectedTickets.length === 0){
                this.isItemSelected = false;
            }
        },

        handleNewTicket(){
            this.$refs.ModalNewTicket.show();
        },

        handleEditTicket(ticket){
            this.$refs.ModalEditTicket.show(ticket.id)
        },

        handleDeleteTicket(ticket){
            this.$refs.ModalDeleteTicket.show(ticket.id)
        },
    }
}
</script>

<template>
    <div class="w-full py-3 px-5">
        <ModalNewTicket ref="ModalNewTicket" @created="getTickets" />
        <ModalEditTicket ref="ModalEditTicket" @updated="getTickets" />
        <ModalDeleteTicket ref="ModalDeleteTicket" @deleted="getTickets" />

        <div class="flex gap-2 justify-end my-2">
            <template v-if="isItemSelected">
                <Button severity="secondary" size="small" class="actions-button h-9">
                    <i class="fa fa-trash mr-2"></i>Deletar
                </Button>
            </template>

            <Button size="small" class="actions-button h-9 px-5" @click="handleNewTicket">
                <i class="fa fa-plus mr-1"></i> ingresso
            </Button>
        </div>

        <div class="flex my-4">
            <InputGroup>
                <Button size="small" class="h-9 bg-transparent border border-surface-300 border-r-0">
                    <i class="fa fa-search text-black" />
                 </Button>
                <InputText size="small" v-model="filter" id="search" type="text" placeholder="Pesquisar..." class="w-full rounded-none h-9 border-l-0" />

                <Button size="small" severity="transparent" class="h-9 border border-zinc-300 border-r-0">
                    <i class="fa fa-filter mr-2"></i>
                    Filtro
                </Button>

                <SplitButton :model="searchActions" severity="transparent" class="border border-l-0 border-zinc-300 rounded-l-none" size="small" />
            </InputGroup>
        </div>

        <div v-if="selectionModeIsVisible" class="my-4 w-full flex justify-between items-center">
            <div class="flex gap-3 items-center">
                <Button size="small" text icon="fa fa-times" class="h-6 w-6" @click="handleHideSelectionMode"/> 
                    Selecionados: {{ selectedTickets.length }}
            </div>
        </div>

        <DataTable :value="tickets.data" size="small" paginator :rows="7" :totalRecords="tickets.data.length"
            v-model:selection="itemSelected" dataKey="id" scrollable scrollHeight="380px"
            @row-select="onRowSelected" @row-unselect="onRowUnselected"
            :loading="tickets.busy" lazy :rowsPerPageOptions="[7, 10, 20, 50]"
        >
                
            <Column selectionMode="multiple" v-if="selectionModeIsVisible" headerStyle="width: 3rem"></Column>
                        
            <Column field="name" header="Nome"></Column>
            
            <Column field="price" header="Preço">
                <template #body="props">
                    <InputNumber id="price" v-model="props.data.price" mode="currency" currency="AOA" locale="pt-AO" class="h-9 w-auto" input-class="w-auto border-none" :readonly="true"/>
                </template>
            </Column>

            <Column field="quantity" header="Quantidade" />

            <Column field="event.name" header="Evento" />

            
            <Column field="actions" header="Ações">
                <template #body="props">
                    <SplitButton 
                        :model="[
                            {
                                label: 'Editar',
                                icon: 'fa fa-pencil',
                                command: () => this.handleEditTicket(props.data)
                            },
                            {
                                label: 'Eliminar',
                                icon: 'fa fa-trash',
                                command: () => this.handleDeleteTicket(props.data)
                            },
                        ]" 
                        size="small" class="text-sm"
                    >
                        <div  class="px-2 py-1">
                            <i class="fa fa-cog mr-1" /> opções
                        </div>
                    </SplitButton>
                </template>
            </Column>

            <template #empty>
                <div class="flex items-center justify-center h-10">
                    <p class="text-gray-400">Nenhum dado disponível</p>
                </div>
            </template>
        </DataTable>
    </div>
</template>