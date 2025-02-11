<script setup>
import { ref, reactive, computed, defineAsyncComponent } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { useNotification } from '@/composables/useNotification';
import EventServices from '@/services/EventServices';
import EventConfigServices from '@/services/EventConfigServices.js';
import ParticipantServices from '@/services/ParticipantServices.js';
import RegistrationServices from '@/services/RegistrationServices.js';
import Dialog from 'primevue/dialog';
import PLoading from '@/components/PLoading.vue';
import PError from '@/components/PError.vue';

const { notifyError } = useNotification();

// Acessando o store e a rota
const store = useStore();
const route = useRoute();
const user = computed(() => store.getters['auth/user']);

// Variáveis reativas
const visible = ref(false);
const busy = ref(false);
const event = ref(null);
const modalWidth = ref('35rem');

// Emissão de eventos
const emit = defineEmits(['created:registration']);

// Métodos
async function show() {
    visible.value = true;
    fetchEvent();
}

async function fetchEvent() {
    busy.value = true;
    try {
        const response = await EventServices.show(route.params.id);
        if(response.status === 200) {
            event.value = response.data;
            return
        }

        throw new Error();
    } catch (e) {
        notifyError('Erro ao buscar evento');
    } finally {
        busy.value = false;
    }
}

function handleHidden() {
    visible.value = false;
}

function handleCancel() {
    handleHidden();
}

function handleRegistrationCompleted() {
    emit('created:registration');
    handleHidden();
    event.value = null;
}

const AsyncComp = (component) => {
    try {
        console.log(component)
        return defineAsyncComponent({
            loader: () => import(`@/views/event/registrations/components/${component}.vue`),
            loadingComponent: PLoading,
            delay: 200,
            errorComponent: PError,
            timeout: 3000
        })
    } catch (error) {
        console.log(error)
        notifyError(error);
    }
}

defineExpose({
    show
});
</script>

<template>
    <Dialog v-model:visible="visible" modal header="Inscrição" :style="{ width: modalWidth }">

        <PLoading v-if="busy" />

        <div class="flex flex-col gap-5" v-else>
            <component 
                :is="AsyncComp(event.EventConfiguration[0]?.template)" 
                :fields="event.EventConfiguration[0]?.fields"
                :event="event"
                @created:registration="handleRegistrationCompleted"
            />
        </div>
    </Dialog>
</template>