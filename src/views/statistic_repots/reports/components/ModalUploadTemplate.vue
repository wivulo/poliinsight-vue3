<script setup>
import { ref, computed  } from 'vue'
import { useNotification } from '@/composables/useNotification'
import { useStore } from 'vuex'
import ReportsServices from "@/services/ReportsServices.js"
import EventServices from '@/services/EventServices';
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import { SwalConfirmAlert } from '@/helpers/swalConfirmAlert';
import InlineMessage from 'primevue/inlinemessage';
import Dropdown from 'primevue/dropdown';

const emit = defineEmits(['created']);
const { notifyError, notifySuccess } = useNotification()
const store = useStore()

const user = computed(() => store.getters['auth/user'])
const visible = ref(false)
const files = ref([])
const busy = ref(false)
const inputFileRef = ref(null)
const events = ref({
    busy: false,
    data: [],
})

const event = ref({
    busy: false,
    eventId: null,
    data: null,
})

const reportTypes = ref({
    data: [
        { label: 'Relatório Geral do evento', value: 'general' },
        { label: 'Relatório Financeiro', value: 'financial' },
        { label: 'Relatório de Participação', value: 'participants' },
    ],
    selected: null,
})

const show = () => {
  visible.value = true
  fetchEvents()
}

const hide = () => {
  visible.value = false
}

const reset = () => {
  files.value = []
}

const handleCancel = () => {
    hide()
    reset()
}

const handleOK = async () => {
    try {
        if(!files.value.length) {
            notifyError('Por favor, selecione um ficheiro para fazer o upload!')
            return
        }

        if(!await SwalConfirmAlert()) return;

        busy.value = true;
        const response = await ReportsServices.storeTemplate(event.value.eventId, reportTypes.value.selected, files.value[0])
        if(response.status === 201) {
            notifySuccess('Template carregado com sucesso!');
            emit('created');
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
    console.log(files)
}

const handleClearFiles = () => {
    files.value = []
}

const fetchEvents = async () => {
    try {
        events.value.busy = true
        const response = await EventServices.fetchEventsOrganizer(user.value.id)
        if(response.status === 200) {
            events.value.data = response.data
            return
        }

        throw new Error()
    } catch (error) {
        console.error(error)
        notifyError(error)
    } finally {
        events.value.busy = false
    }
}

defineExpose({
  show
})
</script>

<template>
    <Dialog v-model:visible="visible" header="Templates para Relatórios" :modal="true" :style="{width: '30rem'}">
        <div class="flex flex-col gap-2 w-full">
            <label for="events">
                <i class="fa mr-1" /> Evento
            </label>

            <Dropdown
                id="events"
                v-model="event.eventId"
                :options="events.data" 
                class="p-0 py-1 h-9 w-full"
                optionLabel="name"
                optionValue="id"
            >
                <template #value="props">
                    <div v-if="props.value" class="flex align-items-center text-sm">
                        <div class="text-slate-800">{{ events.data?.find(event => event.id === props.value)?.name }}</div>
                    </div>
                    <div v-else class="flex items-center text-sm">
                        Selecione um evento
                    </div>
                </template>

                <template #option="{ option }">
                    <div class="h-2 text-sm flex items-center text-zinc-700 py-2 w-full">
                        {{ option.name }}
                    </div>
                </template>

                <template #dropdownicon>
                    <i class="fa fa-chevron-down text-black text-sm"/>
                </template>
            </Dropdown>
        </div>

        <div class="flex flex-col gap-2 my-3">
            <label for="types">
                Tipo de Relatório
            </label>
            <Dropdown
                id="types"
                v-model="reportTypes.selected"
                :options="reportTypes.data" 
                class="p-0 py-1 h-9 w-full"
                optionLabel="label"
                optionValue="value"
            >
                <template #value="props">
                    <div v-if="props.value" class="flex align-items-center text-sm">
                        <div class="text-slate-800">
                            {{ reportTypes.data.find(report => report.value === props.value)?.label }}
                        </div>
                    </div>
                    <div v-else class="flex items-center text-sm">
                        Selecione um tipo
                    </div>
                </template>

                <template #option="{ option }">
                    <div class="h-2 text-sm flex items-center text-zinc-700 py-2 w-full">
                        {{ option.label }}
                    </div>
                </template>

                <template #dropdownicon>
                    <i class="fa fa-chevron-down text-black text-sm"/>
                </template>
            </Dropdown>
        </div>
        
        <div id="FileUpload">
            <div class="wrapper">
                <div class="upload">
                    <label for="template">
                        <p><i class="pi pi-cloud-upload mr-2" /> Large o ficheiro aqui or <span class="upload__button">Procurar</span></p>
                    </label>

                    <input id="template" type="file" ref="inputFileRef" @change="onFileChange" class="hidden"
                        accept=".docx" >
                </div>

                <div v-if="files.length" class="uploaded uploaded--one overflow-hidden">
                    <template v-for="file in files">
                        <i class="far fa-file-word"></i>
                        <div class="file relative w-full">
                            <div class="file__name">
                                <p class="text-xs break-words">{{ file.name}}</p>
                            </div>

                            <div class="progress">
                                <div class="progress-bar bg-success progress-bar-striped progress-bar-animated" style="width:100%"></div>
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