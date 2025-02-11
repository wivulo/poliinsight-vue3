<script setup>
import { ref, onMounted, shallowRef } from 'vue';
import EventConfigServices from '@/services/EventConfigServices.js';
import { useNotification } from '@/composables/useNotification';
import RegistrationTableTeam from './RegistrationTableTeam.vue';
import RegistrationTableSingle from './RegistrationTableSingle.vue';
import PLoading from '@/components/PLoading.vue';

const props = defineProps({
    eventType: {
        type: String,
        required: true
    }
});

const { notifyError } = useNotification();


const busy = ref(false);
let activeTable = null;
const getEventConfig = async () => {
    try {
        busy.value = true;
        const response = await EventConfigServices.showByEventType(props.eventType);
        if(response.status === 200) {
            const conf = response.data;
            if (conf && (conf?.registrationType == 'Individual' || conf?.registrationType == 'Hibrido')) {
                activeTable = RegistrationTableSingle;
            } else {
                activeTable = RegistrationTableTeam;
            }

            return
        }

        throw new Error();
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
    getEventConfig();
});

defineExpose({
    updateComponent
});
</script>

<template>
    <div class="flex flex-col gap-3">
        <template v-if="activeTable">
            <component ref="componentTabelaRef" :is="activeTable"/>
        </template>

        <PLoading v-else />
    </div>
</template>