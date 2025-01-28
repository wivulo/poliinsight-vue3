<script lang="ts" setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import ActivityServices from '@/services/ActivityServices';
import EventServices from '@/services/EventServices';
import { useNotification } from '@/composables/useNotification';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
dayjs.locale('pt');
dayjs.extend(utc);
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import InputNumber from 'primevue/inputnumber';
import { SwalConfirmAlert } from '@/helpers/swalConfirmAlert';
import ModalNewActivityType from './ModalNewActivityType.vue';
import InlineMessage from 'primevue/inlinemessage';

const emit = defineEmits(['created']);
const { notifyError, notifySuccess } = useNotification();
const router = useRouter();

let visible = ref(false);
let busy = ref(false);
let submited = ref(false);
const event = ref({
    busy: false,
    data: null,
});
let activity = reactive({
    name: null,
    description: null,
    typeId: null,
    startTime: null,
    endTime: null,
    eventId: null,
    location: null,
    requires_registration: "Não",
    maxParticipants: null,
    targetAudience: 'Geral',
    date: null,
});

const rules = {
    name: { required },
    startTime: { required },
    endTime: { required },
    eventId: { required },
    location: { required },
    maxParticipants: { required },
    date: { required },
};

const v$ = useVuelidate(rules, activity);

const selectedActivityType = ref();
const activityTypesBusy = ref(false);
const activityTypes = ref([]);

function show() {
    visible.value = true;
    fetchActivityTypes()
    fetchEvent();
    activity.eventId = router.currentRoute.value.params.id;
}

function handleHidden() {
    visible.value = false;
}

function handleReset() {
    busy.value = false;
    activity = reactive({
        name: null,
        description: null,
        typeId: null,
        startTime: null,
        endTime: null,
        eventId: null,
        location: null,
        requires_registration: "Não",
        maxParticipants: null,
        targetAudience: 'Geral',
        date: null,
    })
    selectedActivityType.value = null;
    submited.value = false;
    v$.value.$reset();

}

function handleCancel() {
    visible.value = false;
    handleReset()
}

function handleOK() {
    submited.value = true;

    if(!activityDateIsValid(activity.date)) {
        return;
    }

    return !v$.value.$invalid && store();
}

async function store() {
    try {
        if(!await SwalConfirmAlert()) return;

        busy.value = true;
        
        activity.typeId = selectedActivityType.value?.id;
        
        const response = await ActivityServices.store(activity);
        if(response.status === 201 || response.status === 200) {
            notifySuccess('Actividade criada com sucesso!');
            emit('created');
            handleCancel();
            return;
        }

        notifyError();
    } catch (error) {
        console.error(error);
        notifyError('Erro ao criar actividade!');
    } finally {
        busy.value = false;
    }
}

const ModalNewActivityTypeRef = ref(null);
function handleShowModalNewActivityType() {
    ModalNewActivityTypeRef.value.show();
}

async function fetchActivityTypes(type = null) {
    try {
        activityTypesBusy.value = true;
        const response = await ActivityServices.findActivityTypes();
        if(response.status === 200) {
            activityTypes.value = response.data;
            if(type) {
                activity.typeId = activityTypes.value.find(t => t.id === type.id);
            }
            return;
        }

        notifyError('Erro ao buscar tipos de actividade!');
    } catch (error) {
        console.error(error);
        notifyError('Erro ao buscar tipos de actividade!');
    } finally {
        activityTypesBusy.value = false;
    }
}

const fetchEvent = async () => {
    try {
        event.value.busy = true;
        const response = await EventServices.show(router.currentRoute.value.params.id);
        if (response.status === 200) {
            event.value.data = response.data;
            return;
        }
        throw new Error();
    } catch (error) {
        console.error(error);
        notifyError('Erro ao buscar evento!');
    } finally {
        event.value.busy = false;
    }
};

function activityDateIsValid(value: Date) {
    const startEventDate = dayjs.utc(event.value.data?.startDate).date();
    const endEventDate = dayjs.utc(event.value.data?.endDate).date();
    const selectedDate = dayjs(value).date();

    if(selectedDate < startEventDate || selectedDate > endEventDate) {
        notifyError('Data inválida! A data da actividade deve estar dentro do período do evento.');
        return false;
    }

    return true;
}

//expor a função show para ser usada no componente pai
defineExpose({ show });
</script>

<template>
    <Dialog v-model:visible="visible" modal header="Nova actividade" :style="{ width: '30rem' }" class="text-sm">
        <ModalNewActivityType ref="ModalNewActivityTypeRef" @created="fetchActivityTypes" />
        <div class="flex flex-col gap-5">
            <div class="flex flex-col gap-1">
                <label for="name">Nome</label>
                <InputText v-model="activity.name" id="name" class="h-9" 
                    placeholder="Ex.: Apresentação Cultural"
                    :invalid="submited && v$.name.$invalid"
                />

                <InlineMessage severity="error" v-if="submited && v$.name.$invalid" class="text-xs">
                    O nome da actividade é obrigatório.
                </InlineMessage>
            </div>

            <div class="flex flex-col gap-1">
                <label for="description">
                    Descrição <span class="text-xs text-zinc-400">(opcional)</span>
                </label>
                <Textarea v-model="activity.description" id="description" rows="2" 
                    class="hover:border-zinc-300" placeholder="Ex.: Apresentação de dança Tchianda"
                />
            </div>

            <div class="flex flex-col gap-1">
                <label for="location">Local</label>
                <InputText v-model="activity.location" id="location" class="h-9" 
                    placeholder="Ex.: Auditório"
                    :invalid="submited && v$.location.$invalid"
                />

                <InlineMessage severity="error" v-if="submited && v$.location.$invalid" class="text-xs">
                    O local da actividade é obrigatório.
                </InlineMessage>
            </div>
            
            <div class="flex flex-col gap-1">
                <label for="typeId">Tipo</label>
                <div class="flex">
                    <Dropdown v-model="selectedActivityType" :options="activityTypes" optionLabel="name" 
                        placeholder="Seleciona um tipo de actividade" class="w-full rounded-r-none"
                    >
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="flex align-center text-slate-800">
                                <div>{{ slotProps.value.name }}</div>
                            </div>
                            <span v-else>
                                {{ slotProps.placeholder }}
                            </span>
                        </template>
                        <template #option="slotProps">
                            <div class="flex align-center">
                                <div>{{ slotProps.option.name }}</div>
                            </div>
                        </template>
                    </Dropdown>

                    <Button severity="secondary" icon="pi pi-plus text-black" 
                        class="h-9 rounded-l-none text-sm" 
                        title="Novo tipo de actividade" size="small"
                        @click="handleShowModalNewActivityType"
                    />
                </div>
            </div>
            
            <div class="flex gap-3 flex-wrap">
                <div class="mt-2 w-full">
                    <p class="text-xs">Qual será a duração?</p>
                </div>

                <div class="flex flex-col gap-1 w-full">
                    <label for="date">Data</label>
                    <Calendar
                        id="calendar" v-model="activity.date" 
                        manualInput showIcon iconDisplay="input"
                        class="h-9 overflow-hidden" placeholder="ex.: 01/12/2025"
                        :invalid="submited && v$.date.$invalid"
                    />

                    <InlineMessage severity="error" v-if="submited && v$.date.$invalid" class="text-xs">
                        A data da actividade é obrigatória.
                    </InlineMessage>
                </div>

                <div class="flex flex-col gap-1 w-[45%] mr-7">
                    <label for="startTime">Início</label>
                    <Calendar 
                        id="calendar-timeonly" v-model="activity.startTime" 
                        timeOnly hourFormat="24" manualInput showIcon iconDisplay="input"
                        class="h-9 overflow-hidden" placeholder="ex.: 08:00"
                        :invalid="submited && v$.startTime.$invalid"
                    />
                </div>
                
                <div class="flex flex-col gap-1 w-[45%]">
                    <label for="endTime">Fim</label>
                    <!-- <InputText v-model="activity.endTime" id="endTime" class="h-9" /> -->
                    <Calendar 
                        id="calendar-timeonly" v-model="activity.endTime" 
                        timeOnly hourFormat="24" manualInput showIcon iconDisplay="input"
                        class="h-9 overflow-hidden" placeholder="ex.: 09:00"
                        :invalid="submited && v$.endTime.$invalid"
                    />
                </div>
            </div>

            <div class="flex flex-col gap-1">
                <label for="requires_registration">Requer Inscrição</label>
                <Dropdown v-model="activity.requires_registration" :options="['Sim', 'Não']" placeholder="Selecione Sim ou Não" class="w-full" /> 
            </div>

            <div class="flex flex-col gap-1">
                <label for="maxParticipants">Máximo de Participantes</label>
                <InputNumber 
                    v-model="activity.maxParticipants" id="maxParticipants" class="h-9" placeholder="Ex.: 100" 
                    :invalid="submited && v$.maxParticipants.$invalid" :min="1" mode="decimal"    
                />

                <InlineMessage severity="error" v-if="submited && v$.maxParticipants.$invalid" class="text-xs">
                    O número máximo de participantes é obrigatório.
                </InlineMessage>
            </div>

            <div class="flex flex-col gap-1">
                <label for="targetAudience">Público Alvo</label>
                <Dropdown v-model="activity.targetAudience" :options="['Iniciante', 'Avançado', 'Geral']" placeholder="Selecione o público alvo" class="w-full" />   
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