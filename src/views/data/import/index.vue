<script>
import ImportServices from '@/services/ImportServices.js';
import { setDocumentTitleMixin } from "@/config/document.title.js"
import { mapGetters } from 'vuex';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import SplitButton from 'primevue/splitbutton';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import InputNumber from 'primevue/inputnumber';
import CCard from "@/components/PCard/index.js"
import Dropdown from 'primevue/dropdown';
import ModalNewParticipantImport from './components/ModalNewParticipantImport.vue'
import ModalImportFinancialData from './components/ModalImportFinancialData.vue';

export default {
    name: "data.import",
    mixins: [setDocumentTitleMixin],
    components: {
        DataTable, Column, SplitButton, Button, InputText, InputGroup,
        InputNumber, CardRoot: CCard.Root, Dropdown, ModalNewParticipantImport,
        ModalImportFinancialData,
    },
    data(){
        return {
            title: 'Poliinsight | Importar dados',
            busy: false,
            imports: [],
            filter: null,
            totalRecords: 0
        }
    },
    created(){
        this.getImports();
    },
    computed: {
        ...mapGetters({
            user: 'auth/user',
        }),
    },
    methods: {
        async getImports(){
            this.busy = true;
            const response = await ImportServices.getByOperator(this.user.id)
            .catch(error => {
                this.$toast.add({severity:'error', summary:'Erro', detail: 'Erro ao buscar os tickets', life: 3000});
                this.busy = false
            });
            this.imports = response.data;
            this.totalRecords = this.imports.length
            this.busy = false;
        },

        handleShowModalModalNewParticipantImport(){
            this.$refs.ModalNewParticipantImport.show()
        },

        handleShowModalImportFinancialData(){
            this.$refs.ModalImportFinancialData.show()
        },
    }
}
</script>

<template>
    <div class="w-full py-3 px-5">
        <ModalNewParticipantImport ref="ModalNewParticipantImport" @created="getImports"/>

        <ModalImportFinancialData ref="ModalImportFinancialData" @created="getImports"/>

        <CardRoot class="mt-4">
            <div class="flex gap-2 justify-between my-2">
                <div>
                    <h1 class="text-base font-semibold">Importações</h1>
                    <p class="text-sm">Lista de Importações de dados</p>
                </div>

                <div>
                    <Dropdown 
                            :options="[
                                {
                                    label: 'Participantes',
                                    icon: 'fa fa-user',
                                    command: this.handleShowModalModalNewParticipantImport
                                },
                                {
                                    label: 'Palestrantes',
                                    icon: 'fa fa-user',
                                    // command: () => handleDeleteTicket(props.data)
                                },
                                {
                                    label: 'Patrocinadores',
                                    icon: 'fa fa-user',
                                    // command: () => handleDeleteTicket(props.data)
                                },
                                {
                                    label: 'Registros financeiros',
                                    icon: 'fa fa-coins',
                                    command: this.handleShowModalImportFinancialData
                                },
                            ]" 
                            class="p-0 bg-gray-300/60"
                            option-label="label"
                        >
                            <template #value>
                                <div class="flex justify-center items-center text-black">
                                    Importar
                                </div>
                            </template>

                            <template #option="{ option }">
                                <div class="h-2 text-sm flex items-center text-zinc-700 py-2 w-full" @click="option.command">
                                    <i :class="option.icon" class="mr-2" /> {{ option.label }}
                                </div>
                            </template>

                            <template #dropdownicon>
                                <i class="fa fa-chevron-down text-black font-thin text-sm"/>
                            </template>
                        </Dropdown>
                </div>
            </div>

            <hr />

            <div class="flex my-4">
                <InputGroup>
                    <Button size="small" class="h-9 bg-transparent border border-surface-300 border-r-0">
                        <i class="fa fa-search text-black" />
                    </Button>
                    <InputText size="small" v-model="filter" id="search" type="text" placeholder="Pesquisar..." class="w-full rounded-none h-9 border-l-0" />
                </InputGroup>
            </div>

            <DataTable :value="imports" size="small" paginator :rows="7" :totalRecords="totalRecords"
                dataKey="id" class="ctable" :loading="busy" lazy :rowsPerPageOptions="[7, 10, 20, 50]"
            >
                                            
                <Column field="description" header="Descrição"></Column>
                
                <Column field="createdAt" header="Importado em" />

                <Column field="operador.name" header="Usuário" />

                <Column field="event.name" header="Evento" />

                
                <Column field="actions" header="Ações" class="relative">
                    <template #body="props">
                        <router-link v-slot="{ navigate }" :to="{name: 'event.show', params: {id: props.data.event.id}}" custom>
                            <Button severity="transparent" size="small" class="h-9" @click="navigate">
                                <i class="fa fa-eye" />
                            </Button>
                        </router-link>
                    </template>
                </Column>

                <template #empty>
                    <div class="flex items-center justify-center h-10">
                        <p class="text-gray-400">Nenhuma informação disponível</p>
                    </div>
                </template>
            </DataTable>
        </CardRoot>
    </div>
</template>

<style>
div[data-pc-section="root"].ctable > div[data-pc-section="wrapper"] {
    overflow: visible !important;
}
</style>