<script lang="ts" setup>
import { ref, reactive } from 'vue';
import SpeakerServices from '@/services/SpeakerServices';
import { useToast } from 'primevue/usetoast';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { ConfirmSwal } from '@/helpers/fireSwal';
import FileUploader from '@/components/FileUploader.vue';
import Textarea from 'primevue/textarea';
import { useRequest } from '@/composables/useRequest';

const emit = defineEmits(['created']);
const {busy, executeRequest, error} = useRequest();

let visible = ref(false);

let speaker = reactive({
    name: null,
    email: null,
    phone: null,
    description: null,
    photo: null,
    imageURL: null,
});

const show = () => {
    visible.value = true;
}

const handleStore = async () => {
    if(verifyRequiredFields()){
        return
    }

    const result = await ConfirmSwal()
    if(!result.isConfirmed) return

    const data = await executeRequest(
        () => SpeakerServices.store(speaker), 
        'Palestrante cadastrado com sucesso!', 
        'Erro ao cadastrar palestrante!'
    )

    if(error.value) return

    console.log(data)
    emit('created', data)
    handlehidden()
    reset()
}

const handleUploadedFile = (file: any) => {
    speaker.photo = file
}

const verifyRequiredFields = () => {
    return !speaker.name || !speaker.email || !speaker.phone
}

const reset = () => {
    speaker.name = null
    speaker.email = null
    speaker.phone = null
    speaker.description = null
    speaker.photo = null
    speaker.imageURL = null
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
    <Dialog v-model:visible="visible" modal header="Palestrante" :style="{ width: '45rem' }">
        <div class="flex gap-3">
            <div class="max-w-[40%] max-h-[314px]">
                <FileUploader :minw="380" :minh="500" @uploaded="handleUploadedFile" class="h-[314px]" />
            </div>

            <div class="w-[60%]">
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
                <Button @click="handleStore" size="small" class="h-8" :loading="busy">
                    <i class="fas fa-spinner animate-spin mr-1" v-if="busy" />
                    <i class="fa fa-save mr-1"/> {{ busy ? 'Salvando...' : 'Salvar' }}
                </Button>
            </div>
        </template>
    </Dialog>
</template>