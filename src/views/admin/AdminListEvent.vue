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
import dayjs from 'dayjs'


export default {
    name: "Admin.ListEvent",
    components: {
        Button, InputText, DataTable, Column,
        InputGroup, InputGroupAddon, Calendar,
        IconField, InputIcon, SplitButton, EventFilters,
        ModalEditEvent, ModalDeleteEvent
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
            const response = await EventServices.fetchEvents()
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
            this.$router.push({name: 'event.home', params: {id: event.id}})
        },

        handleViewEstatisticEvent(event){
            this.$router.push({name: 'event.statistic', params: {eventId: event.id}})
        },

        handleEditEvent(event){
            this.$refs.ModalEditEvent.show(event.id)
        },

        handleDeleteEvent(event){
            this.$refs.ModalDeleteEvent.show(event.id)
        },

        dateFormater(date) {
            return dayjs(date).format('D MMMM, YYYY')
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

        <div>
            <div class="flex gap-2 justify-end ">
                <template v-if="isItemSelected">
                    <Button size="small" class="actions-button">
                        <i class="fa fa-trash mr-2"></i>Deletar
                    </Button>
                </template>

                <Button size="small" class="actions-button">
                    <router-link :to="{name: 'gestao-eventos.create'}" class="text-white hover:text-primary">
                        <i class="fa fa-plus mr-2"></i> Criar evento
                    </router-link>
                </Button>
            </div>
        </div>

        <div class="my-3">
            <div class="flex">
                <InputGroup>
                    <Button size="small" class="h-9 bg-transparent border border-surface-300 border-r-0">
                        <i class="fa fa-search text-black" />
                     </Button>
                    <InputText size="small" v-model="filter" id="search" type="text" placeholder="Pesquisar..." class="w-full rounded-none h-9 border-l-0" />

                    <Button size="small" class="h-9 bg-surface-500 border-none text-black hover:bg-surface-600">
                        <i class="fa fa-filter mr-2"></i>
                        Filtro
                    </Button>

                    <SplitButton :model="searchActions" severity="secondary" size="small" />
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
                    v-model:selection="itemSelected" dataKey="id" scrollable scrollHeight="380px"
                    @row-select="onRowSelected" @row-unselect="onRowUnselected"
                    :loading="busy" lazy
                >
                
                    <Column selectionMode="multiple" v-if="selectionModeIsVisible" headerStyle="width: 3rem"></Column>
                    
                    <Column field="int_id" header="ID" />
                    
                    <Column field="name" header="Nome"></Column>
                    
                    <Column field="localization" header="Localização" />

                    <Column field="date" header="Data">
                        <template #body="props">
                            {{ dateFormater(props.data.date) }}
                        </template>
                    </Column>
                    
                    <Column field="organizer.name" header="Organizador" />

                    <Column field="actions" header="Ações">
                        <template #body="props">
                            <SplitButton 
                                :model="[
                                    {
                                        label: 'Visualizar',
                                        icon: 'fa fa-eye',
                                        command: () => this.handleViewEvent(props.data)
                                    },
                                    {
                                        label: 'Ver estátisticas',
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
                                severity="secondary" size="small" class="text-sm"
                            >
                                <div  class="px-2 py-1">
                                    <i class="fa fa-cog mr-1" /> opções
                                </div>
                            </SplitButton>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style scoped>
.actions-button {
    @apply h-8 bg-surface-500 border-none hover:bg-surface-600
}
</style>