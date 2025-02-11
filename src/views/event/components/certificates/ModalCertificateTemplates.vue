<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useNotification } from '@/composables/useNotification';
import { useRouter } from 'vue-router';
import CertificatesServices from '@/services/CertificatesServices';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Avatar from 'primevue/avatar';
import PDropdown from '@/components/PDropdown/PDropdown.vue';
import ModalNewTemplate from './ModalNewTemplate.vue';
import ModalEditTemplate from './ModalEditTemplate.vue';
import Swal from 'sweetalert2';

const emit = defineEmits(['created']);
const { notifyError, notifySuccess } = useNotification();
const router = useRouter();

let visible = ref(false);
let busy = ref(false);
const templates = ref([]);

function show() {
    visible.value = true;
    fetchTemplates()
}

function handleHidden() {
    visible.value = false;
}

async function fetchTemplates() {
    try {
        busy.value = true;
        const response = await CertificatesServices.listTemplates(router.currentRoute.value.params.id);
        if (response.status === 200) {
            templates.value = response.data.data;
            return;
        }

        throw new Error();
    } catch (error) {
        console.error(error);
        notifyError();
    } finally {
        busy.value = false;
    }
}

const ModalNewTemplateRef = ref(null);
function handleShowModalNewTemplate() {
    ModalNewTemplateRef.value.show();
}

const dropdownItems = [
    {
        label: 'Editar',
        icon: 'fa-pencil',
        click: (prop: any) => handleEditTemplate(prop)
    },
    {
        label: 'Eliminar',
        icon: 'fa-trash text-primary',
        click: (prop: any) => handleDeleteTemplate(prop)
    },
];

const ModalEditTemplateRef = ref(null);
function handleEditTemplate(template: any) {
    ModalEditTemplateRef.value.show(template);
}

function handleDeleteTemplate(template: any) {
    try {
        Swal.fire({
            title: 'Eliminar template',
            text: 'Tem a certeza que deseja eliminar este template?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
        }).then(async (result: any) => {
            if (result.isConfirmed) {
                busy.value = true;
                const response = await CertificatesServices.deleteTemplate(template.id);
                if (response.status === 200) {
                    notifySuccess('Template eliminado com sucesso!');
                    fetchTemplates();
                    return;
                }

                throw new Error();
            }
        });
    } catch (error) {
        console.error(error);
        notifyError(error);
    }
}

defineExpose({
    show
})
</script>

<template>
    <Dialog v-model:visible="visible" modal header="Templates" dismissableMask class="w-[50rem]">
        <ModalNewTemplate ref="ModalNewTemplateRef" @created="fetchTemplates" />
        <ModalEditTemplate ref="ModalEditTemplateRef" @updated="fetchTemplates" />

        <div>
            <div class="w-full flex flex-col">
                <div class="w-full flex justify-between items-end border-b pb-2">
                    <div>
                        <p class="text-xs text-gray-400">Lista dos templates</p>
                    </div>

                    <Button severity="secondary" size="small" class="h-8" @click="handleShowModalNewTemplate">
                        <i class="fa fa-plus mr-1" /> Template
                    </Button>
                </div>

                <div class="w-full">
                    <DataTable :value="templates" size="small" paginator :rows="5" :totalRecords="templates?.length"
                        dataKey="id" class="ctable" :loading="busy" lazy :rowsPerPageOptions="[5, 10, 20, 50]">

                        <Column field="name" header="Nome" />

                        <Column field="type" header="Tipo" />

                        <Column field="createdAt" header="Data de criação">
                            <template #body="slotProps">
                                <p>{{ new Date(slotProps.data.createdAt).toLocaleDateString() }}</p>
                            </template>
                        </Column>

                        <Column field="options" header="Opções">
                            <template #body="slotProps">
                                <div class="flex gap-3">
                                    <Button icon="pi pi-pencil text-surface-600" text size="small" class="h-8 w-8" rounded title="Editar template" 
                                        @click="handleEditTemplate(slotProps.data)"
                                    />
                                    <Button icon="pi pi-trash text-red-500" text size="small" class="h-8 w-8" rounded title="Eliminar template" 
                                        @click="handleDeleteTemplate(slotProps.data)"
                                    />
                                </div>
                            </template>
                        </Column>

                        <template #empty>
                            <div class="flex items-center justify-center h-10">
                                <p class="text-gray-400">Nenhuma informação disponível</p>
                            </div>
                        </template>
                    </DataTable>
                </div>
            </div>
        </div>
    </Dialog>
</template>