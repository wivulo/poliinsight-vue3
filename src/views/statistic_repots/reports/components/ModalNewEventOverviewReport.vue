<script>
import ReportsServices from "@/services/ReportsServices.js"
import EventServices from '@/services/EventServices';
import { mapGetters } from 'vuex';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import ReportEventOverviewPreview from "./ReportEventOverviewPreview.vue";


async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Erro ao obter o IP do usuário:', error);
        return null;
    }
}

export default {
    setup() {
        return {
            v$: useVuelidate(),
        };
  },
    name: "ModalNewEventReport",
    components: {
        Dialog, ProgressSpinner, Button, ReportEventOverviewPreview,
        InputText, InputNumber, Dropdown, MultiSelect,
    },
    data(){
        return {
            visible: false,
            busy: false,
            report: {
                eventId: null,
                type: 'Relatório Geral do evento',
                filters: {},    
                tables: []
            },

            export_report: {
                report: null,
                type: 'Relatório Geral do evento',
                operatorId: null,
                format: null,
                eventId: this.$route.query.eventId,
                filters: null,
            },

            events: {
                busy: false,
                data: [],
                selected: null,
            },
            generated_report: null,

            tables: {
                data: [
                    { name: 'Inscrições', value: 'registrations' },
                    { name: 'Investimentos', value: 'investiments' },
                    { name: 'Despesas', value: 'expenses' },
                    { name: 'Receitas', value: 'incomes' },
                    { name: 'Ingressos', value: 'tickets' },
                ],
                selected: [
                    { name: 'Inscrições', value: 'registrations' },
                    { name: 'Investimentos', value: 'investiments' },
                    { name: 'Despesas', value: 'expenses' },
                    { name: 'Receitas', value: 'incomes' },
                    { name: 'Ingressos', value: 'tickets' },
                ]
            },

            waitAlittle: `eventId: report.eventId,
                //     type: report.type,
                //     localFile: generated_data.filePath,
                //     audit: {
                //         dataAcesso: new Date(Date.now()).toLocaleDateString(),
                //         user: {
                //             id: generated_data.operator.id,
                //             nome: generated_data.operator.name,
                //             email: generated_data.operator.email,
                //         },
                //         userIP: req.ip ? req.ip : null,
                //     },
                //     format: generated_data.format,
                //     name: generated_data.name,
                //     operatorId: report.operatorId,
                //     statusId: generated_data.statusId,
                //     filters: report?.filters,`
        }
    },
    validations () {
        return {
            report: {
                name: { required },
                eventId: { required },
                type: { required },
                operatorId: { required },
                format: { required }
            }
        }
    },
    // async created(){
    //     this.export_report.audit.userIP = await getUserIP();
    // },
    computed: {
        ...mapGetters({
            user: 'auth/user',
        }),
    },
    methods : {
        async show(eventId){
            this.visible = true;
            this.report.eventId = eventId
        },

        async handlePreviewGenerate(){
            this.busy = true;
            this.report.tables = this.tables.selected.map(table => table.value);
            const response = await ReportsServices.generate(this.report)
            .catch(() => this.handleErrorMessage())

            this.busy = false

            if(response.status == 201 && !response.data.error){
                this.$toast.add({severity:'success', summary: 'Success', detail: 'Pré visualização do Relatório gerado com sucesso', life: 3000});
                this.generated_report = response.data;
                return;
            }else{
                this.handleErrorMessage();
            }

            this.handleErrorMessage();
        },

        async handleExportReport(format){
            try {
                this.busy = true;
                this.export_report.operatorId = this.user.id;
                this.export_report.report = this.generated_report;
                this.export_report.format = format;

                const response = await ReportsServices.export(this.export_report)
                .catch(() => this.handleErrorMessage())

                if(response.status == 201 && !response.data.error){
                    const response2 = await ReportsServices.getReportFile(response.data.downloadURL)
                    const link= window.document.createElement('a');
                    link.href = window.URL.createObjectURL(response2.data);
                    link.download = response.data.name;
                    link.click();
                    window.URL.revokeObjectURL(link.href);

                    this.$toast.add({severity:'success', summary: 'Success', detail: 'Relatório exportado com sucesso', life: 3000});
                    this.$emit('created');
                    this.reset();
                    this.handlehidden();
                    return;
                }else{
                    this.handleErrorMessage();
                }

                this.handleErrorMessage();
            } finally {
                this.busy = false
            }
        },

        handleCleanGeneratedReport(){
            this.generated_report = null;
        },

        handleErrorMessage(){
            this.$toast.add({severity:'error', summary: 'Error', detail: 'Erro ao gerar o relatório', life: 3000});
        },

        reset(){
            this.report = {
                eventId: null,
                type: 'Relatório Geral do evento',
                operatorId: null,
                filters: {},    
                format: null
            }

        },

        handlehidden(){
            this.visible = false;
        },

        handleCancel(){
            this.handlehidden()
            this.reset()
        },
    }
}
</script>

<template>
    <Dialog v-model:visible="visible" modal header="Relatório Geral do evento" :style="{ width: '50rem' }">
        <div class="flex gap-5 items-center">
            <div class="flex flex-col my-2 w-[30%]">
                <label for="name">Tipo de relatório</label>
                <InputText id="type" v-model="report.type" placeholder="Selecione um tipo de relatório" class="w-full h-10" disabled/>
            </div>

            <div class="flex flex-col w-[68%]">
                <label for="column">
                    Tabelas
                </label>
                <MultiSelect v-model="tables.selected" :options="tables.data" optionLabel="name" placeholder="Seleciona as tabelas a ver"  
                    class="h-10 w-full" display="chip"
                />
            </div>
        </div>

        <div class="flex flex-col mt-4 w-full">
            <div v-if="!generated_report" class="w-full h-32 flex justify-center items-center">
                <p>A prévia do relatório será visualizada aqui.</p>
            </div>

            <div v-else class="w-full h-full flex flex-col">
                <ReportEventOverviewPreview
                    ref="reportPreview"
                    :event="generated_report.event"
                    :statistic="generated_report.statistic"
                    :finances="generated_report.finances"
                    :tickets="generated_report.tickets"
                />
            </div>
        </div>

        <template #footer>
            <div class="flex gap-3 justify-end">
                <Button severity="secondary" text @click="handleCancel" size="small" class="h-9">
                    <i class="fa fa-times mr-1"/> Cancelar
                </Button>

                <Button @click="handlePreviewGenerate" size="small" class="h-9" :loading="busy" v-if="!generated_report">
                    <i class="fas fa-spinner animate-spin mr-1" v-if="busy" />
                    <i class="fa fa-save mr-1"/> {{ busy ? 'Gerando...' : 'Gerar relatório' }}
                </Button>

                <div v-else class="flex gap-3">
                    <Button severity="secondary" text @click="handleCleanGeneratedReport" size="small" class="h-9" :loading="busy">
                        <i class="fa fa-broom mr-1"/> Limpar
                    </Button>

                    <Dropdown
                        v-model="export_report.format"
                        :options="[
                            {
                                label: 'PDF',
                                icon: 'fa fa-file-pdf',
                            },
                        ]" 
                        class="p-0 bg-primary-500"
                        :loading="busy"
                        option-label="label"
                        option-value="label"
                    >
                        <template #value>
                            <div class="flex justify-center items-center text-white">
                                <i class="fas fa-spinner animate-spin mr-1" v-if="busy" />
                                <i class="fa fa-download mr-1"/> Exportar
                            </div>
                        </template>

                        <template #option="{ option }">
                            <div class="h-2 text-sm flex items-center text-zinc-700 py-2 w-full" @click="handleExportReport(option.label)">
                                <i class="fas fa-spinner animate-spin mr-1" v-if="busy" />
                                <p v-else>
                                    <i :class="option.icon" class="mr-1" /> {{ option.label }}
                                </p>
                            </div>
                        </template>

                        <template #dropdownicon>
                            <i class="fa fa-chevron-down text-white"/>
                        </template>
                    </Dropdown>
                </div>
            </div>
        </template>
    </Dialog>
</template>