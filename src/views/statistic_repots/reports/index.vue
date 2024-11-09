<script>
import EventServices from '@/services/EventServices';
import ReportsServices from "@/services/ReportsServices.js"
import { setDocumentTitleMixin } from "@/config/document.title.js"
import { mapGetters } from 'vuex';
import Button from 'primevue/button';
import CCard from "@/components/PCard/index.js"
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import Dropdown from 'primevue/dropdown';
import TableReports from './components/TableReports.vue';
import ModalNewEventOverviewReport from './components/ModalNewEventOverviewReport.vue';
import ModalNewEventFinancialreport from './components/ModalNewEventFinancialreport.vue';
import { EventImpl } from '@fullcalendar/core/internal';
export default {
    name: "statistic_repots.reports",
    mixins: [setDocumentTitleMixin],
    components: {
        Button, CardRoot: CCard.Root,
        InputText, InputGroup, Dropdown, TableReports,
        ModalNewEventOverviewReport, ModalNewEventFinancialreport,
    },
    data(){
        return {
            title: 'Poliinsight | Relatórios',
            events: {
                busy: false,
                data: [],
            },
            event: {
                busy: false,
                data: null,
            },
            filter: null,
        }
    },
    created(){
        this.getEvents();

        if(this.$route.query.eventId){
            this.getEvent(this.$route.query.eventId)
        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/user'
        }),
    },
    methods: {
        async getEvents(){
            this.events.busy = true
            const response = await EventServices.fetchEventsOrganizer(this.user.id)
            .catch(() => this.$toast.add({severity:'error', summary: 'Error', detail: 'Erro ao buscar os eventos', life: 3000}))
            .finally(() => this.events.busy = false )

            if(response.status == 200){
                this.events.data = response.data
                return
            }

            this.$toast.add({severity:'error', summary: 'Error', detail: 'Erro ao buscar os eventos', life: 3000})
        },

        async getEvent(eventId){
            try {
                this.event.busy = true
                const responde = await EventServices.show(eventId)
                .catch(() => this.$toast.add({severity: 'error', summary: 'Erro', detail: 'Erro ao buscar evento'}))
                this.event.data = responde.data
            }finally{
                this.event.busy = false
            }
        },

        async handleSelectEvent(event){
            // this.events.selectected = event
            await this.getEvent(event.id)
            this.$router.push({query: {eventId: event.id}})
        },

        handleShowModalNewEventOverviewReport(){
            this.$refs.ModalNewEventOverviewReport.show(this.$route.query.eventId)
        },

        handleShowModalNewEventFinancialreport(){
            this.$refs.ModalNewEventFinancialreport.show(this.$route.query.eventId)
        },

        handleFetchReports(){
            this.$refs.TableReports.fetchReports()
        },
    },
    watch: {
        $route(to, from){
            if(to.query.eventId){
                this.getEvent(to.query.eventId)
            }
        }
    }
}
</script>

<template>
    <div class="w-full py-3 px-5">
        <ModalNewEventOverviewReport ref="ModalNewEventOverviewReport" @created="handleFetchReports"/>
        <ModalNewEventFinancialreport ref="ModalNewEventFinancialreport" @created="handleFetchReports" />

        <div class="mt-4 flex gap-5">
           <div class="grow flex flex-col gap-5">
                <CardRoot class="w-full">
                    <ul class="flex gap-5 items-center">
                        <li class="text-sm">
                            <Button severity="transparent" text v-ripple size="small" class="h-9 border-0 hover:bg-gray-400 w-full p-ripple" :disabled="!event.data" @click="handleShowModalNewEventOverviewReport">
                                <span class="text-black">
                                    <i class="fa fa-filter" />
                                    Relatório Geral do evento
                                </span>
                            </Button>
                        </li>
                        <li>
                            <Dropdown
                                :disabled="!event.data" 
                                :options="[
                                    {
                                        label: 'Financeiro',
                                        command: handleShowModalNewEventFinancialreport
                                    },
                                    {
                                        label: 'Participantes',
                                        // command: () => handleDeleteTicket(props.data)
                                    },
                                ]" 
                                class="p-0 py-1 border-0 hover:bg-gray-400/30 "
                                option-label="label"
                            >
                                <template #value="slotProps">
                                    <div v-if="slotProps.value" class="flex align-items-center text-sm">
                                        <div>{{ slotProps.value.label }}</div>
                                    </div>
                                    <div v-else class="flex justify-center items-center text-black text-sm">
                                        <i class="fa fa-filter" /> Outros Relatórios
                                    </div>
                                </template>

                                <template #option="{ option }">
                                    <div class="h-2 text-sm flex items-center text-zinc-700 py-2 w-full" @click="option.command">
                                        {{ option.label }}
                                    </div>
                                </template>

                                <template #dropdownicon>
                                    <i class="fa fa-chevron-down text-black text-sm"/>
                                </template>
                            </Dropdown>
                        </li>
                    </ul>
                </CardRoot>

                <CardRoot class="w-full">
                    <div class="flex flex-col mb-5">
                        <p class="text-base font-semibold">Relatórios</p>
                        <p class="text-sm">Gestão dos relatórios sobre o evento aqui</p>
                    </div>

                    <template v-if="event.data">
                        <TableReports ref="TableReports" />
                    </template>

                    <template v-else>
                        <div class="flex justify-center items-center py-10">
                            <p class="text-slate-600 text-sm">Selecione um evento para continuar</p>
                        </div>
                    </template>
                </CardRoot>
           </div>

            <CardRoot class="flex-none w-80">
                <div class="flex mb-2">
                    <InputGroup>
                        <Button size="small" class="h-9 bg-transparent border border-surface-300 border-r-0">
                            <i class="fa fa-search text-black" />
                        </Button>

                        <InputText size="small" v-model="filter" id="search" type="text" placeholder="Escreva para pesquisar..." class="w-full rounded-none h-9 border-l-0" />
                    </InputGroup>
                </div>

                <hr />

                <div class="flex flex-col gap-5 mt-3">

                    <div v-if="events.busy" class="py-4">
                        <div class="flex justify-center items-center">
                            <i class="fa fa-spinner animate-spin text-black"></i>
                        </div>
                    </div>

                    <div v-else-if="!events.data.length" class="py-4">
                        <div class="flex justify-center items-center">
                            <p class="text-slate-600 text-sm">Nenhum evento encontrado</p>
                        </div>
                    </div>

                    <div v-else>
                        <div v-for="eventi in events.data" :key="eventi.id" class="flex justify-between border-l-4 items-center bg-gray-400/30 hover:bg-gray-400/40 p-2 rounded-md cursor-pointer relative"
                            @click="handleSelectEvent(eventi)"
                            :class="{'bg-gray-400/50 border-primary-500': $route.query.eventId == eventi.id}"
                        >
                            <div v-if="event.busy" class="absolute top-0 left-0 w-full h-[65px] flex items-center justify-center bg-gray-400/10 z-20 rounded-md">
                                <div class="flex justify-center items-center">
                                    <i class="fa fa-spinner animate-spin text-black"></i>
                                </div>
                            </div>

                            <div class="flex items-center gap-3 z-10">
                                <div class="w-[3.7rem] h-12 rounded-full overflow-hidden">
                                    <img :src="eventi.imageURL" :alt="eventi.name" class="object-fill w-full h-full" />
                                </div>
                                <div>
                                    <p class="text-slate-600 text-sm">{{ eventi.name }}</p>
                                    <p class="text-slate-400 text-xs">{{ eventi.description }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardRoot>
        </div>
    </div>
</template>

<style>
    
</style>