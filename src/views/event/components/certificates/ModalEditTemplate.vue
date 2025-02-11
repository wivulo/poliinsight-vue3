<script setup>
import { ref, computed, reactive } from 'vue'
import { useNotification } from '@/composables/useNotification'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router';
import CertificatesServices from '@/services/CertificatesServices';
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import { SwalConfirmAlert } from '@/helpers/swalConfirmAlert';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';


const emit = defineEmits(['updated']);
const { notifyError, notifySuccess } = useNotification()
const store = useStore()
const router = useRouter()
const route = useRoute()

const visible = ref(false)
const files = ref([])
const busy = ref(false)
const inputFileRef = ref(null)

const template = reactive({
    id: null,
    eventId: null,
    name: null,
    type: null,
})

const certificatesType = ref([
    'Certificado Geral',
    'Certificado Especial',
    'Certificado de Mérito',
    'Certificado de Participação'
])

const show = (data) => {
    visible.value = true
    if (data) {
        template.id = data.id
        template.name = data.name
        template.type = data.type
    }
    template.eventId = router.currentRoute.value.params.id
}

const hide = () => {
    visible.value = false
}

const reset = () => {
    files.value = []
    template.id = null
    template.name = null
    template.type = null
    template.eventId = null
}

const handleCancel = () => {
    hide()
    reset()
}

const handleOK = async () => {
    try {
        if (!await SwalConfirmAlert()) return;

        busy.value = true;
        const response = await CertificatesServices.templateUpdate(template, files.value && files.value[0])
        if (response.status === 200) {
            notifySuccess('Template carregado com sucesso!');
            emit('updated');
            handleCancel();
            return;
        }

        throw new Error()
    } catch (error) {
        console.error(error)
        notifyError(error)
    } finally {
        busy.value = false
    }
}

const onFileChange = (e) => {
    files.value = e.target.files
}

const handleClearFiles = () => {
    files.value = []
}

defineExpose({
    show
})
</script>

<template>
    <Dialog v-model:visible="visible" header="Templates" :modal="true" :style="{ width: '30rem' }">
        <div class="flex flex-col gap-2 w-full">
            <label for="name">
                <i class="fa mr-1" /> Nome
            </label>

            <InputText id="name" v-model="template.name" class="w-full" placeholder="Nome do template" />
        </div>

        <div class="flex flex-col gap-2 my-3">
            <label for="types">
                Tipo do certificado
            </label>
            <Dropdown id="types" v-model="template.type" :options="certificatesType" class="p-0 py-1 h-9 w-full" />
        </div>

        <div id="FileUpload">
            <div class="wrapper">
                <div class="upload">
                    <label for="template">
                        <p><i class="pi pi-cloud-upload mr-2" /> Large o ficheiro aqui or <span
                                class="upload__button">Procurar</span></p>
                    </label>

                    <input id="template" type="file" ref="inputFileRef" @change="onFileChange" class="hidden"
                        accept=".docx">
                </div>

                <div v-if="files.length" class="uploaded uploaded--one overflow-hidden">
                    <template v-for="file in files">
                        <i class="far fa-file-word"></i>
                        <div class="file relative w-full">
                            <div class="file__name">
                                <p class="text-xs break-words">{{ file.name }}</p>
                            </div>

                            <div class="progress">
                                <div class="progress-bar bg-success progress-bar-striped progress-bar-animated"
                                    style="width:100%"></div>
                            </div>

                            <i class="fas fa-times absolute right-2 self-center" @click="handleClearFiles"></i>
                        </div>
                    </template>
                </div>
            </div>
        </div>

        <template #footer>
            <div class="flex gap-3 justify-end">
                <Button severity="secondary" text @click="handleCancel" size="small" class="h-8">
                    <i class="fa fa-times mr-1" /> Cancelar
                </Button>
                <Button @click="handleOK" size="small" class="h-8" :loading="busy">
                    <i class="fas fa-spinner animate-spin mr-1" v-if="busy" />
                    <i class="fa fa-save mr-1" /> {{ busy ? 'Salvando...' : 'Salvar' }}
                </Button>
            </div>
        </template>
    </Dialog>
</template>

<style scoped>
/* === Wrapper Styles === */
#FileUpload {
    display: flex;
    justify-content: center;
}

.wrapper {
    padding: 10px 0;
    border-radius: 10px;
    width: 100%
}

/* === Upload Box === */
.upload {
    margin: 10px 0;
    height: 85px;
    border: 3px dashed #e6f5e9;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
}

.upload p {
    margin-top: 12px;
    line-height: 0;
    font-size: 14px;
    color: #0c3214;
    letter-spacing: 1.5px;
}

.upload__button {
    background-color: #e6f5e9;
    border-radius: 10px;
    padding: 0px 8px 0px 10px;
}

.upload__button:hover {
    cursor: pointer;
    opacity: 0.8;
}

/* === Uploaded Files === */
.uploaded {
    width: 100%;
    background-color: #e6f5e9;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.file {
    display: flex;
    flex-direction: column;
}

.file__name {
    display: flex;
    width: 100%;
    line-height: 0;
    color: #0c3214;
    font-size: 18px;
    letter-spacing: 1.5px;
    position: relative;
}

.fa-times:hover {
    cursor: pointer;
    opacity: 0.8;
}

.fa-file-word {
    padding: 15px;
    font-size: 40px;
    color: #0c3214;
}
</style>