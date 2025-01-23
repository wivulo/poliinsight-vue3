<script lang="ts" setup>
import { onUnmounted, ref } from 'vue';
import UserServices from '@/services/UserServices';
import DepartamentService from '@/services/DepartamentService';
import { useRequest } from '@/composables/useRequest';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Badge from 'primevue/badge';
import { ConfirmSwal } from '@/helpers/fireSwal';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';

const emit = defineEmits(['updated']);
const {busy, executeRequest} = useRequest();
const { busy:fetchBusy, executeRequest:fetchUser, error } = useRequest();
const { busy:departamentBusy, executeRequest: showDepartments } = useRequest();

let visible = ref(false);
let fieldTarget = ref(null);
let fieldLabel = ref(null);
let user = ref({});
let genders = [
    { label: 'Masculino', value: 'male' },
    { label: 'Feminino', value: 'female' }
]
const departments = ref([]);

const show = async (userId: string, label: string, field?: string) => {
    visible.value = true;
    fieldTarget.value = field;
    fieldLabel.value = label;
    await handleFetchUser(userId);
}

const handleFetchUser = async (userId: string) => {
    const response = await fetchUser(
        () => UserServices.show(userId),
        null,
        'Erro ao buscar o usuário'
    );

    if(error.value) return

    user.value = {
        ...response,
        [fieldTarget.value]: response[fieldTarget.value]
    }
}

const fetchDepartments = async () => {
    departments.value = await showDepartments(
        DepartamentService.index,
        null,
        'Erro ao buscar os departamentos'
    );
}
fetchDepartments();

const handleOK = async () => {
    const result = await ConfirmSwal()
    if(!result.isConfirmed) return

    await update();
}

const update = async () => {
    const data = await executeRequest(
        () => UserServices.update(user.value),
        'Utilizador actualizado com sucesso!',
        'Erro ao actualizar o utilizador!'
    );

    if(error.value) return

    emit('updated', data);
    handlehidden();
    reset();
}

onUnmounted(() => {
    reset();
});

const reset = () => {
    user = ref(null);
    fieldTarget.value = null;
    fieldLabel.value = null;
};

const handlehidden = () => {
    visible.value = false;
}

const handleCancel = () => {
    reset()
    handlehidden()
}

//expor a função show para ser usada no componente pai
defineExpose({ show });
</script>

<template>
    <Dialog v-model:visible="visible" modal header="Actualizar utilizador" :style="{ width: '30rem' }" 
        @beforeClose="handleCancel"
    >
        <div v-if="user" class="flex items-center w-full">
            <div class="flex flex-col gap-1 w-full">
                <label :for="fieldTarget" class="text-sm">
                    {{ fieldLabel }} <span class="text-red-600">*</span>
                </label>
                
                <Dropdown v-if="fieldTarget === 'gender'" 
                    id="gender" v-model="user[fieldTarget]" :options="genders" 
                    placeholder="Selecione um genero" class="h-9 w-full"
                    option-label="label" option-value="value" 
                />

                <Calendar v-else-if="fieldTarget === 'birthday'"
                    id="birthDate" v-model="user[fieldTarget]"
                    class="flex-grow border-zinc-300 h-9 focus:outline-zinc-400" 
                    inputClass="hover:border-zinc-400" placeholder="ex.: 10/12/1998"
                    dateFormat="dd/mm/yyyy" 
                />

                <Dropdown v-else-if="fieldTarget === 'departmentId'" 
                    id="department" v-model="user[fieldTarget]"  :options="departments" 
                    optionLabel="name" option-value="id" placeholder="Selecione um departamento" 
                    class="h-9 w-full"
                >
                    <template #value="slotProps">
                        <div v-if="slotProps.value" class="flex items-center text-black">
                            {{ departments.find(department => department.id === slotProps.value).name }}
                        </div>
                        <div v-else>
                            {{ slotProps.placeholder }}
                        </div>
                    </template>
                </Dropdown>

                <InputText v-else 
                    :id="fieldTarget" :name="fieldTarget" 
                    v-model="user[fieldTarget]" class="h-9 w-full" 
                />
            </div>
        </div>

        <div v-else>
            <i class="pi pi-spin pi-spinner" style="font-size: 1rem"></i>
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