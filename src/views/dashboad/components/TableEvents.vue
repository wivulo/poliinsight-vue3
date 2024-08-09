<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

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
        Column
    },
}
</script>

<template>
    <DataTable :value="events" size="small" paginator :rows="7"
        dataKey="id" scrollable scrollHeight="380px" :loading="busy" lazy
        class="w-full" tableClass="text-[0.94rem]"
    >                                        
        <Column field="name" header="Nome" />
                    
        <Column field="date" header="Data" />
            <!-- <template #body="props">
                {{ date_formatter(props.data.date) }}
            </template>
        </Column> -->
        
        <Column field="localization" header="Localização" />
        
        <Column field="organizer.name" header="Organizador" />
    </DataTable>
</template>