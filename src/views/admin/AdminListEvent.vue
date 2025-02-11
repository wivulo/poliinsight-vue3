<script>
import { setDocumentTitleMixin } from "@/config/document.title.js"
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
import { extendedDayjs } from "@/plugin/dayjs";
import PDropdown from "@/components/PDropdown/PDropdown.vue";
import PDropdownTrigger from "@/components/PDropdown/PDropdownTrigger.vue";
import PDropdownMenu from "@/components/PDropdown/PDropdownMenu.vue";
import PDropdownItem from "@/components/PDropdown/PDropdownItem.vue";
import CCard from "@/components/PCard/index.js"
import VueToPrintWrapper from "@/components/VueToPrintWrapper.vue";

export default {
    name: "Admin.ListEvent",
    mixins: [setDocumentTitleMixin],
    components: {
        VueToPrintWrapper, CardRoot: CCard.Root, Button, InputText, DataTable, Column,
        InputGroup, InputGroupAddon, Calendar,
        IconField, InputIcon, SplitButton, EventFilters,
        ModalEditEvent, ModalDeleteEvent,
        PDropdown, PDropdownTrigger, PDropdownMenu, PDropdownItem
    },
    data(){
        return {
            title: 'Lista de eventos | Poliinsight',
            busy: false,
            events: [],
            totalRecords: 0,
            isItemSelected: false,
            itemSelected: null,
            filter: null,
            
            selectedEvents: [],
            showFilters: false,

            selectionModeIsVisible: false,

            search: '',
            params: {
                take: 10,
                skip: 1,
                where: {
                    OR: [
                        {
                            name: { contains: this.search }
                        },
                        {
                            location: { contains: this.search}
                        },
                        {
                            organizer: { 
                                name: { contains: this.search}
                            }
                        },
                        {
                            description: { contains: this.search}
                        }
                    ]
                }
            }
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
            const response = await EventServices.index(this.params)
            .catch(() => this.$toast.add({severity:'error', summary: 'Error', detail: 'Erro ao buscar os eventos', life: 3000}))
            .finally(() => this.busy = false )

            if(response.status == 200){
                this.events = response.data.data
                this.totalRecords = response.data.total
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
            return extendedDayjs(date).format('D MMMM, YYYY')
        },

        onPageChange (event) {
            this.params.skip = event.page + 1
            this.params.take = event.rows
        }
    },
    filters: {
        maxLengthFilter(value){
            return value.substring(0, 10) + '...';
        }
    },
    watch: {
        params: {
            handler(){
                this.fetchEvents()
            },
            deep: true
        }
    }
}
</script>

<template>
    <div class="p-4 px-5 w-full">
        <ModalEditEvent ref="ModalEditEvent" />
        <ModalDeleteEvent ref="ModalDeleteEvent" @event-deleted="fetchEvents" />

        <CardRoot class="mt-4">
            <VueToPrintWrapper type="Meus eventos">
                <template #default="{ printer }">
                    <div class="flex justify-between items-center no-print">
                        <div>
                            <h1 class="text-base font-semibold">Eventos</h1>
                            <p class="text-sm">Lista de todos os eventos da plataforma</p>
                        </div>

                        <div class="flex gap-2 justify-end">
                            <template v-if="isItemSelected">
                                <Button size="small" class="actions-button">
                                    <i class="fa fa-trash mr-2"></i>Deletar
                                </Button>
                            </template>

                            <Button size="small" class="actions-button">
                                <router-link :to="{name: 'gestao-eventos.create'}" class="text-white hover:text-primary">
                                    <i class="fa fa-plus mr-2"></i> Evento
                                </router-link>
                            </Button>

                            <Button severity="secondary" size="small" class="actions-button" @click="printer.handlePrint">
                                    <i class="fa fa-print mr-2" /> Imprimir
                            </Button>
                        </div>
                    </div>

                    <div class="my-3">
                        <div class="flex">
                            <InputGroup>
                                <Button size="small" class="h-8 bg-transparent border border-surface-300 border-r-0">
                                    <i class="fa fa-search text-black" />
                                </Button>
                                <InputText size="small" v-model="search" id="search" type="text" 
                                    placeholder="Pesquisar..." class="w-full rounded-none h-8 border-l-0"
                                    @keypress.enter="fetchEvents" 
                                />

                                <Button severity="secondary" size="small" class="h-8 border-l-0">
                                    <i class="fa fa-filter mr-2" /> Filtro
                                </Button>
                            </InputGroup>
                        </div>
                    </div>

                    <div>
                        <div>
                            <DataTable :value="events" size="small" paginator :rows="7"
                                v-model:selection="itemSelected" stripedRows :totalRecords="totalRecords"
                                dataKey="id" lazy class="ctable" :rowsPerPageOptions="[7, 10, 20, 50]"
                                @row-select="onRowSelected" @row-unselect="onRowUnselected"
                                :loading="busy" @page="onPageChange"
                                v-model:rows="params.take"
                                v-model:page="params.skip"
                            >
                            
                                <Column selectionMode="multiple" v-if="selectionModeIsVisible" headerStyle="width: 3rem"></Column>
                                                    
                                <Column field="name" header="Nome">
                                    <template #body="props">
                                        <div class="truncate w-48" :title="props.data.name">
                                            <router-link :to="{name: 'event.show', params: {id: props.data.id}}" class="hover:text-primary-500">
                                                {{ props.data.name }}
                                            </router-link>
                                        </div>
                                    </template>
                                </Column>
                                
                                <Column field="location" header="Localização" />

                                <Column field="date" header="Data">
                                    <template #body="props">
                                        {{ dateFormater(props.data.date) }}
                                    </template>
                                </Column>
                                
                                <Column field="organizer.name" header="Organizador" />

                                <Column field="options" header="Opções">
                                    <template #body="props">
                                        <PDropdown>
                                            <PDropdownTrigger>
                                                <Button icon="fa fa-cog" text size="small" class="h-9" />
                                            </PDropdownTrigger>
                                            <PDropdownMenu menu-class="min-w-[100px]">
                                                <PDropdownItem>
                                                    <router-link :to="{name: 'event.show', params: {id: props.data.id}}">
                                                        <i class="fa fa-eye mr-2"></i> Visualizar
                                                    </router-link>
                                                </PDropdownItem>
                                                <PDropdownItem @click="handleViewEstatisticEvent(props.data)">
                                                    <router-link :to="{name: 'analise_relatorios.analitics.show', params: {id: props.data.id}}">
                                                        <i class="fa fa-chart-line mr-2"></i> Estatísticas
                                                    </router-link>
                                                </PDropdownItem>
                                            </PDropdownMenu>
                                        </PDropdown>
                                    </template>
                                </Column>
                            </DataTable>
                        </div>
                    </div>
                </template>
            </VueToPrintWrapper>
        </CardRoot>
    </div>
</template>

<style scoped>
.actions-button {
    @apply h-8
}
</style>