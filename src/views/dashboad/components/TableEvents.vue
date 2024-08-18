<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import dayjs from 'dayjs'
import EventStatus from '@/components/EventStatus.vue';

export default {
    name: "Dashboard.overview.table",
    props: {
        events: {
            type: Array,
            required: true,
            default: () => []
        },
        busy: {
            type: Boolean,
            required: true
        },
    },
    components: {
        DataTable,
        Column, EventStatus
    },
    methods: {
        dateFormater(date) {
            return dayjs(date).format('DD/MM/YYYY')
        }
    },
}
</script>

<template>
    <DataTable :value="events" size="small" paginator :rows="7" :rowsPerPageOptions="[5, 10, 20, 50]"
        dataKey="id" scrollable scrollHeight="380px" :loading="busy" lazy
        class="w-full" tableClass="text-[0.94rem]"
    >                                        
        <Column field="name" header="Nome" />
        
        <Column field="localization" header="Localização" />

        <Column field="date" header="Data">
            <template #body="props">
                {{ dateFormater(props.data.date) }}
            </template>
        </Column>

        <Column field="type" header="Tipo de evento" >
            <template #body="props">
                {{ props.data.type?.name }}
            </template>
        </Column>

        <Column field="status" header="Estado" >
            <template #body="props">
               <EventStatus :status="props.data.status" />
            </template>
        </Column>
        
        <Column field="organizer.name" header="Organizador" />

        <template #empty>
            <div class="flex items-center justify-center h-10">
                <p class="text-gray-400">Nenhum dado disponível</p>
            </div>
        </template>
    </DataTable>
</template>