<script>
import RegistrationServices from '@/services/RegistrationServices.js';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import Dropdown from 'primevue/dropdown';
import dayjs from 'dayjs'
import { debounce } from 'lodash'

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
            search: '',
            params: {
                take: 8,
                skip: 1,
                where: {
                    OR: [
                            {
                                participant: {
                                    name: {
                                        contains: ''
                                    }
                                }
                            },
                            {
                                user: {
                                    name: {
                                        contains: ''
                                    }
                                }
                            }
                    ]
                }
            }
        }
    },
    created(){
        this.getEventRegistrations();
    },
    methods: {
        getEventRegistrations: debounce(async function() {
            this.busy = true
            const response = await RegistrationServices.showByEvent(this.$route.params.id, this.params)
            .catch(() => this.$toast.add({severity: 'error', summary: 'Erro', detail: 'Erro ao buscar inscrições'}))
            if(response.status === 200){
                this.registrations = response.data.data
                this.totalRecods = response.data.total
                this.busy = false
                return
            }
        }),

        updateComponent(){
            this.getEventRegistrations()
        },

        dateFormater(date) {
            return dayjs(date).format('D MMMM [de] YYYY')
        },

        onPageChange (event) {
            this.params.skip = event.page + 1
            this.params.take = event.rows
        }
    },
    watch: {
        search(newSearch) {
            this.params.where.OR[0].participant.name.contains = newSearch;
            this.params.where.OR[1].user.name.contains = newSearch;
        },
        params: {
            handler: 'getEventRegistrations',
            deep: true
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
                <InputText size="small" v-model="search" id="search" type="text" placeholder="Escreva para pesquisar..." class="w-full rounded-none h-9 border-l-0" />
            </InputGroup>
        </div>

        <DataTable :value="registrations" size="small" paginator :rows="params.take" :totalRecords="totalRecods"
            dataKey="id" class="ctable w-full" :loading="busy" lazy :rowsPerPageOptions="[8, 10, 20, 50]"
            @page="onPageChange"
            v-model:rows="params.take"
            v-model:page="params.skip"
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
                    <p class="text-gray-400">Nenhuma informação disponível</p>
                </div>
            </template>
        </DataTable>
    </div>
</template>