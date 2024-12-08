<script lang="ts" setup>
import { ref, reactive } from 'vue';
import SpeakerServices from '@/services/SpeakerServices';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import { useRequest } from '@/composables/useRequest';
import BlockUI from 'primevue/blockui';
import ProgressSpinner from 'primevue/progressspinner';

const emit = defineEmits(['deleted']);
const {busy, executeRequest, error} = useRequest();

let visible = ref(false);

let speaker = reactive({
    id: null,
    name: null,
});

const show = (id) => {
    visible.value = true;
    fetchSpeaker(id);
}

const fetchSpeaker = async (id) => {
    const data = await executeRequest(
        () => SpeakerServices.show(id),
        null,
        'Erro ao buscar palestrante!'
    )

    if(error.value) return

    console.log(data)
    speaker.id = data?.id
    speaker.name = data?.name
}

const handleOk = async () => {
    await executeRequest(
        () => SpeakerServices.delete(speaker.id),
        'Palestrante eliminado com sucesso!',
        'Erro ao eliminar palestrante!'
    )

    if(error.value) return

    emit('deleted')
    handlehidden()
    reset()
}

const reset = () => {
    speaker.name = null
}

const handlehidden = () => {
    visible.value = false;
}

const handleCancel = () => {
    handlehidden()
    reset()
}

//expor a função show para ser usada no componente pai
defineExpose({ show });
</script>

<template>
    <Dialog v-model:visible="visible" modal header="Palestrante" :style="{ width: '30rem' }">
        <BlockUI :blocked="busy">
            <div class="flex justify-center items-center">
                <ProgressSpinner v-if="busy" />

                <div v-else>
                    <p class="text-center">Tem certeza que deseja eliminar o palestrante</p>
                    <p class="text-center font-semibold mb-3">{{ speaker?.name }}?</p>
                </div>
            </div>
        </BlockUI>

        <template #footer>
            <div class="flex gap-3 justify-end">
                <Button severity="secondary" text @click="handleCancel" size="small" class="h-8">
                    <i class="fa fa-times mr-1"/> Cancelar
                </Button>
                <Button @click="handleOk" size="small" class="h-8" :loading="busy">
                    <i class="fas fa-spinner animate-spin mr-1" v-if="busy" />
                    <i class="fa fa-save mr-1"/> {{ busy ? 'Deletando...' : 'Deletar' }}
                </Button>
            </div>
        </template>
    </Dialog>
</template>