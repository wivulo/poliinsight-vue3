<script>
import RegistrationServices from '@/services/RegistrationServices.js';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import Dropdown from 'primevue/dropdown';
import dayjs from 'dayjs'

export default {
    name: "event.show.registrations.single",
    components: {
        DataTable, Column, Button, InputText, InputGroup, Dropdown
    },
    data(){
        return {
            busy: false,
            registrations: [],
            totalRecods: 0,
            filter: null,
        }
    },
    created(){
        this.getEventRegistrations();
    },
    methods: {
        async getEventRegistrations(){
            this.busy = true
            const response = await RegistrationServices.showByEvent(this.$route.params.id)
            .catch(() => this.$toast.add({severity: 'error', summary: 'Erro', detail: 'Erro ao buscar inscrições'}))
            this.registrations = response.data
            this.totalRecods = this.registrations.length
            this.busy = false
        },

        updateComponent(){
            this.getEventRegistrations()
        },

        dateFormater(date) {
            return dayjs(date).format('D MMMM, YYYY')
        }
    }
}

</script>

<template>
    <div class="flex">
        <DataTable :value="registrations" size="small" paginator :rows="5" :totalRecords="totalRecods"
            dataKey="id" class="ctable w-full" :loading="busy" lazy :rowsPerPageOptions="[5, 10, 20, 50]"
        >

            <Column field="participant.data" header="Nome" >
                <template #body="props">
                    <p>{{ props.data.participant.name }}</p>
                </template>
            </Column>

            <Column field="participant.email" header="Email" />

            <Column field="createdAt" header="Data da inscrição" >
                <template #body="props">
                    <p>{{ dateFormater(props.data.createdAt) }}</p>
                </template>
            </Column>

            <Column field="actions" header="Ações" class="relative">
                <template #body="props">
                    <Button severity="transparent" size="small" class="h-9">
                        <i class="fa fa-eye mr-1 text-sm" />
                    </Button>
                </template>
            </Column>

            <template #empty>
                <div class="flex items-center justify-center h-10">
                    <p class="text-gray-400">Nenhum dado disponível</p>
                </div>
            </template>
        </DataTable>
    </div>
</template>