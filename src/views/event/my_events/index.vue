<script>
import EventServices from '@/services/EventServices';
import { mapGetters } from 'vuex';
import { dateFormatter } from "@/utils/dateFormatter"
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Calendar from 'primevue/calendar';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import SplitButton  from 'primevue/splitbutton';
import EventFilters from "@/components/EventFilters.vue"
import ModalEditEvent from "@/views/event/components/ModalEditEvent.vue"
import ModalDeleteEvent from "@/views/event/components/ModalDeleteEvent.vue"
import EventStatus from '@/components/EventStatus.vue';
import Dropdown from 'primevue/dropdown';
import CCard from "@/components/PCard/index.js"
import dayjs from 'dayjs'


export default {
    name: "Event.MyEvents",
    components: {
        Button, InputText, DataTable, Column,
        InputGroup, InputGroupAddon, Calendar, CardRoot: CCard.Root,
        IconField, InputIcon, SplitButton, EventFilters,
        ModalEditEvent, ModalDeleteEvent, EventStatus, Dropdown
    },
    data(){
        return {
            busy: false,
            events: [],
            isItemSelected: false,
            itemSelected: null,
            filter: null,
            
            selectedEvents: [],
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
        this.fetchEvents()
    },
    computed: {
        ...mapGetters({
            user: 'auth/user'
        }),

        date_formatter(){
            return dateFormatter
        }
    },
    methods: {
        async fetchEvents(){
            this.busy = true
            const response = await EventServices.fetchEventsOrganizer(this.user.id)
            .catch(() => this.$toast.add({severity:'error', summary: 'Error', detail: 'Erro ao buscar os eventos', life: 3000}))
            .finally(() => this.busy = false )

            if(response.status == 200){
                this.events = response.data.map((eve, i) => {
                return {...eve, int_id: i + 1 }
            })
                return
            }

            this.$toast.add({severity:'error', summary: 'Error', detail: 'Erro ao buscar os eventos', life: 3000})
        },

        onRowSelected(item){
            this.selectedEvents.push(item.data);
            this.isItemSelected = true;
        },
        onRowUnselected(item){
            this.selectedEvents = this.selectedEvents.filter(user => user.id !== item.data.id);

            if(this.selectedEvents.length === 0){
                this.isItemSelected = false;
            }
        },

        handleHideSelectionMode(){
            this.selectionModeIsVisible = false;
            this.selectedEvents = [];
        },

        handleViewEvent(event){
            this.$router.push({name: 'event.show', params: {id: event.id}})
        },

        handleViewEstatisticEvent(event){
            this.$router.push({name: 'analise_relatorios.analitics.show', params: {id: event.id}})
        },

        handleEditEvent(event){
            this.$refs.ModalEditEvent.show(event.id)
        },

        handleDeleteEvent(event){
            this.$refs.ModalDeleteEvent.show(event.id)
        },

        dateFormater(date) {
            return dayjs(date).format('DD/MM/YYYY')
        }
    },
    filters: {
        maxLengthFilter(value){
            return value.substring(0, 10) + '...';
        }
    }
}
</script>

<template>
    <div class="p-4 px-5 w-full">
        <ModalEditEvent ref="ModalEditEvent" />
        <ModalDeleteEvent ref="ModalDeleteEvent" @event-deleted="fetchEvents" />

        <CardRoot class="mt-4">

            <div class="flex justify-between items-center">
                <div>
                    <h1 class="text-base font-semibold">Meus eventos</h1>
                    <p class="text-sm">Lista dos meus eventos</p>
                </div>

                <div class="flex gap-2 justify-end ">
                    <template v-if="isItemSelected">
                        <Button size="small" severity="secondary">
                            <i class="fa fa-trash mr-2"></i>Deletar
                        </Button>
                    </template>
                </div>
            </div>

            <hr />

            <div class="my-3">
                <div class="flex">
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
            </div>

            <div class="my-3" v-show="showFilters">
               <EventFilters />
            </div>

            <div>
                <div v-if="selectionModeIsVisible" class="my-4 w-full flex justify-between items-center">
                    <div class="flex gap-3 items-center">
                        <Button size="small" text icon="fa fa-times" class="h-6 w-6" @click="handleHideSelectionMode"/> 
                        Selecionados: {{ selectedEvents.length }}
                    </div>
                </div>

                <div>
                    <DataTable :value="events" size="small" paginator :rows="7"
                        v-model:selection="itemSelected" dataKey="id" scrollable
                        @row-select="onRowSelected" @row-unselect="onRowUnselected"
                        :loading="busy" lazy class="ctable" :rowsPerPageOptions="[7, 10, 20, 50]" 
                        :totalRecords="events.length" stripedRows
                    >

                        <Column selectionMode="multiple" v-if="selectionModeIsVisible" headerStyle="width: 3rem"></Column>

                        <Column field="int_id" header="ID" />

                        <Column field="name" header="Nome">
                            <template #body="props">
                                <router-link :to="{name: 'event.show', params: {id: props.data.id}}" class="hover:text-primary-500">
                                    {{ props.data.name }}
                                </router-link>
                            </template>
                        </Column>

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

                        <!-- <Column field="organizer.name" header="Organizador" /> -->

                        <Column field="actions" header="Ações">
                            <template #body="props">
                                <Dropdown 
                                    :options="[
                                        {
                                            label: 'Visualizar',
                                            icon: 'fa fa-eye',
                                            command: () => this.handleViewEvent(props.data)
                                        },
                                        {
                                            label: 'Mapa do evento',
                                            icon: 'fa fa-chart-line',
                                            command: () => this.handleViewEstatisticEvent(props.data)
                                        },
                                        {
                                            label: 'Editar',
                                            icon: 'fa fa-pencil',
                                            command: () => this.handleEditEvent(props.data)
                                        },
                                        {
                                            label: 'Eliminar',
                                            icon: 'fa fa-trash',
                                            command: () => this.handleDeleteEvent(props.data)
                                        },
                                    ]" 
                                    class="p-0 bg-primary-500"
                                    option-label="label"
                                >
                                    <template #value>
                                        <div class="flex justify-center items-center text-white">
                                            <i class="fa fa-cog"/>
                                        </div>
                                    </template>

                                    <template #option="{ option }">
                                        <div class="h-2 text-sm flex items-center text-zinc-700 py-2 w-full" @click="option.command">
                                            <i :class="option.icon" class="mr-1" /> {{ option.label }}
                                        </div>
                                    </template>

                                    <template #dropdownicon>
                                        <i class="fa fa-chevron-down text-white"/>
                                    </template>
                                </Dropdown>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>
        </CardRoot>
    </div>
</template>

<style>
div[data-pc-section="root"].ctable > div[data-pc-section="wrapper"] {
    overflow: visible !important;
}
</style>