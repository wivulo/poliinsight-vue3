<script lang="ts" setup>
import { ref, reactive } from 'vue';
import ActivityServices from '@/services/ActivityServices';
import { useNotification } from '@/composables/useNotification';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import { SwalConfirmAlert } from '@/helpers/swalConfirmAlert';

const emit = defineEmits(['created']);
const { notifyError, notifySuccess } = useNotification();

let visible = ref(false);
let busy = ref(false);
let submited = ref(false);
let activityType = reactive({
    name: null,
    description: null,
});

function show() {
    visible.value = true;
}

function handleHidden() {
    visible.value = false;
}

function handleReset() {
    busy.value = false;
    activityType = reactive({
        name: null,
        description: null,
    })
}

function handleCancel() {
    handleHidden();
    handleReset()
}

function handleOK() {
    submited.value = true;
    if(activityType.name === null) return;
    store();
}

async function store() {
    try {
        if(!await SwalConfirmAlert()) return;

        busy.value = true;
        const response = await ActivityServices.storeActivityType(activityType);
        if(response.status === 201 || response.status === 200) {
            notifySuccess('Tipo de actividade criada com sucesso!');
            emit('created', response.data);
            handleCancel();
            return;
        }

        notifyError('Erro ao criar tipo de actividade!');
    } catch (error) {
        console.error(error);
        notifyError('Erro ao criar tipo de actividade!');
    } finally {
        busy.value = false;
    }
}

//expor a função show para ser usada no componente pai
defineExpose({ show });
</script>

<template>
    <Dialog v-model:visible="visible" modal header="Novo Tipo de Actividade" :style="{ width: '20rem' }">
        
        <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-1">
                <label for="name">Nome</label>
                <InputText v-model="activityType.name" id="name" class="h-9" 
                    placeholder="Ex.: Apresentação, Palestra, Workshop, etc."
                />
            </div>

            <div class="flex flex-col gap-1">
                <label for="description">
                    Descrição <span class="text-xs text-zinc-400">(opcional)</span>
                </label>
                <Textarea v-model="activityType.description" id="description" rows="3" 
                    class="hover:border-zinc-300" placeholder="Ex.: Apresentação de dança Tchianda"
                />
            </div>
        </div>

        <template #footer>
            <div class="flex gap-3 justify-endTime">
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