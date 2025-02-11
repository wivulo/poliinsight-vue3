<script setup>
import { computed, ref } from 'vue';
import ExportServices from '@/services/ExportServices';
import { useDocumentTitle } from '@/composables/useDocumentTitle';
import { useRequest } from '@/composables/useRequest';
import { useStore } from 'vuex';
import { useDateFormatter } from '@/composables/useDateFormatter';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import Dropdown from 'primevue/dropdown';
import CardRoot from '@/components/PCard/CardRoot.vue';
import ModalExportEspecificEventData from './components/ModalExportEspecificEventData.vue';
import ModalExportGeneralEventData from './components/ModalExportGeneralEventData.vue';

const { execute } = useDocumentTitle();
execute('Poliinsight | Exportar dados');

const store = useStore();
const { data: exports, busy: fetchExportsBusy, executeRequest: fetchExports } = useRequest();
const { formatter } = useDateFormatter();

const user = computed(() => store.getters['auth/user']);
const filter = ref(null);
const totalRecords = ref(0);

const handleFetchExport = () =>{
    fetchExports(() => ExportServices.getByOperator(user.value.id), null, 'Erro ao buscar as exportações');
}
handleFetchExport();

const ModalExportEspecificEventDataRef = ref(null);
const handleShowModalExportEspecificEventData = () => {
    ModalExportEspecificEventDataRef.value.show();
};

const ModalExportGeneralEventDataRef = ref(null);
const handleExportGeneralEventsData = () => {
    ModalExportGeneralEventDataRef.value.show();
};

const handleExported = () => {
    handleFetchExport();
};

</script>

<template>
    <div class="w-full py-3 px-5">
        <ModalExportGeneralEventData ref="ModalExportGeneralEventDataRef" @exported="handleExported" />
        <ModalExportEspecificEventData ref="ModalExportEspecificEventDataRef" @exported="handleExported" />

        <CardRoot class="mt-4">
            <div class="flex gap-2 justify-between my-2">
                <div>
                    <h1 class="text-base font-semibold">Exportações</h1>
                    <p class="text-sm">Lista dos dados exportados aqui</p>
                </div>

                <div>
                    <Dropdown 
                            :options="[
                                {
                                    label: 'Dados gerais',
                                    icon: 'fa fa-database',
                                    command: handleExportGeneralEventsData
                                },
                                {
                                    label: 'Outro',
                                    icon: 'fa fa-file',
                                    command: handleShowModalExportEspecificEventData
                                },
                            ]" 
                            class="p-0 bg-gray-300/60"
                            option-label="label"
                        >
                            <template #value>
                                <div class="flex justify-center items-center text-black">
                                    Exportar
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

            <DataTable :value="exports" size="small" paginator :rows="7" :totalRecords="totalRecords"
                dataKey="id" class="ctable" :loading="fetchExportsBusy" lazy :rowsPerPageOptions="[7, 10, 20, 50]"
            >
                                            
                <Column field="description" header="Descrição">
                    <template #body="props">
                        <span class="inline-block w-72 truncate">{{ props.data.description }}</span>
                    </template>
                </Column>

                <Column field="type" header="Tipo"></Column>

                
                <Column field="operador.name" header="Usuário" />

                <Column field="createdAt" header="Importado em">
                    <template #body="props">
                        <span>{{ formatter(props.data.createdAt).formatedDate }}</span>
                    </template>
                </Column>
                
                <Column field="actions" header="Ações" class="relative">
                    <template #body="props">
                        <Button size="small" severity="secondary" class="h-8">
                            <i class="fa fa-eye text-black text-xs" />
                        </Button>
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