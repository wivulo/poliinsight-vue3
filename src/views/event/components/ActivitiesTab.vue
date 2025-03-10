<script setup>
import { reactive, ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useNotification } from '@/composables/useNotification';
import { useDateFormatter } from '@/composables/useDateFormatter';
import ActivityServices from '@/services/ActivityServices';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import { debounce } from 'lodash'
import ModalNewActivity from './activity/ModalNewActivity.vue';
import ModalViewActivity from './activity/ModalViewActivity.vue';
import PDropdown from '@/components/PDropdown/PDropdown.vue';
import ModalEditActivity from './activity/ModalEditActivity.vue';
import Swal from 'sweetalert2';

const router = useRouter();
const { notifyError, notifySuccess } = useNotification()

const busy = ref(false);
const activities = ref([]);
const search = ref(null);
const totalRecods = ref(0);
const params = ref({
    take: 8,
    skip: 1,
    where: {
        name: {
            contains: null
        }
    }
})

const dropdownItems = [
    {
        label: 'Visualizar',
        icon: 'fa-eye',
        click: (prop) => handleViewEventActivity(prop)
    },
    {
        label: 'Editar',
        icon: 'fa-pencil',
        click: (prop) => handleEditEventActivity(prop)
    },
    {
        label: 'Eliminar',
        icon: 'fa-trash text-red-500',
        click: (prop) => handleDeleteEventActivity(prop)
    },
];

const fetchActivities = debounce(async () => {
    try {
        busy.value = true;
        const response = await ActivityServices.ListByEvent(router.currentRoute.value.params.id, params.value);

        if(response.status === 200){
            activities.value = response.data.data;
            totalRecods.value = response.data.total;
            return
        }

        throw new Error();
    } catch (error) {
        console.error(error);
        notifyError('Erro ao buscar as atividades');
    } finally {
        busy.value = false;
    }
})

function updateComponent(){
    fetchActivities();
}

const ModalNewActivityRef = ref(null);
function ShowModalNewActivity(){
    ModalNewActivityRef.value.show();
}

const ModalViewActivityRef = ref(null);
function handleViewEventActivity(activity){
    ModalViewActivityRef.value.show(activity?.id);
}

const ModalEditActivityRef = ref(null);
function handleEditEventActivity(activity){
    ModalEditActivityRef.value.show(activity);
}

async function handleDeleteEventActivity(activity){
    try {
        await Swal.fire({
            title: 'Eliminar Actividade',
            text: `Tem certeza que deseja eliminar a actividade ${activity.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, eliminar',
            cancelButtonText: 'Não',
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            reverseButtons: true,
        }).then(async (result) => {
            if(result.isConfirmed) {
                busy.value = true;
                const response = await ActivityServices.delete(activity.id);
                if(response.status === 200) {
                    notifySuccess('Convidado eliminado com sucesso');
                    fetchActivity(activity.value.id);
                    return;
                }

                throw new Error();
            }
        });
    } catch (error) {
        console.error(error);
        notifyError('Erro ao eliminar convidado');
    } finally {
        busy.value = false;
    }
}

function onPageChange(event) {
    params.value.skip = event.page + 1
    params.value.take = event.rows
}

watch(search, () => {
    params.value.where.name.contains = search.value;
    fetchActivities();
})

watch(params, () => {
    fetchActivities();
})

onMounted(() => fetchActivities() );

defineExpose({
    updateComponent
});
</script>

<template>
    <div class="flex flex-col gap-3">
        <ModalNewActivity ref="ModalNewActivityRef" @created="fetchActivities"/>
        <ModalViewActivity ref="ModalViewActivityRef" @updated="fetchActivities"/>
        <ModalEditActivity ref="ModalEditActivityRef" @updated="fetchActivities"/>

        <div class="flex">
            <InputGroup>
                <Button size="small" class="h-9 bg-transparent border border-surface-300 border-r-0">
                    <i class="fa fa-search text-black" />
                 </Button>
                <InputText size="small" v-model="search" id="search" type="text" placeholder="Escreva para pesquisar..." class="w-full rounded-none h-9 border-l-0" />
                <Button severity="secondary" size="small" class="h-9 border border-r-0" @click="ShowModalNewActivity">
                    <i class="fa fa-plus mr-1" /> Adicionar
                 </Button>
            </InputGroup>
        </div>

        <DataTable :value="activities" size="small" paginator :rows="params.take" :totalRecords="totalRecods"
            dataKey="id" class="ctable" :loading="busy" lazy :rowsPerPageOptions="[8, 10, 20, 50]"
            @page="onPageChange"
            v-model:rows="params.take"
            v-model:page="params.skip"
        >

            <Column field="name" header="Nome" sortable></Column>
            <Column field="type.name" header="Tipo" sortable></Column>
            <Column field="startTime" header="Início" sortable>
                <template #body="slotProps">
                    <span v-formatTime="slotProps.data.startTime" />
                </template>
            </Column>
            <Column field="endTime" header="Fim">
                <template #body="slotProps">
                    <span v-formatTime="slotProps.data.endTime" />
                </template>
            </Column>

            <Column field="options" header="Opções">
                <template #body="slotProps">
                    <PDropdown :options="dropdownItems" :data="slotProps.data" />
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