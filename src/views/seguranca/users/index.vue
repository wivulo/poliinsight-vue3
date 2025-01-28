<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useNotification } from '@/composables/useNotification'
import { User } from '@/model/user.model'
import UserServices from '@/services/UserServices'
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Calendar from 'primevue/calendar';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import SplitButton  from 'primevue/splitbutton';
import Dropdown from 'primevue/dropdown';
import CardRoot from "@/components/PCard/CardRoot.vue"
import BaseGrayButton from '@/layouts/components/BaseGrayButton.vue';
import VueToPrintWrapper from "@/components/VueToPrintWrapper.vue";
import ModalNewUser from './components/ModalNewUser.vue'
import ModalEditUser from './components/ModalEditUser.vue'
import { SwalConfirmAlert } from '@/helpers/swalConfirmAlert';

const store = useStore()
const router = useRouter()
const { notifyError, notifySuccess } = useNotification()

const users = ref<Array<User>>([])
const total = ref<number>(0)
const itemSelected = ref<User[]>([])
const filter = ref<string>('')
const busy = ref<boolean>(false)

const params = reactive({
    skip: 1,
    take: 8,
    where: {
        name: {
            contains: ''
        }
    }
})


async function fetchUsers() {
    try {
        busy.value = true
        const response = await UserServices.index(params)
        if(response.status === 200) {
            users.value = response.data.data
            total.value = response.data.total
            return
        }

        throw new Error()
    } catch (error) {
        console.error(error)
        notifyError(error)
    } finally {
        busy.value = false
    }
}

function onPageChange (event) {
    console.log(event)
    params.skip = event.page + 1
    params.take = event.rows
    // fetchUsers()
}

function handleViewUser(user: any) {}

const ModalEditUserRef = ref<InstanceType<typeof ModalEditUser> | null>(null)
function handleEditUser(userToEdit: any) {
    ModalEditUserRef.value?.show(userToEdit)
}

async function handleDeleteUser(user) {
    try {
        if(!await SwalConfirmAlert()) return;

        busy.value = true;
        const response = await UserServices.delete(user.id)
        if(response.status === 200) {
            notifySuccess('Utilizador eliminado definitivamente com sucesso!');
            fetchUsers()
            return;
        }

        throw new Error()
    } catch (error) {
        console.error(error)
        notifyError(error)
    } finally {
        busy.value = false
    }
}

const ModalNewUserRef = ref<InstanceType<typeof ModalNewUser> | null>(null)
function handleShowModalNewUser() {
    ModalNewUserRef.value?.show()
}

onMounted(() => {
    fetchUsers()
})

watch(params, () => {
    fetchUsers()
}, { deep: true })
</script>


<template>
    <div class="p-4 px-5 w-full" ref="componentRef">
        <ModalNewUser ref="ModalNewUserRef" @created="fetchUsers"/>
        <ModalEditUser ref="ModalEditUserRef" @updated="fetchUsers"/>

        <CardRoot class="mt-4">
            <VueToPrintWrapper type="Meus eventos">
                <template #default="{ printer }">
                    <div>
                        <div class="flex justify-between items-center no-print">
                            <div class="py-2">
                                <h1 class="text-base font-semibold">Utilizadores</h1>
                                <p class="text-xs">Faça gestão dos utilizadores da plataforma aqui</p>
                            </div>

                            <div class="flex gap-2 justify-end">
                                <Button icon="pi pi-plus" label="Adicionar" size="small" class="h-8" @click="handleShowModalNewUser" />

                                <Button severity="secondary" size="small" class="text-surface-800 h-8" @click="printer.handlePrint">
                                    <span class="text-black">
                                        <i class="fa fa-print mr-1" />imprimir
                                    </span>
                                </Button>
                            </div>
                        </div>

                        <hr />

                        <div class="my-3 no-print">
                            <div class="flex">
                                <InputGroup>
                                    <Button size="small" class="h-9 bg-transparent border border-surface-300 border-r-0">
                                        <i class="fa fa-search text-black" />
                                    </Button>
                                    <InputText 
                                        size="small" v-model="params.where.name.contains" id="search" type="text" 
                                        placeholder="Pesquisar..." class="w-full rounded-none h-9 border-l-0" 
                                        @keypress.enter="fetchUsers" :loading="busy"
                                    />
                                </InputGroup>
                            </div>
                        </div>

                        <div>

                            <div>
                                <DataTable :value="users" size="small" paginator
                                    dataKey="id" scrollable
                                    :loading="busy" lazy class="ctable" :rowsPerPageOptions="[8, 10, 20, 50]" 
                                    :totalRecords="total" stripedRows
                                    @page="onPageChange"
                                    v-model:rows="params.take"
                                    v-model:page="params.skip"
                                >
                                    <Column field="name" header="Nome">
                                        <template #body="props">
                                            <router-link :to="{name: 'security.users.show', params: {id: props.data.id}}" class="hover:text-primary-500">
                                                {{ props.data.name }}
                                            </router-link>
                                        </template>
                                    </Column>

                                    <Column field="email" header="Email" />
                                    <Column field="username" header="Nome de usuário" />
                                    <Column field="department.name" header="Departamento" />
                                    <Column field="options" header="Opções">
                                        <template #body="props">
                                            <Dropdown 
                                                :options="[
                                                    { 
                                                        label: 'Visualizar', icon: 'fa fa-eye',
                                                        command: () => handleViewUser(props.data)
                                                    },
                                                    {
                                                        label: 'Editar', icon: 'fa fa-pencil',
                                                        command: () => handleEditUser(props.data)
                                                    },
                                                    {
                                                        label: 'Eliminar', icon: 'fa fa-trash text-red-500',
                                                        command: () => handleDeleteUser(props.data)
                                                    },                                                
                                                ]" 
                                                size="small" class="h-9 border-none"
                                            >
                                                <template #value>
                                                    <div class="flex justify-center items-center w-full h-full">
                                                        <i class="fa fa-cog"/>
                                                    </div>
                                                </template>

                                                <template #option="{ option}">
                                                    <div class="h-2 text-sm flex items-center text-surface-600 py-2 w-full" @click="option.command">
                                                        <i :class="option.icon" class="mr-1" /> {{ option.label }}
                                                    </div>
                                                </template>
                                            </Dropdown>
                                        </template>
                                    </Column>
                                </DataTable>
                            </div>
                        </div>

                    </div>
                </template>
            </VueToPrintWrapper>
        </CardRoot>
    </div>
</template>

<style>
div[data-pc-section="root"].ctable > div[data-pc-section="wrapper"] {
    overflow: visible !important;
}
</style>