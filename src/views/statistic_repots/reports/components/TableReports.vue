<script>
import ReportsServices from "@/services/ReportsServices.js"
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import InputNumber from 'primevue/inputnumber';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import dayjs from 'dayjs'
import { databaseURL } from "@/config";

export default {
    name: "Finance.Investments",
    components: {
        Button, InputText, InputGroup, InputNumber,
        DataTable, Column, Dropdown
    },
    data(){
        return {
            filter: null,
            reports: {
                busy: false,
                data: [],
                page: 1,
            },
            apiURL: databaseURL
        }
    },
    created(){
        this.fetchReports()
    },
    methods: {
        async fetchReports(){
            try {
                this.reports.busy = true;
                const response = await ReportsServices.showByEventId(this.$route.query.eventId);
                this.reports.data = response.data;
            } catch (error) {
                console.error(error);
            } finally {
                this.reports.busy = false;
            }
        },

        dateFormater(date) {
            return dayjs(date).format('D MMMM, YYYY')
        }
    },
    watch: {
        '$route.query.eventId': function(){
            this.fetchReports()
        }
    }
}
</script>

<template>
    <div class="w-full flex flex-col gap-5 py-5">
        <div class="flex flex-col gap-1">
            <DataTable :value="reports.data" size="small" paginator :rows="5" :totalRecords="reports.data.length"
                dataKey="id" class="ctable"
                :loading="reports.busy" lazy :rowsPerPageOptions="[5, 10, 20, 50]"
            >                        
                <Column field="name" header="Nome">
                    <template #body="props">
                        <p class="w-40 truncate" :title="props.data.name">{{ props.data.name }}</p>
                    </template>
                </Column>

                <Column field="type" header="Tipo" />

                <Column field="event.name" header="Evento" />

                <Column field="status.name" header="Estado" />

                <Column field="createdAt" header="Data de Criação">
                    <template #body="props">
                        {{ dateFormater(props.data.createdAt) }}
                    </template>
                </Column>

                <Column field="actions" header="Ações" class="relative">
                    <template #body="props">
                       <Button severity="transparent" text v-ripple size="small" class="h-9 border-0 hover:bg-gray-400 w-full p-ripple" title="Baixar relatório">
                            <a :href="apiURL+props.data.localFile" class="">
                                <i class="fa fa-download" />
                            </a>
                       </Button>
                    </template>
                </Column>

                <template #empty>
                    <div class="flex items-center justify-center h-10">
                        <p class="text-gray-400">Nenhuma informação disponível</p>
                    </div>
                </template>
            </DataTable>
        </div>
    </div>
</template>