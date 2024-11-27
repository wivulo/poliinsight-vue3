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
import ReportEventOverviewPreview from "./components/ReportEventOverviewPreview.vue";
import ReportEventFinancialPreview from "./components/ReportEventFinancial.vue";
import Marquee from '@/components/Marquee/index.vue';
import MultiSelect from 'primevue/multiselect';
import message from '@/presets/lara/message';
import { iframeReportDocuemnt } from './utils/iframeReportDocuemnt';
import BaseGrayButton from '@/layouts/components/BaseGrayButton.vue';

export default {
    name: "statistic_repots.reports",
    mixins: [setDocumentTitleMixin],
    components: {
        Button, CardRoot: CCard.Root, Marquee, MultiSelect,
        InputText, InputGroup, Dropdown, TableReports,
        ReportEventOverviewPreview, ReportEventFinancialPreview,
        BaseGrayButton

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
                eventId: null,
                data: null,
            },
            filter: null,
            reportTypes: {
                data: [
                    { label: 'Relatório Geral do evento', value: 'general' },
                    { label: 'Relatório Financeiro', value: 'financial' },
                    { label: 'Relatório dos Participantes', value: 'participants' },
                ],
                selected: null,
            },
            tables: {
                data: [
                    { name: 'Inscrições', value: 'registrations', reportsPermitedType: ['general', 'participants'] },
                    { name: 'Investimentos', value: 'investiments', reportsPermitedType: ['general', 'financial'] },
                    { name: 'Despesas', value: 'expenses', reportsPermitedType: ['general', 'financial'] },
                    { name: 'Receitas', value: 'incomes', reportsPermitedType: ['general', 'financial'] },
                    { name: 'Ingressos', value: 'tickets', reportsPermitedType: ['general', 'participants', 'financial'] },
                ],
                selected: null
            },

            report: {
                data: {
                    eventId: null,
                    type: null,
                    filters: {},    
                    tables: []
                },
                busy: false,
                generated: false,
                format: null,
            }
        }
    },
    created(){
        this.getEvents();
    },
    computed: {
        ...mapGetters({
            user: 'auth/user'
        }),
        filteredTables(){
            return this.tables.data.filter(table => table.reportsPermitedType.includes(this.report.data.type))
        }
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

        async handlePreviewGenerate(){
            try {
                this.report.busy = true;
                this.report.data.tables = this.tables.selected.map(table => table.value);
                const response = await ReportsServices.generate(this.report.data)

                if(response?.status == 201 && !response?.data.error){
                    this.$toast.add({severity:'success', summary: 'Success', detail: 'Pré visualização do Relatório gerado com sucesso', life: 3000});
                    this.report.generated = response.data;
                    return;
                }

                this.handleErrorMessage();
            } catch (error) {
                this.handleErrorMessage(message)
            } finally {
                this.report.busy = false
            }
        },

        async exportToPDF() {
            try {
                const modalContent = document.getElementById('report-content');

                if (!modalContent) {
                    this.handleErrorMessage();
                    return;
                }
                
                let iframe = document.createElement('iframe')
                document.body.appendChild(iframe)

                iframe.contentDocument.open()
                iframe.contentDocument.write(iframeReportDocuemnt(modalContent.innerHTML));
                iframe.contentDocument.close()

                setTimeout(() => {
                    iframe.contentWindow.focus();
                    iframe.contentWindow.print();
                    iframe.remove();
                }, 900);
            
            } catch (error) {
                console.error('Erro ao gerar PDF:', error);
            }
        },

        handleCleanGeneratedReport(){
            this.report.generated = null;
            this.report.data = {
                eventId: this.report.data.eventId,
                type: null,
                filters: {},    
                tables: []
            }
            this.tables.selected = []
        },

        handleErrorMessage(message = 'Erro ao gerar o relatório'){
            this.$toast.add({severity:'error', summary: 'Error', detail: message, life: 3000});
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
        <div class="mt-4 flex gap-5">
           <div class="grow flex flex-col gap-5">
                <CardRoot class="w-full">
                    <div class="flex flex-col mb-5">
                        <p class="text-base font-semibold">Relatórios</p>
                        <p class="text-sm">Gestão de relatórios dos o evento</p>
                    </div>
                    
                    <hr />

                    <ul class="flex gap-5 items-end mt-5 text-sm">
                        <li class="flex flex-col justify-center gap-1">
                            <label for="events">
                                <i class="fa mr-1" /> Evento
                            </label>

                            <Dropdown
                                id="events"
                                v-model="report.data.eventId"
                                :options="events.data" 
                                class="p-0 py-1 h-10 w-56 max-h-64"
                                optionLabel="name"
                                optionValue="id"
                            >
                                <template #value="props">
                                    <div v-if="props.value" class="flex align-items-center text-sm">
                                        <div class="text-slate-800">{{ events.data.find(event => event.id === props.value).name }}</div>
                                    </div>
                                    <div v-else class="flex justify-center items-center text-sm">
                                        Selecione um evento
                                    </div>
                                </template>

                                <template #option="{ option }">
                                    <div class="h-2 text-sm flex items-center text-zinc-700 py-2 w-full">
                                        {{ option.name }}
                                    </div>
                                </template>

                                <template #dropdownicon>
                                    <i class="fa fa-chevron-down text-black text-sm"/>
                                </template>
                            </Dropdown>
                        </li>
                        <li class="flex flex-col justify-center gap-1">
                            <label for="types">
                                Tipo de Relatório
                            </label>
                            <Dropdown
                                id="types"
                                v-model="report.data.type"
                                :options="reportTypes.data" 
                                class="p-0 py-1 h-10 w-56 max-h-64"
                                optionLabel="label"
                                optionValue="value"
                            >
                                <template #value="props">
                                    <div v-if="props.value" class="flex align-items-center text-sm">
                                        <div class="text-slate-800">
                                            {{ reportTypes.data.find(report => report.value === props.value).label }}
                                        </div>
                                    </div>
                                    <div v-else class="flex justify-center items-center text-sm">
                                        Selecione um tipo
                                    </div>
                                </template>

                                <template #option="{ option }">
                                    <div class="h-2 text-sm flex items-center text-zinc-700 py-2 w-full">
                                        {{ option.label }}
                                    </div>
                                </template>

                                <template #dropdownicon>
                                    <i class="fa fa-chevron-down text-black text-sm"/>
                                </template>
                            </Dropdown>
                            <!-- <Dropdown
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
                            </Dropdown> -->
                        </li>
                        <li class="flex flex-col justify-center gap-1">
                            <label for="tables">
                                Tabelas
                            </label>

                            <MultiSelect v-model="tables.selected" :options="filteredTables" optionLabel="name" placeholder="Selecione as tabelas que constaram no relatório"  
                                class="h-10 w-96" display="chip"
                            />
                        </li>

                        <li>
                            <Button @click="handlePreviewGenerate" size="small" class="h-10" :loading="report.busy" v-if="!report.generated">
                                <i class="fas fa-spinner animate-spin mr-1" v-if="report.busy" />
                                <i class="fa fa-filter mr-1"/> {{ report.busy ? 'Gerando...' : 'Gerar relatório' }}
                            </Button>

                            <div v-else class="flex gap-3">
                                <Dropdown
                                    v-model="report.format"
                                    :options="[
                                        {
                                            label: 'PDF',
                                            icon: 'fa fa-file-pdf',
                                        },
                                    ]" 
                                    class="h-10 p-0 bg-primary-500"
                                    :loading="report.busy"
                                    option-label="label"
                                    option-value="label"
                                    inputClass="flex items-center"
                                >
                                    <template #value>
                                        <div class="flex items-center text-white">
                                            <i class="fas fa-spinner animate-spin mr-1" v-if="report.busy" />
                                            <i class="fa fa-download mr-1"/> Exportar
                                        </div>
                                    </template>

                                    <template #option="{ option }">
                                        <div class="h-2 text-sm flex items-center text-zinc-700 py-2 w-full" @click="exportToPDF">
                                            <i class="fas fa-spinner animate-spin mr-1" v-if="report.busy" />
                                            <p v-else>
                                                <i :class="option.icon" class="mr-1" /> {{ option.label }}
                                            </p>
                                        </div>
                                    </template>

                                    <template #dropdownicon>
                                        <i class="fa fa-chevron-down text-white"/>
                                    </template>
                                </Dropdown>

                                <BaseGrayButton
                                    :rounded="false" 
                                    @click="handleCleanGeneratedReport"
                                    size="small" class="w-9 h-10 rounded-full"
                                    title="Limpar relatório gerado" v-if="report.generated"
                                >
                                    <i class="fa fa-broom mr-1 text-black"/>
                                </BaseGrayButton>
                            </div>
                        </li>
                    </ul>

                    <div class="flex flex-col max-w-[1060px]">
                        <template v-if="report.generated">
                            <template v-if="report.generated && report.data.type === 'general'">
                                <ReportEventOverviewPreview
                                    ref="reportPreview"
                                    id="report-content"
                                    :event="report.generated.event"
                                    :statistic="report.generated.statistic"
                                    :tickets="report.generated.tickets"
                                    :registrations="report.generated.registrations"
                                    :incomes="report.generated.incomes"
                                    :expenses="report.generated.expenses"
                                    :investiments="report.generated.investiments"
                                />
                            </template>

                            <template v-else-if="report.generated && report.data.type === 'financial'">
                                <ReportEventFinancialPreview
                                    ref="reportPreview"
                                    id="report-content"
                                    :event="report.generated.event"
                                    :statistic="report.generated.statistic"
                                    :incomes="report.generated.incomes"
                                    :expenses="report.generated.expenses"
                                    :investiments="report.generated.investiments"
                                />
                            </template>
                        </template>

                        <template v-else>
                            <div class="flex justify-center items-center py-10">
                                <p class="text-slate-600 text-sm">A preview do relatório será apresentada aqui</p>
                            </div>
                        </template>
                    </div>
                </CardRoot>

                <!-- <CardRoot class="w-full">
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
                </CardRoot> -->
           </div>

            <CardRoot class="flex-none w-80 hidden">
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

                    <div v-else class="flex flex-col gap-3">
                        <div v-for="eventi in events.data" :key="eventi.id" class="h-16 flex justify-between border-l-4 items-center bg-gray-400/30 hover:bg-gray-400/40 p-2 rounded-md cursor-pointer relative overflow-hidden"
                            @click="handleSelectEvent(eventi)"
                            :class="{'bg-gray-400/50 border-primary-500': $route.query.eventId == eventi.id}"
                        >
                            <div v-if="event.busy" class="absolute top-0 left-0 w-full h-[65px] flex items-center justify-center bg-gray-400/10 z-20 rounded-md">
                                <div class="flex justify-center items-center">
                                    <i class="fa fa-spinner animate-spin text-black"></i>
                                </div>
                            </div>

                            <div class="flex items-center gap-3 z-10">
                                <div class="image-container">
                                    <img :src="eventi.imageURL" :alt="eventi.name" class="image" />
                                </div>
                                <div class="overflow-hidden">
                                    <Marquee class="text-slate-600 text-sm whitespace-nowrap">
                                        {{ eventi.name }}
                                    </Marquee>
                                    <p class="text-slate-400 text-xs truncate w-[210px]">{{ eventi.description }}</p>
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
.image-container {
  width: 50px;
  height: 50px;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
  flex-shrink: 0;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}
</style>