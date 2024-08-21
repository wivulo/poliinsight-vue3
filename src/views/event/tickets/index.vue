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
import CCard from "@/components/PCard/index.js"
import SpeedDial from 'primevue/speeddial';
import Dropdown from 'primevue/dropdown';


export default {
    name: "event.tickets",
    mixins: [setDocumentTitleMixin],
    components: {
        DataTable, Column, SplitButton, Button, InputText, InputGroup, 
        ModalNewTicket, ModalEditTicket, ModalDeleteTicket,
        InputNumber, CardRoot: CCard.Root, SpeedDial, Dropdown
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

            isShowActions: false,
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

        <CardRoot class="mt-4">
        <div class="flex gap-2 justify-between my-2">
            <div>
                <h1 class="text-base font-semibold">Ingressos</h1>
                <p class="text-sm">Lista de ingressos dos meus eventos</p>
            </div>

            <div>
                <template v-if="isItemSelected">
                    <Button severity="secondary" size="small" class="actions-button h-9">
                        <i class="fa fa-trash mr-2"></i>Deletar
                    </Button>
                </template>

                <Button size="small" class="actions-button h-9 px-5" @click="handleNewTicket">
                    <i class="fa fa-plus mr-1"></i> ingresso
                </Button>
            </div>
        </div>

        <hr />

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
            v-model:selection="itemSelected" dataKey="id"
            @row-select="onRowSelected" @row-unselect="onRowUnselected" class="ctable"
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

            
            <Column field="actions" header="Ações" class="relative">
                <template #body="props">
                    <Dropdown 
                        :options="[
                            {
                                label: 'Editar',
                                icon: 'fa fa-pencil',
                                command: () => handleEditTicket(props.data)
                            },
                            {
                                label: 'Eliminar',
                                icon: 'fa fa-trash',
                                command: () => handleDeleteTicket(props.data)
                            },
                        ]" 
                        class="p-0 bg-primary-500"
                        icon
                        option-label="label"
                    >
                        <template #value>
                            <div class="flex justify-center items-center text-white">
                                <i class="fa fa-cog mr-1"/> Opções
                            </div>
                        </template>

                        <template #option="{ option }">
                            <div class="h-2 text-md text-zinc-700 py-2 w-full" @click="option.command">
                                <i :class="option.icon" class="mr-1" /> {{ option.label }}
                            </div>
                        </template>

                        <template #dropdownicon>
                            <i class="fa fa-chevron-down text-white"/>
                        </template>
                    </Dropdown>
                </template>
            </Column>

            <template #empty>
                <div class="flex items-center justify-center h-10">
                    <p class="text-gray-400">Nenhum dado disponível</p>
                </div>
            </template>
        </DataTable>
        </CardRoot>
    </div>
</template>

<style>
div[data-pc-section="root"].ctable > div[data-pc-section="wrapper"] {
    overflow: visible !important;
}
</style>