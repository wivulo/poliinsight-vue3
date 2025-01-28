<script setup>
import { ref, onMounted, shallowRef } from 'vue';
import EventConfigServices from '@/services/EventConfigServices.js';
import { useNotification } from '@/composables/useNotification';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import Dropdown from 'primevue/dropdown';
import RegistrationTableTeam from './RegistrationTableTeam.vue';
import RegistrationTableSingle from './RegistrationTableSingle.vue';

const props = defineProps({
    eventType: {
        type: String,
        required: true
    }
});

const { notifyError } = useNotification();


const busy = ref(false);
const filter = ref(null);

let activeTable = null;
const getEventConfig = async () => {
    try {
        busy.value = true;
        const response = await EventConfigServices.showByEventType(props.eventType);
        const conf = response.data;

        if (conf.registrationType == 'single' || conf.registrationType == 'hibrido') {
            activeTable = RegistrationTableSingle;
        } else {
            activeTable = RegistrationTableTeam;
        }
    } catch (error) {
        console.error(error);
        notifyError('Erro ao buscar configuração do evento');
    } finally {
        busy.value = false;
    }
};

const componentTabelaRef = ref(null);
const updateComponent = () => {
    componentTabelaRef.value.updateComponent();
};

onMounted(async () => {
    await getEventConfig();
});
</script>

<template>
    <div class="flex flex-col gap-3">
        <div class="flex">
            <InputGroup>
                <Button size="small" class="h-9 bg-transparent border border-surface-300 border-r-0">
                    <i class="fa fa-search text-black" />
                 </Button>
                <InputText size="small" v-model="filter" id="search" type="text" placeholder="Escreva para pesquisar..." class="w-full rounded-none h-9 border-l-0" />
            </InputGroup>
        </div>

        <template v-if="activeTable">
            <component ref="componentTabelaRef" :is="activeTable" />
        </template>

        <template v-else>
            <div>
                carregando...
            </div>
        </template>
    </div>
</template>