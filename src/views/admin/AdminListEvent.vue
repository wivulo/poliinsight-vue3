<script>
import { mapGetters } from 'vuex';
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

import { dateFormatter } from "@/utils/dateFormatter"

export default {
    name: "Admin.ListEvent",
    components: {
        Button, InputText, DataTable, Column,
        InputGroup, InputGroupAddon, Calendar,
        IconField, InputIcon, SplitButton
    },
    data(){
        return {
            isItemSelected: false,
            itemSelected: null,
            filter: null,
            filters: {
                organizer: null,
                name: null,
                creationDate: null,
                startDate: null,
                status: null,
                participants: null
            },
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

            optionsActions: [
                {
                    label: 'Visualizar',
                    icon: 'fa fa-eye',
                    command: this.handleViewEvent
                },
                {
                    label: 'Ver estátisticas',
                    icon: 'fa fa-chart',
                    command: this.handleViewEstatisticEvent
                },
                {
                    label: 'Editar',
                    icon: 'fa fa-pencil',
                    command: this.handleVEditEvent
                },
                {
                    label: 'Eliminar',
                    icon: 'fa fa-trash',
                    command: this.handleDeleteEvent
                },
            ],
            
        }
    },
    created(){
        this.$store.dispatch("admin/fetchEvents")
    },
    computed: {
        ...mapGetters({
            events: 'admin/events',
            user: 'auth/user'
        }),

        events_formatter(){
            return this.events.map((eve, i) => {
                return {...eve, int_id: i + 1 }
            })
        },

        date_formatter(){
            return dateFormatter
        }
    },
    methods: {
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

        handleViewer(event){
            this.$router.push({name: 'event.home', params: {id: event.data.id}})
        },

        handleStatistic(event){
            this.$router.push({name: 'admin.reports', params: {eventId: event.data.id}})
        },

        handleEdit(event){},

        handleHideSelectionMode(){
            this.selectionModeIsVisible = false;
            this.selectedEvents = [];
        },

        handleViewEvent(){},

        handleViewEstatisticEvent(){},

        handleVEditEvent(){},

        handleDeleteEvent(){},
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
        <div>
            <div class="flex gap-2 justify-end ">
                <template v-if="isItemSelected">
                    <Button size="small" class="actions-button">
                        <i class="fa fa-trash mr-2"></i>Deletar
                    </Button>
                </template>

                <Button size="small" class="actions-button">
                    <router-link :to="{name: 'admin.create_event'}" class="text-white hover:text-primary">
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
            <div>
                <h6>Filtrar por</h6>
            </div>
            <div class="w-100"></div>
            <div>
                <div>
                    <select name="filter-organizar" v-model="filters.organizer" class="form-select form-select-sm">
                        <option value="none" selected>__selecione um organizador</option>
                        <option v-for="(op, i) in [1, 2, 4, 5, 6]" :value="op" :key="i">
                            {{ op }}
                        </option>
                    </select>
                </div>
            </div>

            <div>
                <div label-class="text-md">
                    <InputText v-model="filters.organizer" type="text" placeholder="Nome..."></InputText>
                </div>
            </div>

            <div>
                <select name="filter-organizar" v-model="filters.status" class="form-select form-select-sm">
                    <option value="none" selected>__selecione um status</option>
                    <option v-for="(op, i) in ['brevemente','ocorrendo','terminado', 'cancelado']" :value="op" :key="i">
                        {{ op }}
                    </option>
                </select>
            </div>

            <div>
                <div label="criados em" label-class="text-md">
                    <Calendar v-model="filters.creationDate" placeholder="Data de criação..."></Calendar>
                </div>

                <div label="criados em" label-class="text-md">
                    <Calendar v-model="filters.startDate" placeholder="Data de início..."></Calendar>
                </div>
            </div>

            <div>
                <div>
                    <select name="filter-organizar" v-model="filters.participants" class="form-select form-select-sm">
                        <option value="none" selected>__selecione o nª de participantes</option>
                        <option v-for="(op, i) in [1, 2, 4, 5, 6]" :value="op" :key="i">
                            {{ op }}
                        </option>
                    </select>
                </div>
            </div>
        </div>

        <div>
            <div v-if="selectionModeIsVisible" class="my-4 w-full flex justify-between items-center">
                <div class="flex gap-3 items-center">
                    <Button size="small" text icon="fa fa-times" class="h-6 w-6" @click="handleHideSelectionMode"/> 
                    Selecionados: {{ selectedEvents.length }}
                </div>
            </div>

            <div>
                <DataTable :value="events_formatter" size="small" showGridlines paginator :rows="7"
                    v-model:selection="itemSelected" dataKey="id" scrollable scrollHeight="380px"
                    @row-select="onRowSelected" @row-unselect="onRowUnselected">
                
                    <Column selectionMode="multiple" v-if="selectionModeIsVisible" headerStyle="width: 3rem"></Column>
                    
                    <Column field="int_id" header="ID" />
                    
                    <Column field="name" header="Nome"></Column>
                    
                    <Column field="date" header="Data">
                        <template #body="props">
                            {{ date_formatter(props.data.date) }}
                        </template>
                    </Column>
                    
                    <Column field="localization" header="Localização" />
                    
                    <Column field="organizer.name" header="Organizador" />

                    <Column field="actions" header="Ações">
                        <template #body="props">
                            <!-- <Button size="small" text @click="handleEdit(props)"  title="Editar">
                                <i class="fa fa-pencil text-surface-700"></i>
                            </Button>

                            <Button size="small" text @click="handleStatistic(props)" title="Ver Estátiscas">
                                <i class="fa fa-chart-line text-surface-700"></i>
                            </Button>

                            <Button size="small" text @click="handleViewer(props)" title="Visualizar">
                                <i class="fa fa-eye text-surface-700"></i>
                            </Button> -->

                            <SplitButton :model="optionsActions" severity="secondary" size="small" />

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