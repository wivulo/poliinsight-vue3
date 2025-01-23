<script lang="ts" setup>
import { ref, reactive } from 'vue';
import EventServices from '@/services/EventServices';
import EventStatusServices from '@/services/EventStatusServices';
import { useNotification } from '@/composables/useNotification';
import { useRoute } from 'vue-router';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import { SwalConfirmAlert } from '@/helpers/swalConfirmAlert';

const emit = defineEmits(['updated']);
const { notifyError, notifySuccess } = useNotification();
const route = useRoute();

let visible = ref(false);
let busy = ref(false);
let status_busy = ref(false);
const statusId = ref(null);
const status = ref([]);
function show() {
    visible.value = true;
    fetchStatus();
}

function handleHidden() {
    visible.value = false;
}

function handleReset() {
    busy.value = false;
}

function handleCancel() {
    handleHidden();
    handleReset()
}

async function handleOK() {
    if(!statusId.value) {
        notifyError('Selecione um estado para o evento');
        return;
    }

    if(!await SwalConfirmAlert()) {
        return;
    }

    update();
}

async function update() {
    try {
        busy.value = true;
        const response = await EventServices.changeStatus(route.params.id, statusId.value.id);
        if(response.status === 200) {
            notifySuccess('Estado do evento alterado com sucesso');
            emit('updated');
            handleCancel();
            return;
        }

        throw new Error();
    } catch (error) {
        notifyError('Erro ao mudar o estado do evento');
        console.error(error);
    } finally {
        busy.value = false;
    }
}

async function fetchStatus() {
    try {
        status_busy.value = true;
        const response = await EventStatusServices.index();
        if(response.status === 200) {
            status.value = response.data;
            return;
        }

        notifyError();
    } catch (error) {
        console.error(error);
        notifyError('Erro ao buscar os estados de evento');
    } finally {
        status_busy.value = false;
    }
}

//expor a função show para ser usada no componente pai
defineExpose({ show });
</script>

<template>
    <Dialog v-model:visible="visible" modal header="Mudar Estado do Evento" :style="{ width: '20rem' }">
        
        <div class="flex flex-col gap-3">
            <Dropdown v-model="statusId" :options="status" optionLabel="name"
                placeholder="Seleciona o novo estado" class="w-full" :loading="status_busy"
            />
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