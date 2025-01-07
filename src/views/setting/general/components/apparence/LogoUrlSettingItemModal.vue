<script setup lang="ts">
import { ref, defineModel } from 'vue';
import { useRequest } from '@/composables/useRequest';
import { useToast } from 'primevue/useToast';
import SettingService from '@/services/SettingService';
import { useUploadImage } from '@/composables/useUploadImage';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Image from 'primevue/image';
import { ConfirmSwal } from '@/helpers/fireSwal';

defineModel('busy', { type: Boolean });
const emit = defineEmits(['update:busy', 'update:settingItem', 'hidden', 'reset']);
const props = defineProps(['setting']);

const $toast = useToast();
const { upload } = useUploadImage();

const file = ref<File | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const imageUrl = ref<string | null>(props.setting.value);

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        file.value = target.files[0];
        imageUrl.value = URL.createObjectURL(file.value);
    }
};

const triggerFileInput = () => {
    if (fileInputRef.value) {
        fileInputRef.value.click();
    }
};

const handleUpdate = async () => {
    if(!file.value) return

    const result = await ConfirmSwal()
    if(!result.isConfirmed) return

    emit('update:busy', true);
    const imageUrl = await upload(file.value);
    if(!imageUrl) {
        emit('update:busy', false);
        return
    }

    update(imageUrl)
}

const update = async (imageUrl: string) => {
    try {
        const data = { ...props.setting, value: imageUrl }
        const response = await SettingService.updateGroupItem(data);

        if(response.status < 200 || response.status > 299 || response.data?.error) {
            throw new Error(response.data?.error || 'Erro ao atualizar configuração');
        }

        emit('update:settingItem', response.data);
    } catch (error) {
        handlerErrorMessage(error);
    } finally {
        emit('update:busy', false);
    }
}

const handleMessage = (message: string = 'Operação concluida', type: 'success'|'error' = 'success') => {
    $toast.add({ severity: type, summary: type, detail: message, life: 3000 });
};

const handlerErrorMessage = (error: string) => {
    console.error(error);
    handleMessage('Operação não concluida', 'error');
};

defineExpose({ handleUpdate });
</script>

<template>
    <div class="flex justify-center items-center w-full relative">
        <Image v-if="imageUrl" :src="imageUrl" :alt="props.setting.key" class="w-full max-w-[310px] h-full" />

        <Avatar 
            v-else icon="fa fa-university" shape="circle" size="large" 
            class="cursor-pointer hover:scale-110 transform transition-transform"
        />

        <div class="w-full flex items-end justify-end mt-4 absolute bottom-0 right-2">
            <Button 
                icon="pi pi-pencil text-black"
                text size="small"
                class="text-black" rounded
                @click="triggerFileInput"
                :title="`Alterar ${props.setting.label}`"
            />
            <input 
                type="file" 
                class="hidden" 
                ref="fileInputRef" 
                @change="handleFileChange"
            />
        </div>
    </div>
</template>