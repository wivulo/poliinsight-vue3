<script lang="ts" setup>
import { ref, reactive } from 'vue';
import SpeakerServices from '@/services/SpeakerServices';
import { useToast } from 'primevue/useToast';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { ConfirmSwal } from '@/helpers/fireSwal';
import FileUploader from '@/components/FileUploader.vue';
import Textarea from 'primevue/textarea';
import { useRequest } from '@/composables/useRequest';

const emit = defineEmits(['updated']);
const { busy, executeRequest, error } = useRequest();

let visible = ref(false);

let speakerId = ref(null);
let speaker = reactive({
    name: null,
    email: null,
    phone: null,
    description: null
});

const show = (id) => {
    visible.value = true;
    speakerId.value = id;
    fetchSpeaker(id);
}

const fetchSpeaker = async (id) => {
    const data = await executeRequest(
        () => SpeakerServices.show(id),
        null,
        'Erro ao buscar palestrante!'
    )

    if(error.value) return

    speaker.name = data?.name
    speaker.email = data?.email
    speaker.phone = data?.phone
    speaker.description = data?.description
}

const handleOk = async () => {
    if(verifyRequiredFields()){
        return
    }

    const result = await ConfirmSwal()
    if(!result.isConfirmed) return

    const data = await executeRequest(
        () => SpeakerServices.update(speakerId.value, speaker), 
        'Palestrante actualizado com sucesso!', 
        'Erro ao actualizar palestrante!'
    )

    if(error.value) return

    console.log(data)
    emit('updated')
    handlehidden()
    reset()
}

const verifyRequiredFields = () => {
    return !speaker.name || !speaker.email || !speaker.phone
}

const reset = () => {
    speaker.name = null
    speaker.email = null
    speaker.phone = null
    speaker.description = null
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
    <Dialog v-model:visible="visible" modal header="Palestrante" :style="{ width: '35rem' }">
        <div class="flex gap-3">
            <div class="w-full">
                <div class="flex flex-col gap-3">
                    <div class="flex flex-col gap-1">
                        <label for="name" class="text-sm">
                            Nome <span class="text-red-600">*</span>
                        </label>
                        <InputText id="name" name="name" v-model="speaker.name" placeholder="Ex.: Valtercio Ivulo" class="h-9" />
                    </div>

                    <div class="flex flex-col gap-1">
                        <label for="email" class="text-sm">
                            Email <span class="text-red-600">*</span>
                        </label>
                        <InputText id="email" name="email" v-model="speaker.email" placeholder="Ex.: vivulo@gmail.com" class="h-9"/>
                    </div>
                    
                    <div class="flex flex-col gap-1">
                        <label for="phone" class="text-sm">
                            Contacto <span class="text-red-600">*</span>
                        </label>
                        <InputText id="phone" name="phone" v-model="speaker.phone" placeholder="Ex.: 92xxxxxxx" class="h-9"/>
                    </div>
                    
                    <div class="flex flex-col gap-1">
                        <label for="description" class="text-sm">
                            Biográfia
                        </label>
                        
                        <Textarea id="description" nmae="description" v-model="speaker.description" placeholder="Descrição" class="hover:border-slate-300" rows="3"/>
                    </div>
                </div>
            </div>
        </div>

        <template #footer>
            <div class="flex gap-3 justify-end">
                <Button severity="secondary" text @click="handleCancel" size="small" class="h-8">
                    <i class="fa fa-times mr-1"/> Cancelar
                </Button>
                <Button @click="handleOk" size="small" class="h-8" :loading="busy">
                    <i class="fas fa-spinner animate-spin mr-1" v-if="busy" />
                    <i class="fa fa-save mr-1"/> {{ busy ? 'Editando...' : 'Editar' }}
                </Button>
            </div>
        </template>
    </Dialog>
</template>