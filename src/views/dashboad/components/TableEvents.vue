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
            required: true,
            default: false
        },
    },
    components: {
        DataTable,
        Column, EventStatus
    },
    methods: {
        dateFormater(date) {
            return dayjs(date).format('D MMMM, YYYY')
        }
    },
}
</script>

<template>
    <DataTable :value="events" size="small" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" :totalRecords="events.length"
        dataKey="id" scrollable scrollHeight="380px" :loading="busy" lazy
        class="w-full" tableClass="text-[0.94rem]" stripedRows
    >                                        
        <Column field="name" header="Nome" />
        
        <Column field="location" header="Localização" />

        <Column field="startDate" header="Data">
            <template #body="props">
                {{ dateFormater(props.data.startDate) }}
            </template>
        </Column>

        <Column field="category" header="Tipo de evento" >
            <template #body="props">
                {{ props.data.category?.name }}
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
                <p class="text-gray-400">Nenhuma informação disponível</p>
            </div>
        </template>
    </DataTable>
</template>