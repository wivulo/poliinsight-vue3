<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useToast } from 'primevue/useToast';
import CategoryService from '@/services/CategoryService';
import { useRequest } from '@/composables/useRequest';
import { useNotification } from '@/composables/useNotification';
import { SwalConfirmAlert } from '@/helpers/swalConfirmAlert';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';

const emit = defineEmits(['updated']);
const { notifyError, notifySuccess } = useNotification()

let category = ref({
    name: null,
    description: null
});
let busy = ref(false);
let visible = ref(false);
function show() {
    visible.value = true;
}

function handleOK(){
    if(!category.value.name || !category.value.description){
        notifyError('Preencha todos os campos');
        return;
    }
    store()
}

async function store(){
    try {
        if(!await SwalConfirmAlert()) return

        busy.value = true
        const response = await CategoryService.store(category.value)
        if(response.status === 201){
            notifySuccess('Categoria criada com sucesso')
            emit('updated')
            handleHidden()
            reset()
        }
    } catch (error) {
        console.error(error)
        notifyError()
    } finally {
        busy.value = false
    }
}

function handleHidden(){
    visible.value = false;
}

function handleCancel(){
    reset()
    handleHidden()
}

function reset(){
    category = ref({
        name: null,
        description: null
    });
}

//expor a função show para ser usada no componente pai
defineExpose({ show });
</script>

<template>
    <Dialog v-model:visible="visible" modal header="Categoria" :style="{ width: '35rem' }">

        <div class="flex flex-col gap-3 items-center w-full">
            <div class="flex flex-col gap-1 w-full">
                <label for="name" class="text-sm">
                    Nome <span class="text-red-600">*</span>
                </label>
                <InputText v-model="category.name" id="name" type="text" class="w-full h-9 text-sm" />
            </div>

            <div class="flex flex-col gap-1 w-full">
                <label for="description" class="text-sm">
                    Descrição
                </label>
                <Textarea rows="3" v-model="category.description" id="description" class="w-full hover:border-zinc-300 text-sm" />
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