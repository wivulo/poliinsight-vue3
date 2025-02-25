<script lang="ts" setup>
import { ref } from 'vue';
import UserServices from '@/services/UserServices';
import { useRequest } from '@/composables/useRequest';
import { useToast } from 'primevue/usetoast';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import { ConfirmSwal } from '@/helpers/fireSwal';
import Password from 'primevue/password';

const emit = defineEmits(['updated']);
const toast = useToast();
const {busy, executeRequest} = useRequest();
const { busy:fetchBusy, executeRequest:fetchUser, error } = useRequest();

let visible = ref(false);
let user = ref({});
let cpassword = ref(null);
let npassword = ref(null);


const show = async (userId: string) => {
    visible.value = true;
    handleFetchUser(userId);
}

const handleFetchUser = async (userId: string) => {
    const response = await fetchUser(
        () => UserServices.show(userId),
        null,
        'Erro ao buscar o usuário'
    );

    if(error.value) return

    user.value = response;
}

const handleOK = async () => {
    if(!cpassword.value || !npassword.value) {
        toast.add({severity:'error', summary:'Erro', detail:'Preencha todos os campos!', life: 3000});
        return
    }

    const result = await ConfirmSwal()
    if(!result.isConfirmed) return

    await update();
}

const update = async () => {
    const data = await executeRequest(
        () => UserServices.updatePassword(user.value, cpassword.value, npassword.value),
        'Utilizador actualizado com sucesso!',
        'Erro ao actualizar o utilizador!'
    );

    if(error.value) return

    emit('updated', data);
    handlehidden();
    reset();
}

const reset = () => {
    user = ref(null);
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
    <Dialog v-model:visible="visible" modal header="Palavra Passe" :style="{ width: '30rem' }" 
        @beforeClose="handleCancel"
    >
        <div v-if="user" class="flex flex-col gap-3 items-center w-full">
            <div class="flex flex-col gap-1 w-full">
                <label for="password" class="text-sm">
                    Palavra passe actual <span class="text-red-600">*</span>
                </label>

                <Password id="password" name="password" v-model="cpassword" 
                    class="h-9 w-full" toggleMask placeholder="Palavra passe actual"
                />
            </div>

            <div class="flex flex-col gap-1 w-full">
                <label for="password" class="text-sm">
                    Palavra passe nova<span class="text-red-600">*</span>
                </label>

                <Password id="password" name="password" v-model="npassword" 
                    class="h-9 w-full" toggleMask placeholder="Palavra passe nova"
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