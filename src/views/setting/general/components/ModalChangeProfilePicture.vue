<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useToast } from 'primevue/useToast';
import UserServices from '@/services/UserServices';
import { useRequest } from '@/composables/useRequest';
import { usePrimeVue } from 'primevue/config';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
// import FileUploader from '@/components/FileUploader.vue';
import FileUpload from 'primevue/fileupload';
import ProgressBar from 'primevue/progressbar';
import Badge from 'primevue/badge';
import { ConfirmSwal } from '@/helpers/fireSwal';

const emit = defineEmits(['updated']);
const {busy, executeRequest} = useRequest();
const { busy:fetchBusy, executeRequest:fetchUser, error } = useRequest();
const $primevue = usePrimeVue();

let visible = ref(false);

let user = ref(null);
const totalSize = ref(0);
const totalSizePercent = ref(0);
const file = ref([]);

const show = (userId: string) => {
    visible.value = true;
    handleFetchUser(userId);
}

const handleFetchUser = async (userId: string) => {
    user = await fetchUser(
        () => UserServices.show(userId),
        null,
        'Erro ao buscar o usuário'
    );
}

const updateProfilePicture = async (file: File) => {
    const data = await executeRequest(
        () => UserServices.update(user, file),
        'Foto de perfil actualizada',
        'Erro ao actualizar a foto de perfil'
    );

    if(error.value) return

    emit('updated', data);
    handlehidden();
    reset();
}

const handlehidden = () => {
    visible.value = false;
}

const reset = () => {
    user = ref(null);
    totalSize.value = 0;
    totalSizePercent.value = 0;
    file.value = [];
};

const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
    removeFileCallback(index);
    totalSize.value -= parseInt(formatSize(file.size));
    totalSizePercent.value = totalSize.value / 10;
};

const onClearTemplatingUpload = (clear) => {
    clear();
    totalSize.value = 0;
    totalSizePercent.value = 0;
};

const onSelectedFiles = (event) => {
    file.value = event.files;
    file.value.forEach((file) => {
        totalSize.value += parseInt(formatSize(file.size));
    });
};

const uploadEvent = async (files: Array<File>, callback) => {
    const file = files[0];
    if(!file) return

    const result = await ConfirmSwal()
    if(!result.isConfirmed) return

    totalSizePercent.value = totalSize.value
        
    updateProfilePicture(file);
};

const formatSize = (bytes: number) => {
    const k = 1024;
    const dm = 3;
    const sizes = $primevue.config.locale.fileSizeTypes;

    if (bytes === 0) {
        return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
};

//expor a função show para ser usada no componente pai
defineExpose({ show });
</script>

<template>
    <Dialog v-model:visible="visible" modal header="Foto de Perfil" :style="{ width: '35rem' }">
        <FileUpload name="demo[]" url="/api/upload" accept="image/*" :maxFileSize="1000000" @select="onSelectedFiles">
            <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
                <div class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2">
                    <div class="flex gap-2">
                        <Button size="small" @click="chooseCallback()" icon="fa fa-images" rounded text title="Clica para carregar a foto"></Button>
                        <Button size="small" @click="uploadEvent(files, uploadCallback)" icon="pi pi-cloud-upload" rounded text severity="success" :disabled="!files || files.length === 0" title="Clica para fazer o upload da foto" :loading="busy"></Button>
                        <Button size="small" @click="clearCallback()" icon="fa fa-times" rounded text severity="danger" :disabled="!files || files.length === 0" title="Clica para eliminar a foto"></Button>
                    </div>
                    <ProgressBar :value="totalSizePercent" :showValue="false" :class="['md:w-20rem h-1rem w-full md:ml-auto', { 'exceeded-progress-bar': totalSizePercent > 100 }]"
                        ><span class="white-space-nowrap">{{ totalSize }}B / 1Mb</span></ProgressBar
                    >
                </div>
            </template>

            <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
                <div v-if="files.length > 0">
                    <h5>Pendente</h5>
                    <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                        <div v-for="(file, index) of files" :key="file.name + file.type + file.size" class="card m-0 px-6 flex border-1 surface-border items-center gap-3">
                            <div>
                                <img role="presentation" :alt="file.name" :src="file.objectURL" width="100" height="50" />
                            </div>
                            <span class="font-semibold">{{ file.name }}</span>
                            <div>{{ formatSize(file.size) }}</div>
                            <Badge value="Pendente" severity="warning" />
                            <Button icon="fa fa-times" @click="onRemoveTemplatingFile(file, removeFileCallback, index)" text rounded  severity="danger" size="small" />
                        </div>
                    </div>
                </div>

                <div v-if="uploadedFiles.length > 0">
                    <h5>Completo</h5>
                    <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                        <div v-for="(file, index) of uploadedFiles" :key="file.name + file.type + file.size" class="card m-0 px-6 flex flex-col border-1 surface-border items-center gap-3">
                            <div>
                                <img role="presentation" :alt="file.name" :src="file.objectURL" width="100" height="50" />
                            </div>
                            <span class="font-semibold">{{ file.name }}</span>
                            <div>{{ formatSize(file.size) }}</div>
                            <Badge value="Completed" class="mt-3" severity="success" />
                            <Button icon="fa fa-times" @click="removeUploadedFileCallback(index)" outlined rounded  severity="danger" />
                        </div>
                    </div>
                </div>
            </template>
            
            <template #empty>
                <div class="flex items-center justify-center flex-column">
                    <i class="pi pi-cloud-upload p-5 text-8xl text-400 border-400" />
                    <p class="mt-4 mb-0">Arrasta e larga para carregar uma foto</p>
                </div>
            </template>
        </FileUpload>
    </Dialog>
</template>