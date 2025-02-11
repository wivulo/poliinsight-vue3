<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { useNotification } from '@/composables/useNotification';
import EventServices from '@/services/EventServices';
import ReportsServices from "@/services/ReportsServices.js";
import Button from 'primevue/button';
import CardRoot from '@/components/PCard/CardRoot.vue';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import Dropdown from 'primevue/dropdown';
import ReportEventOverviewPreview from "./components/ReportEventOverviewPreview.vue";
import ReportEventFinancialPreview from "./components/ReportEventFinancial.vue";
import Marquee from '@/components/Marquee/index.vue';
import MultiSelect from 'primevue/multiselect';
import { iframeReportDocuemnt } from './utils/iframeReportDocuemnt';
import BaseGrayButton from '@/layouts/components/BaseGrayButton.vue';
import ModalUploadTemplate from './components/ModalUploadTemplate.vue';
import PDropdown from '@/components/PDropdown/PDropdown.vue';
import PDropdownTrigger from '@/components/PDropdown/PDropdownTrigger.vue';
import PDropdownItem from '@/components/PDropdown/PDropdownItem.vue';
import PDropdownMenu from '@/components/PDropdown/PDropdownMenu.vue';

document.title = 'Relatórios | Poliinsight';

const store = useStore();
const route = useRoute();
const { notifyError, notifySuccess } = useNotification();

const modalUploadTemplate = ref(null);
const events = reactive({
    busy: false,
    data: []
});

const event = reactive({
    busy: false,
    eventId: null,
    data: null
});

const filter = ref(null);

const reportTypes = reactive({
    data: [
        { label: 'Relatório Geral do evento', value: 'general' },
        { label: 'Relatório Financeiro', value: 'financial' },
        { label: 'Relatório de Participação', value: 'participants' }
    ],
    selected: null
});

const tables = reactive({
    data: [
        { name: 'Inscrições', value: 'registrations', reportsPermitedType: ['general', 'participants'] },
        { name: 'Investimentos', value: 'investiments', reportsPermitedType: ['general', 'financial'] },
        { name: 'Despesas', value: 'expenses', reportsPermitedType: ['general', 'financial'] },
        { name: 'Receitas', value: 'incomes', reportsPermitedType: ['general', 'financial'] },
        { name: 'Ingressos', value: 'tickets', reportsPermitedType: ['general', 'participants', 'financial'] }
    ],
    selected: null
});

const report = reactive({
    data: {
        eventId: null,
        type: null,
        filters: {},    
        tables: []
    },
    busy: false,
    generated: false,
    format: null
});

const pdfPreview = ref(null);
const user = computed(() => store.getters['auth/user']);

const filteredTables = computed(() => 
    tables.data.filter(table => table.reportsPermitedType.includes(report.data.type))
);

const getEvents = async () => {
    events.busy = true;
    try {
        const response = await EventServices.fetchEventsOrganizer(user.value.id);
        if (response.status === 200) {
            events.data = response.data;
            return;
        }
        throw new Error();
    } catch {
        notifyError('Erro ao buscar os eventos');
    } finally {
        events.busy = false;
    }
};

const getEvent = async (eventId) => {
    try {
        event.busy = true;
        const response = await EventServices.show(eventId);
        event.data = response.data;
    } catch {
        notifyError('Erro ao buscar evento');
    } finally {
        event.busy = false;
    }
};

const validateReportData = () => {
    if (!report.data.eventId) {
        notifyError('Selecione um evento para continuar');
        return false;
    }

    if (!report.data.type) {
        notifyError('Selecione um tipo de relatório para continuar');
        return false;
    }

    if (!tables.selected) {
        notifyError('Selecione ao menos uma tabela para continuar');
        return false;
    }

    return true;
};

const handlePreviewGenerate = async () => {
    if (!validateReportData()) return;

    try {
        report.busy = true;
        report.data.tables = tables.selected?.map(table => table.value);
        const response = await ReportsServices.generate(report.data);

        if (response?.status == 201 && !response?.data.error) {
            notifySuccess('Pré visualização do Relatório gerado com sucesso');
            report.generated = response.data;
            return;
        }

        throw new Error();
    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        notifyError(error);
    } finally {
        report.busy = false;
    }
};

const handlePreviewGenerateWithTemplate = async () => {
    if (!validateReportData()) return;

    try {
        report.busy = true;
        report.data.tables = tables.selected?.map(table => table.value);
        const response = await ReportsServices.generateWithTemplate(report.data);

        if (response?.status == 201 && !response?.data.error) {
            notifySuccess('Pré visualização do Relatório gerado com sucesso');
            report.generated = response.data;
            pdfPreview.value = response.data.reportURL;
            return;
        }

        throw new Error();
    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        notifyError(error.response?.data?.error || 'Erro ao gerar o relatório');
    } finally {
        report.busy = false;
    }
};

const printToPDF = async () => {
    try {
        const modalContent = document.getElementById('report-content');

        if (!modalContent) {
            notifyError('Erro ao imprimir o PDF');
            return;
        }
        
        let iframe = document.createElement('iframe');
        document.body.appendChild(iframe);

        iframe.contentDocument.open();
        iframe.contentDocument.write(iframeReportDocuemnt(modalContent.innerHTML));
        iframe.contentDocument.close();

        setTimeout(() => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            iframe.remove();
        }, 900);
    
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        notifyError('Erro ao gerar o PDF');
    }
};

const downloadPDF = async () => {
    try {
        if (pdfPreview.value) {
            const response = await fetch(pdfPreview.value);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `relatorio_${report.data.type}_${Date.now()}.pdf`;
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
            return;
        }

        throw new Error();
    } catch (error) {
        console.error('Erro ao baixar o PDF:', error);
        notifyError(error.response?.data?.error || 'Erro ao baixar o PDF');
    }
};

const handleCleanGeneratedReport = () => {
    report.generated = null;
    report.data = {
        eventId: report.data.eventId,
        type: null,
        filters: {},    
        tables: []
    };
    tables.selected = [];
    pdfPreview.value = null;
};

const handleShowModalUploadTemplate = () => {
    modalUploadTemplate.value.show();
};

watch(
    () => route.query.eventId,
    (newEventId) => {
        if (newEventId) {
            getEvent(newEventId);
        }
    }
);

onMounted(() => {
    getEvents();
});
</script>

<template>
    <div class="w-full py-3 px-5">
        <ModalUploadTemplate ref="modalUploadTemplate" />

        <div class="mt-4 flex gap-5">
           <div class="grow flex flex-col gap-5">
                <CardRoot class="w-full">
                    <div class="flex justify-between mb-3">
                        <div class="flex flex-col">
                            <p class="text-base font-semibold">Relatórios</p>
                            <p class="text-sm">Gestão de relatórios dos o evento</p>
                        </div>

                        <div class="flex items-end">
                            <Button @click="handleShowModalUploadTemplate" severity="secondary" size="small" class="h-8">
                                <i class="pi pi-cloud-upload mr-1"/> Template
                            </Button>
                        </div>
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
                                    <div v-else class="flex items-center text-sm">
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
                                    <div v-else class="flex items-center text-sm">
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
                            <!-- <Button @click="handlePreviewGenerate" size="small" class="h-10" :loading="report.busy" v-if="!report.generated">
                                <i class="fas fa-spinner animate-spin mr-1" v-if="report.busy" />
                                <i class="fa fa-filter mr-1"/> {{ report.busy ? 'Gerando...' : 'Gerar relatório' }}
                            </Button> -->

                            <PDropdown v-if="!report.generated">
                                <PDropdownTrigger>
                                    <Button size="small" class="h-10">
                                        <i class="fas fa-spinner animate-spin mr-1" v-if="report.busy" />
                                        <i class="fa fa-filter mr-1"/> {{ report.busy ? 'Gerando...' : 'Gerar' }}
                                    </Button>
                                </PDropdownTrigger>

                                <PDropdownMenu>
                                    <PDropdownItem @click="handlePreviewGenerate" class="h-10">
                                        <i class="fas fa-spinner animate-spin mr-1" v-if="report.busy" />
                                        Normal
                                    </PDropdownItem>

                                    <PDropdownItem @click="handlePreviewGenerateWithTemplate" class="h-10">
                                        <i class="fas fa-spinner animate-spin mr-1" v-if="report.busy" />
                                        Com template
                                    </PDropdownItem>
                                </PDropdownMenu>
                            </PDropdown>

                            <div v-else class="flex gap-3">
                                <Dropdown
                                    v-model="report.format"
                                    :options="[{
                                        label: 'Baixar PDF',
                                        icon: 'fa fa-file-pdf',
                                        commad: () => downloadPDF(),
                                        available: pdfPreview ? true : false
                                    },
                                    {
                                        label: 'Imprimir',
                                        icon: 'fa fa-print',
                                        commad: () => printToPDF(),
                                        available: report.generated || pdfPreview ? true : false
                                    }]" 
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
                                        <div class="h-2 text-sm flex items-center text-zinc-700 py-2 w-full" 
                                            @click="() => option.available && option.commad()" 
                                            :class="{'cursor-not-allowed': !option.available}"
                                        >
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

                    <div id="report_container" v-if="pdfPreview" class="flex justify-center items-center mt-5">
                        <iframe
                            :src="`https://docs.google.com/gview?url=${pdfPreview}&embedded=true`"
                            width="100%"
                            height="500px"
                            frameborder="0">
                        </iframe>
                    </div>

                    <div ref="report_preview_container" class="flex flex-col max-w-[1060px]">
                        <template v-if="report.generated">
                            <template v-if="report.generated && report.data.type === 'general'">
                                <ReportEventOverviewPreview
                                    ref="reportPreview"
                                    id="report-content"
                                    :event="report.generated"
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
                                    :event="report.generated"
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