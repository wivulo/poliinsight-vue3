<script>
import SpeakerServices from '@/services/SpeakerServices';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import Dropdown from 'primevue/dropdown';

export default {
    name: "event.show.speakers",
    components: {
        DataTable, Column, Button, InputText, InputGroup, Dropdown
    },
    data(){
        return {
            busy: false,
            speakers: [],
            totalRecods: 0,
            filter: null,
        }
    },
    created(){
        this.findEventspeakers();
    },
    methods: {
        async findEventspeakers(){
            try {
                this.busy = true
                const response = await SpeakerServices.showByEvent(this.$route.params.id)
                this.speakers = response.data;
                this.totalRecods = this.speakers.length ?? 0;
            } catch (error) {
                this.$toast.add({severity:'error', summary:'Erro', detail: 'Erro ao buscar os speakers', life: 3000});
            } finally {
                this.busy = false
            }
        },

        findData(){
            this.findEventspeakers()
        },
    }
}

</script>

<template>
    <div class="flex flex-col gap-3">
        <div class="flex">
            <InputGroup>
                <Button size="small" class="h-9 bg-transparent border border-surface-300 border-r-0">
                    <i class="fa fa-search text-black" />
                 </Button>
                <InputText size="small" v-model="filter" id="search" type="text" placeholder="Escreva para pesquisar..." class="w-full rounded-none h-9 border-l-0" />
            </InputGroup>
        </div>

        <DataTable :value="speakers" size="small" paginator :rows="5" :totalRecords="totalRecods"
            dataKey="id" class="ctable" :loading="busy" lazy :rowsPerPageOptions="[5, 10, 20, 50]"
        >

            <Column field="speaker.name" header="Nome" />

            <Column field="speaker.email" header="Email" />

            <Column field="speaker.phone" header="Telefone" />

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