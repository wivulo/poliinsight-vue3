<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import EventServices from '@/services/EventServices';
import { useRequest } from '@/composables/useRequest';
import { useStore } from 'vuex';
import { Event1 } from '@/model/event.model';
import ExportServices from '@/services/ExportServices';
import { useErrorNotification } from '@/composables/useErrorNotification';
import { typeOptions } from '@/helpers/exportTypeOptions';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';


const {busy: fetchEventsBusy, executeRequest: fetchEvents } = useRequest();
const {busy, executeRequest: exportEspecificEventData, error} = useRequest();
const store = useStore();
const { notifyError } = useErrorNotification();
const $emit = defineEmits(['exported']);

const visible = ref(false);
const user = computed(() => store.getters['auth/user']);
const events = ref<Event1[]>(null);
const exportData = reactive({
    operadorId: user.value.id,
    eventId: null,
    type: null,
    description: null
});

const show = async () => {
    visible.value = true;
    events.value = await fetchEvents(() => EventServices.fetchEventsOrganizer(user.value.id), null, 'Erro ao buscar eventos')
};

const handleHidden = () => {
    visible.value = false;
};

const reset = () => {
    exportData.eventId = null;
    exportData.type = null;
};

const handleCancel = () => {
    reset();
    handleHidden();
};

const handleOK = async () => {
    const [isValid, message] = verifyRequiredFields();
    if (!isValid) {
        return notifyError(message);
    }

    const response = await exportEspecificEventData(
        () => ExportServices.exportEspecificEventsData(exportData), 
        'Dados exportados com sucesso', 
        'Erro ao exportar dados'
    );

    if (response && !error.value) {
        const blob = new Blob([response], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `dados_gerais_${new Date().toISOString()}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        $emit('exported');
        handleHidden();
        reset();
    }
};

const verifyRequiredFields = () => {
    if (!exportData.eventId) {
        return [false, 'Selecione um evento'];
    }

    if (!exportData.type) {
        return [false, 'Selecione um tipo de exportação'];
    }

    return [true, null];
};

defineExpose({
    show
});
</script>

<template>
    <Dialog v-model:visible="visible" modal header="Exportar" :style="{ width: '35rem' }">
        <div class="flex flex-col gap-3 text-sm">
            <div class="flex flex-col gap-1 w-full">
                <label for="event">Evento <span class="text-red-600">*</span></label>
                <Dropdown id="event" v-model="exportData.eventId" :options="events" optionLabel="name" optionValue="id" placeholder="Selecione um evento" 
                    class="w-full h-9" :loading="fetchEventsBusy">
                    <template #value="slotProps">
                        <div v-if="slotProps.value" class="flex items-center text-slate-700">
                            {{ events.find(event => event.id === slotProps.value).name }}
                        </div>
                        <span v-else>
                            {{ slotProps.placeholder }}
                        </span>
                    </template>
                </Dropdown>
            </div>

            <div class="flex flex-col gap-1 w-full">
                <label for="event">O que quer exportar? Selecione abaixo <span class="text-red-600">*</span></label>
                
                <Dropdown id="event" v-model="exportData.type" :options="typeOptions" optionLabel="label" optionValue="value" placeholder="Selecione um tipo específico de exportação" 
                    class="w-full h-9" :loading="fetchEventsBusy">
                    <template #value="slotProps">
                        <div v-if="slotProps.value" class="flex items-center text-slate-700">
                            {{ typeOptions.find(type => type.value === slotProps.value).label }}
                        </div>
                        <span v-else>
                            {{ slotProps.placeholder }}
                        </span>
                    </template>
                </Dropdown>
            </div>

            <div class="flex flex-col gap-1 w-full">
                <label for="description">Descreva a necessidade da exportação <span class="text-red-600">*</span></label>
                
                <Textarea id="description" nmae="description" v-model="exportData.description" placeholder="Ex.: Para integração com a plataforma xy..." class="hover:border-slate-300" rows="3"/>
            </div>
        </div>

        <template #footer>
           <div class="flex gap-3 justify-end">
               <Button severity="secondary" text @click="handleCancel" size="small" class="h-8">
                   <i class="fa fa-times mr-1"/> Cancelar
               </Button>
               <Button @click="handleOK" size="small" class="h-8" :loading="busy">
                   <i class="fas fa-spinner animate-spin mr-2" v-if="busy" />
                   <i class="fa fa-upload mr-2"/> {{ busy ? 'Exportando...' : 'Exportar' }}
               </Button>
           </div>
        </template>
    </Dialog>
</template>