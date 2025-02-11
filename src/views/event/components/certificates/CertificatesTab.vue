<script setup>
import { reactive, ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import CertificatesServices from '@/services/CertificatesServices';
import { useNotification } from '@/composables/useNotification';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import PDropdown from "@/components/PDropdown/PDropdown.vue";
import PDropdownTrigger from "@/components/PDropdown/PDropdownTrigger.vue";
import PDropdownMenu from "@/components/PDropdown/PDropdownMenu.vue";
import PDropdownItem from "@/components/PDropdown/PDropdownItem.vue";
import { debounce } from 'lodash'
import ModalCertificateTemplates from './ModalCertificateTemplates.vue';
import ModalSendCertificateIndividual from './ModalSendCertificateIndividual.vue'
import { extendedDayjs } from '@/plugin/dayjs';

const router = useRouter();
const { notifyError, notifySuccess } = useNotification()

const busy = ref(false);
const certificates = ref([]);
const totalRecods = ref(0);
const search = ref(null);
const params = ref({
    take: 8,
    skip: 1,
    where: {
        name: {
            contains: null
        }
    }
})

const fetchCertificates = debounce(async () => {
    try {
        busy.value = true;
        const response = await CertificatesServices.listByEvent(router.currentRoute.value.params.id, params.value);

        if (response.status === 200) {
            certificates.value = response.data.data;
            totalRecods.value = response.data.total;
            return
        }

        throw new Error();
    } catch (error) {
        console.error(error);
        notifyError('Erro ao buscar os certificados');
    } finally {
        busy.value = false;
    }
}, 200)

const ModalCertificateTemplatesRef = ref(null);
function handleShowModalTemplates() {
    ModalCertificateTemplatesRef.value.show();
}

const ModalSendCertificateIndividualRef = ref(null)
function handleShowModalSendCertificateIndividual() {
    ModalSendCertificateIndividualRef.value.show()
}

function updateComponent() {
    fetchCertificates();
}

function onPageChange(event) {
    params.value.skip = event.page + 1
    params.value.take = event.rows
}

watch(search, () => {
    params.value.where.name.contains = search.value;
    fetchCertificates();
})

watch(params, () => {
    fetchCertificates();
})

onMounted(() => fetchCertificates());

defineExpose({
    updateComponent
});
</script>

<template>
    <div class="flex flex-col gap-3">
        <ModalCertificateTemplates ref="ModalCertificateTemplatesRef" />
        <ModalSendCertificateIndividual ref="ModalSendCertificateIndividualRef" @sended="fetchCertificates" />

        <div class="flex">
            <InputGroup>
                <Button size="small" class="h-9 bg-transparent border border-surface-300 border-r-0">
                    <i class="fa fa-search text-black" />
                </Button>
                <InputText size="small" v-model="search" id="search" type="text" placeholder="Escreva para pesquisar..."
                    class="w-full rounded-none h-9 border-l-0" />

                <PDropdown>
                    <PDropdownTrigger>
                        <Button severity="secondary" icon="pi pi-bars" label="Opções" size="small" 
                            class="h-9 border border-l-0 !rounded-l-none" 
                        />
                    </PDropdownTrigger>
                    <PDropdownMenu menu-class="min-w-[100px]">
                        <PDropdownItem @click="handleShowModalTemplates">
                           <i class="pi pi-file mr-1"></i> Templates
                        </PDropdownItem>

                        <PDropdownItem @click="handleShowModalSendCertificateIndividual">
                           <i class="pi pi-user mr-1"></i> Emissão individual
                        </PDropdownItem>

                        <PDropdownItem disabled class="select-none text-slate-300">
                            <i class="pi pi-users"></i> Emissão em lote
                        </PDropdownItem>
                    </PDropdownMenu>
                </PDropdown>
            </InputGroup>
        </div>

        <DataTable :value="certificates" size="small" paginator :rows="params.take" :totalRecords="totalRecods"
            dataKey="id" class="ctable" :loading="busy" lazy :rowsPerPageOptions="[8, 10, 20, 50]" @page="onPageChange"
            v-model:rows="params.take" v-model:page="params.skip">

            <Column field="validationCode" header="ID" />

            <Column field="template.type" header="Tipo" />

            <Column field="participant" header="Participante" sortable>
                <template #body="props">
                    <p>{{ props.data?.participant?.name ? props.data.participant?.name : props.data?.user?.name }}</p>
                </template>
            </Column>

            <Column field="createdAt" header="Data de emissão" sortable>
                <template #body="props">
                    <p>{{ extendedDayjs(props.data.createdAt).format("D [de] MMMM") }}</p>
                </template>
            </Column>

            <Column field="options" header="Opções">
                <template #body="props">
                    <!-- <PDropdown :options="dropdownItems" :data="slotProps.data" /> -->
                    <Button rounded class="h-8 w-8 :hover:bg-surface-300 hover:scale-105 transition-all">
                        <a :href="props.data.fileUrl" download>
                            <i class="fa fa-download text-white" />
                        </a>
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