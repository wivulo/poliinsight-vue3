<script>
import SpeakerServices from '@/services/SpeakerServices';
import CCard from "@/components/PCard/index.js"
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import Dropdown from 'primevue/dropdown';
import ModalAdminDeleteSpeaker from "./ModalAdminDeleteSpeaker.vue";
import ModalEditSpeaker from './ModalEditSpeaker.vue';
import dayjs from 'dayjs'

export default {
    name: "event.speakers.table",
    components: {
        CardRoot: CCard.Root, ModalAdminDeleteSpeaker,
        DataTable, Column, Button, InputText, InputGroup, Dropdown,
        ModalEditSpeaker
    },
    data(){
        return {
            speakers: [],
            busy: false,
            totalRecods: 0,
            filter: null,
        }
    },
    created(){
        this.fetchSpeakers()
    },
    methods: {
        async fetchSpeakers(){
            try {
                this.busy = true
                const response = await SpeakerServices.index()

                if(response.status == 200){
                    this.speakers = response.data
                    return
                }

                this.handleErrorMessage()
            } catch (error) {
                console.error(error)
                this.handleErrorMessage(error)
            } finally {
                this.busy = false
            }
        },

        handleErrorMessage(message = 'Erro ao buscar os palestrantes'){
            this.$toast.add({severity:'error', summary: 'Error', detail: message, life: 3000});
        },

        dateFormater(date) {
            return dayjs(date).format('D MMMM, YYYY')
        },

        handleEditSpeaker(speaker){
            this.$refs.ModalEditSpeaker.show(speaker.id)
        },

        handleDeleteSpeaker(speaker){
            this.$refs.ModalDeleteSpeaker.show(speaker.id)
        },

    },
}
</script>

<template>
    <div class="flex flex-col mt-2">
        <ModalAdminDeleteSpeaker ref="ModalDeleteSpeaker" @deleted="fetchSpeakers" />
        <ModalEditSpeaker ref="ModalEditSpeaker" @updated="fetchSpeakers" />

        <div class="flex no-print">
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

            <Column field="name" header="Nome" />

            <Column field="email" header="Email" />

            <Column field="phone" header="Contacto" />

            <Column field="createdAt" header="Criado em">
                <template #body="props">
                    <p>{{ dateFormater(props.data.createdAt) }}</p>
                </template>
            </Column>

            <Column field="actions" header="Ações" class="relative no-print">
                <template #body="props">
                    <Dropdown 
                        :options="[
                            {
                                label: 'Editar',
                                icon: 'fa fa-pencil',
                                command: () => handleEditSpeaker(props.data)
                            },
                            {
                                label: 'Eliminar',
                                icon: 'fa fa-trash',
                                command: () => handleDeleteSpeaker(props.data)
                            },
                        ]" 
                        class="p-0 bg-primary-500"
                        icon
                        option-label="label"
                    >
                        <template #value>
                            <div class="flex justify-center items-center text-white">
                                <i class="fa fa-cog mr-1"/> Opções
                            </div>
                        </template>

                        <template #option="{ option }">
                            <div class="h-2 text-sm flex items-center text-zinc-700 py-2 w-full" @click="option.command">
                                <i :class="option.icon" class="mr-1" /> {{ option.label }}
                            </div>
                        </template>

                        <template #dropdownicon>
                            <i class="fa fa-chevron-down text-white"/>
                        </template>
                    </Dropdown>
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