<script lang="ts" setup>
import { ref } from 'vue';
import SpeakerServices from '@/services/SpeakerServices';
import Swal from 'sweetalert2';
import { useToast } from 'primevue/useToast';
import { useRoute } from 'vue-router';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import EventServices from '@/services/EventServices';

const $route = useRoute();
const emit = defineEmits(['created']);
const $toast = useToast();

let visible = ref(false);
let busy = ref(false);
let eventId = $route.params.id;
let event = ref({
    data: {
        name: null
    },
    busy: false,
});

let speaker_event = ref({
    speakerId: null,
    eventId: $route.params.id.toString()
});

let speakers = ref({
    data: [],
    busy: false,
});

const show = () => {
    visible.value = true;
    fetchEvent();
    fetchSpeakers();
}

const fetchEvent = async () => {
    try {
        event.value.busy = true
        const response = await EventServices.show(eventId)

        if(response.status == 200){
            event.value.data = response.data
            return
        }

        handleErrorMessage()
    } catch (error) {
        console.error(error)
        handleErrorMessage(error)
    } finally {
        event.value.busy = false
    }
}

const fetchSpeakers = async () => {
    try {
        speakers.value.busy = true
        const response = await SpeakerServices.index()

        if(response.status == 200){
            speakers.value.data = response.data
            return
        }

        handleErrorMessage()
    } catch (error) {
        console.error(error)
        handleErrorMessage(error)
    } finally {
        speakers.value.busy = false
    }
}

const handleStore = async () => {
    try {
        if(!verifyRequiredFields()) {
            handleErrorMessage('Preencha todos os campos obrigatórios');
            return;
        };

        const result = await Swal.fire({
            title: '',
            text: 'Tem a certeza?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, Tenho',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#CBD5E1',
            reverseButtons: true,
        })

        if(!result.isConfirmed) return;

        busy.value = true;
        const response = await SpeakerServices.addSpeakerToEvent(speaker_event.value.eventId, speaker_event.value.speakerId)

        if(response && response?.status === 201){
            $toast.add({severity: 'success', summary: 'Success', detail: 'Palestrante criada com sucesso', life: 2000})
            emit('created')
            handlehidden()
            reset();
            return
        }else{
            console.log(response)
        }

        handleErrorMessage()
    }catch (error) {
        console.log(error);
        handleErrorMessage()
    } finally {
        busy.value = false;
    }
}

const verifyRequiredFields = () => {
    return speaker_event.value.eventId && speaker_event.value.speakerId
}

const handleErrorMessage = (message = 'Erro ao criar o palestrante') => {
    $toast.add({severity: 'error', summary: 'Error', detail: message, life: 2000})
}

const reset = () => {
    speaker_event = ref({
        speakerId: null,
        eventId: null
    });
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
        <div class="flex flex-col gap-3">
            <div>
                <label for="event" class="text-sm">
                    Evento
                </label>
                <InputText id="event" name="event" v-model="event.data.name" class="w-full h-9" readonly />
            </div>

            <div>
                <label for="event" class="text-sm">
                    Palestrante <span class="text-red-600">*</span>
                </label>
                
                <Dropdown v-model="speaker_event.speakerId" :options="speakers.data" optionLabel="name" optionValue="id" placeholder="Selecione um palestrante" class="w-full h-9">
                    <template #value="slotProps">
                        <div v-if="slotProps.value" class="flex items-center text-black">
                            {{ speakers.data.find(spk => spk.id === slotProps.value).name }}
                        </div>
                        <div v-else>
                            {{ slotProps.placeholder }}
                        </div>
                    </template>
                    
                    <template #option="{ option }">
                        <div class="flex items-center gap-2 text-sm">
                            <img :src="option.imageURL" alt="avatar" class="w-8 h-8 rounded-full" />
                            <span>{{ `${option.name} | ${option.email}` }}</span>
                        </div>
                    </template>
                </Dropdown>
            </div>
        </div>

        <template #footer>
            <div class="flex gap-3 justify-end">
                <Button severity="secondary" text @click="handleCancel" size="small" class="h-9">
                    <i class="fa fa-times mr-1"/> Cancelar
                </Button>
                <Button @click="handleStore" size="small" class="h-9" :loading="busy">
                    <i class="fas fa-spinner animate-spin mr-1" v-if="busy" />
                    <i class="fa fa-save mr-1"/> {{ busy ? 'Salvando...' : 'Salvar' }}
                </Button>
            </div>
        </template>
    </Dialog>
</template>