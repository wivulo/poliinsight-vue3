<script>
import TicketsService from '@/services/TicketsService.js';
import { mapGetters } from 'vuex';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import Dropdown from 'primevue/dropdown';

export default {
    name: "event.show.tickets",
    components: {
        DataTable, Column, Button, InputText, InputGroup, Dropdown
    },
    data(){
        return {
            busy: false,
            tickets: [],
            totalRecods: 0,
            filter: null,
        }
    },
    created(){
        this.getEventtickets();
    },
    methods: {
        async getEventtickets(){
            this.busy = true
            console.log(this.$route.params.id)
            const response = await TicketsService.getByEventId(this.$route.params.id)
            .catch(error => {
                this.$toast.add({severity:'error', summary:'Erro', detail: 'Erro ao buscar os tickets', life: 3000});
            });
            this.tickets = response.data;
            this.totalRecods = 1
            this.busy = false
        },

        getData(){
            this.getEventtickets()
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

        <DataTable :value="tickets" size="small" paginator :rows="5" :totalRecords="totalRecods"
            dataKey="id" class="ctable" :loading="busy" lazy :rowsPerPageOptions="[5, 10, 20, 50]"
        >

            <Column field="name" header="Nome" />

            <Column field="price" header="Preço">
                <template #body="props">
                    <span>{{ props.data.price }} ,00 KZ</span>
                </template>
            </Column>

            <Column field="quantity" header="Quantidade" />

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