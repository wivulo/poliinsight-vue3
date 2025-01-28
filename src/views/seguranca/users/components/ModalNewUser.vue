<script setup>
import { ref, onMounted, reactive, watch } from 'vue'
import UserServices from '@/services/UserServices'
import DepartamentService from '@/services/DepartamentService.js'
import GroupService from '@/services/GroupService'
import { useNotification } from '@/composables/useNotification'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Dropdown from 'primevue/dropdown';
import Password from 'primevue/password';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import { SwalConfirmAlert } from '@/helpers/swalConfirmAlert';
import InlineMessage from 'primevue/inlinemessage';

const emit = defineEmits(['created']);
const { notifyError, notifySuccess } = useNotification()

const visible = ref(false)
const busy = ref(false)
let submited = ref(false);
const user = ref({
    name: '',
    email: '',
    password: 'poliinsinght',
    gender: "",
    username: "",
    birthdate: "",
    department_id: null,
    groupId: null,
})
const departments = ref({
    busy: false,
    data: []
})

const groups = ref({
    busy: false,
    data: []
})

const genders = [
    "Masculino",
    "Feminino",
]

const rules = {
    name: { required },
    email: { required },
    password: { required },
    gender: { required },
    username: { required },
    birthdate: { required },
    groupId: { required }
};

const v$ = useVuelidate(rules, user);

function show() {
    visible.value = true;
    fetchDepartments()
    fetchGroups()
}

async function fetchDepartments(){
    try {
        departments.value.busy = true
        const response = await DepartamentService.index()
        if(response.status === 200) {
            departments.value.data = response.data
            return
        }

        throw new Error()
    } catch (error) {
        notifyError('Erro ao buscar os departamentos')
        console.log(error)
    } finally {
        departments.value.busy = false
    }
}

async function fetchGroups(){
    try {
        groups.value.busy = true
        const response = await GroupService.index()
        if(response.status === 200) {
            groups.value.data = response.data
            return
        }

        throw new Error()
    } catch (error) {
        notifyError('Erro ao buscar os grupos')
        console.log(error)
    } finally {
        groups.value.busy = false
    }
}

function handleCancel() {
    visible.value = false
    handleReset()
}

function handleHidden() {
    visible.value = false;
}

function handleReset() {
    busy.value = false;
    submited.value = false;
    user.value = {
        name: '',
        email: '',
        password: 'poliinsinght',
        gender: "",
        username: "",
        birthdate: "",
        department_id: null,
        groupId: null,
    }
    v$.value.$reset();
}

function handleOK() {
    submited.value = true;
    return !v$.value.$invalid && store();
}

async function store() {
    try {
        if(!await SwalConfirmAlert()) return;

        busy.value = true;
        const response = await UserServices.store(user.value)
        if(response.status === 201 || response.status === 200) {
            notifySuccess('Utilizador criada com sucesso!');
            emit('created');
            handleCancel();
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

defineExpose({ show });
</script>

<template>
        <Dialog v-model:visible="visible" modal header="Usuário" :style="{ width: '32rem' }">
            <div class="flex flex-col gap-5" >

                <div class="mb-3 w-full">
                    <FloatLabel>
                        <InputText id="name" v-model="user.name" class="w-full h-9 " :required="true" :invalid="submited && v$.name.$invalid"/>
                        <label for="name">
                            <i class="fas fa-user me-1 "></i> <small> Nome completo </small>
                        </label>
                    </FloatLabel>
                </div>

                <FloatLabel class="mb-3">
                    <InputText id="email" v-model="user.email" class="w-full h-9 " :required="true" :invalid="submited && v$.email.$invalid"/>
                    <label for="email">
                        <i class="fas fa-envelope me-1 "></i> <small> E-mail </small>
                    </label>
                </FloatLabel>

                <FloatLabel class="mb-3">
                    <InputText id="username" v-model="user.username" class="w-full h-9" :required="true" :invalid="submited && v$.username.$invalid"/>
                    <label for="username">
                    <i class="fas fa-user me-1 "></i> <small> Nome de usuario </small>
                    </label>
                </FloatLabel>

                <div class="flex gap-2 items-center mb-3">
                    <label for="birthDate" class="flex-grow pl-3">
                        <i class="fas fa-calendar me-1 text-zinc-500" /> <small> Data de nascimento </small>
                    </label>
                    <Calendar id="birthDate" v-model="user.birthdate" class="flex-grow h-9" inputClass="hover:border-zinc-400" placeholder="ex.: 10/12/1998" dateFormat="dd/mm/yyy":invalid="submited && v$.birthdate.$invalid" />
                </div>

                <div class="flex gap-2 items-center mb-3">
                    <label for="gender" class="flex-grow pl-3">
                        <i class="fas fa-user me-1 text-zinc-500" /> <small> Gênero </small>
                    </label>
                    <Dropdown id="gender" v-model="user.gender" :options="genders" placeholder="Selecione um genero" class="h-9 flex-grow w-[125px]"  :invalid="submited && v$.gender.$invalid"/>
                </div>

                <div class="flex flex-col gap-2">
                    <label for="department" class="ml-3 text-zinc-500">
                        <i class="fas fa-book me-1 "></i> <small> Selecione um departamento </small>
                    </label>
                    <Dropdown id="department" v-model="user.department_id"  :options="departments.data" optionLabel="name" option-value="id" class="h-9 w-full">
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="flex items-center text-black">
                                {{ departments.data.find(department => department.id === slotProps.value).name }}
                            </div>
                            <div v-else>
                                {{ slotProps.placeholder }}
                            </div>
                        </template>
                    </Dropdown>
                </div>

                <div class="flex flex-col gap-2">
                    <label for="group" class="ml-3 text-zinc-500">
                        <i class="pi pi-users me-1 "></i> <small> Grupo </small>
                    </label>

                    <Dropdown id="group" v-model="user.groupId"  :options="groups.data" optionLabel="name" option-value="id" class="h-9 w-full" :invalid="submited && v$.groupId.$invalid">
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="flex items-center text-black">
                                {{ groups.data.find(group => group.id === slotProps.value).name }}
                            </div>
                            <div v-else>
                                {{ slotProps.placeholder }}
                            </div>
                        </template>
                    </Dropdown>
                </div>
            </div>

            <template #footer>
                <div class="flex gap-3 justify-end">
                    <Button severity="secondary" text @click="handleCancel" size="small" class="h-8">
                        <i class="fa fa-times mr-1"/> Cancelar
                    </Button>
                    <Button @click="handleOK" size="small" class="h-8" :loading="busy">
                        <i class="fas fa-spinner animate-spin mr-1" v-if="busy" />
                        <i class="fa fa-save mr-1"/> {{ busy ? 'Salvando...' : 'Salvar' }}
                    </Button>
                </div>
            </template>
        </Dialog>
</template>