<script lang="ts" setup>
import { ref, reactive } from 'vue';
import ActivityServices from '@/services/ActivityServices';
import { useNotification } from '@/composables/useNotification';
import { useRouter } from 'vue-router';
import { ActivityType } from '@/model/activity.model';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Avatar from 'primevue/avatar';
import ModalAddNewActivityGuest from './ModalAddNewActivityGuest.vue';
import PDropdown from '@/components/PDropdown/PDropdown.vue';
import Swal from 'sweetalert2';
import ModalEditGuest from './ModalEditGuest.vue';

const emit = defineEmits(['created']);
const { notifyError, notifySuccess } = useNotification();
const router = useRouter();

let visible = ref(false);
let busy = ref(false);
let activity = ref<ActivityType>(null);

function show(activityId: number) {
    visible.value = true;
    fetchActivity(activityId)
}

function handleHidden() {
    visible.value = false;
}

function handleReset() {
    busy.value = false;
    activity.value = null;
}

function handleCancel() {
    visible.value = false;
    handleReset()
}

const ModalNewActivityTypeRef = ref(null);
function handleShowModalNewActivityType() {
    ModalNewActivityTypeRef.value.show();
}

async function fetchActivity(activityId: number) {
    try {
        busy.value = true;
        const response = await ActivityServices.show(activityId);
        if(response.status === 200) {
            activity.value = response.data;
            return;
        }

        notifyError();
    } catch (error) {
        console.error(error);
        notifyError('Erro ao buscar actividade!');
    } finally {
        busy.value = false;
    }
}

const ModalAddNewActivityGuestRef = ref(null);
function handleAddNewConvidadoInEventActivity(activity: ActivityType) {
    ModalAddNewActivityGuestRef.value.show(activity);
}

const dropdownItems = [
    {
        label: 'Editar',
        icon: 'fa-pencil',
        click: (prop: any) => handleEditGuest(prop)
    },
    {
        label: 'Eliminar',
        icon: 'fa-trash text-primary',
        click: (prop: any) => handleDeleteGuest(prop)
    },
];

// const deleteBusy = ref(false);
async function handleDeleteGuest(guest: any) {
    try {
        await Swal.fire({
            title: 'Eliminar convidado',
            text: `Tem certeza que deseja eliminar o convidado ${guest.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            reverseButtons: true,
        }).then(async (result) => {
            if(result.isConfirmed) {
                busy.value = true;
                const response = await ActivityServices.deleteGuest(guest.id);
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

const ModalEditGuestRef = ref(null);
function handleEditGuest(guest: any) {
    ModalEditGuestRef.value.show(guest);
}

//expor a função show para ser usada no componente pai
defineExpose({ show });
</script>

<template>
    <Dialog v-model:visible="visible" modal header="Actividade" dismissableMask class="w-[60rem]">
        <ModalAddNewActivityGuest ref="ModalAddNewActivityGuestRef" @created="fetchActivity" />
        <ModalEditGuest ref="ModalEditGuestRef" @created="fetchActivity" />

        <div class="flex h-[20rem]">
            <div class="basis-1/4 text-sm">
                <ul class="list border px-2 py-5 rounded-md flex flex-col gap-3">
                    <li class="flex justify-between truncate border-b py-3" :title="activity?.name">
                        <span class="text-lg font-semibold">{{ activity?.name }}</span>
                    </li>
                    <li class="flex justify-between truncate" :title="activity?.description">
                        <b>Descrição:</b>
                        <span>{{ activity?.description }}</span>
                    </li>
                    <li class="flex justify-between">
                        <b>Tipo:</b>
                        <span>{{ activity?.type.name }}</span>
                    </li>
                    <li class="flex justify-between">
                        <b>Local:</b>
                        <span>{{ activity?.location }}</span>
                    </li>
                    <li class="flex justify-between">
                        <b>Inicio:</b>
                        <span v-formatTime="activity?.startTime" />
                    </li>
                    <li class="flex justify-between">
                        <b>Fim:</b>
                        <span v-formatTime="activity?.endTime" />
                    </li>

                </ul>
            </div>

            <div class="basis-3/4 pl-10">
                <div class="w-full flex flex-col">
                    <div class="w-full flex justify-between border-b pb-2">
                        <div>
                            <h3 class="text-base">Convidados</h3>
                            <p class="text-xs text-gray-400">Lista de convidados</p>
                        </div>

                        <Button severity="secondary" size="small" class="h-8" @click="handleAddNewConvidadoInEventActivity(activity)">
                            <i class="fa fa-plus mr-1" /> Convidado
                        </Button>
                    </div>
                    
                    <div class="w-full">
                        <DataTable :value="activity?.guests" size="small" paginator :rows="5" :totalRecords="activity?.guests?.length"
                            dataKey="id" class="ctable" :loading="busy" lazy :rowsPerPageOptions="[5, 10, 20, 50]"
                        >

                            <Column field="imageURL" header="Foto">
                                <template #body="props">
                                    <Avatar v-if="props.data.imageURL" :image="props.data.imageURL" size="large" shape="circle" />
                                    <Avatar v-else icon="pi pi-user" size="large" shape="circle"/>
                                </template>
                            </Column>
                            <Column field="name" header="Nome" sortable>
                                <template #body="props">
                                    <span v-if="props.data?.user">{{ props.data.user?.name }}</span>
                                    <span v-else>{{ props.data.name }}</span>
                                </template>
                            </Column>
                            <Column field="email" header="Email">
                                <template #body="props">
                                    <span v-if="props.data?.user">{{ props.data.user?.email }}</span>
                                    <span v-else>{{ props.data.email }}</span>
                                </template>
                            </Column>
                            <Column field="phone" header="Email"></Column>
                            <Column field="roleInActivity" header="Função"></Column>

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
                </div>
            </div>
        </div>
    </Dialog>
</template>