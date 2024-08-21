<script>
import EventServices from '@/services/EventServices';
import { setDocumentTitleMixin } from "@/config/document.title.js"
import { mapGetters } from 'vuex';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import InputNumber from 'primevue/inputnumber';
import CCard from "@/components/PCard/index.js"
import Dropdown from 'primevue/dropdown';
import dayjs from 'dayjs'

export default {
    name: "event.registrations",
    mixins: [setDocumentTitleMixin],
    components: {
        DataTable, Column, Button, InputText, InputGroup,
        InputNumber, CardRoot: CCard.Root, Dropdown
    },
    data(){
        return {
            title: 'Poliinsight | Incrições',
            busy: false,
            event: null,
            events: {
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
        this.getEvents();
    },
    computed: {
        ...mapGetters({
            user: 'auth/user',
        }),
    },
    methods: {
        async getEvents(){
            this.events.busy = true
            const responde = await EventServices.fetchEventsOrganizer(this.user.id)
            .catch(() => this.$toast.add({severity: 'error', summary: 'Erro', detail: 'Erro ao buscar os eventos'}))
            this.events.data = responde.data
            this.events.busy = false
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

        dateFormater(date) {
            return dayjs(date).format('DD/MM/YYYY')
        }
    }
}
</script>

<template>
    <div class="w-full py-3 px-5">
        <CardRoot class="mt-4">
        <div class="flex my-2">
            <div>
                <h1 class="text-base font-semibold">Incrições</h1>
                <p class="text-sm">Lista de eventos para inscrições</p>
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

        <DataTable :value="events.data" size="small" paginator :rows="7" :totalRecords="events.data.length"
            v-model:selection="itemSelected" dataKey="id"
            @row-select="onRowSelected" @row-unselect="onRowUnselected" class="ctable"
            :loading="events.busy" lazy :rowsPerPageOptions="[7, 10, 20, 50]"
        >

            <Column field="name" header="Nome" />
                    
            <Column field="localization" header="Localização" />

            <Column field="date" header="Data">
                <template #body="props">
                    {{ dateFormater(props.data.date) }}
                </template>
            </Column>

            <Column field="category" header="Tipo de evento" >
                <template #body="props">
                    {{ props.data.category?.name }}
                </template>
            </Column>

            <Column field="status" header="Estado" >
                <template #body="props">
                    <EventStatus :status="props.data.status" />
                </template>
            </Column>

            
            <Column field="actions" header="Ações" class="relative">
                <template #body="props">
                    <Button size="small" class="h-9">
                        <i class="fa fa-pencil mr-1 text-sm" /> incrição
                    </Button>
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