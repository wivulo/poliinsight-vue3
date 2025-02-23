<script setup>
import { ref, reactive, onMounted, defineAsyncComponent } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { useNotification } from '@/composables/useNotification';
import EventServices from '@/services/EventServices';
import EventConfigServices from '@/services/EventConfigServices.js';
import RegistrationServices from '@/services/RegistrationServices.js'
import Image from 'primevue/image';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import CardRoot from '@/components/PCard/CardRoot.vue';
import PEmpty from '@/components/PEmpty.vue';
import PLoading from '@/components/PLoading.vue';
import PBreadcrumb from '@/components/PBreadcrumb.vue';
import PError from '@/components/PError.vue';
import Avatar from 'primevue/avatar';
import TeamInformation from './components/detail/TeamInformation.vue';
import SingleInformation from './components/detail/SingleInformation.vue';

document.title = 'Inscrições | Poliinsight';

const store = useStore();
const route = useRoute();
const router = useRouter()
const { notifyError, notifySuccess } = useNotification();

const busy = ref(false);
const iEvent = ref(null);
const iRegistration = ref(null);

async function fetchEvent() {
    try {
        busy.value = true;
        const response = await EventServices.showPublic(route.params.id);
            
        if(response.status === 200) {
            iEvent.value = response.data;
            return 
        }
    } catch (error) {
        notifyError(error);
    } finally {
        busy.value = false;
    }
}
fetchEvent();

async function fetchRegistration() {
    try {
        busy.value = true;
        const response = await RegistrationServices.show(route.params.registrationid);
            
        if(response.status === 200) {
            iRegistration.value = response.data;
            return 
        }
    } catch (error) {
        notifyError(error);
    } finally {
        busy.value = false;
    }
}
fetchRegistration();

const items = ref([
    { label: 'Evento', route: 'public.event.show', title: 'Ir para Eventos', params: { id: route.params.id } },
    { label: 'Inscrições', route: 'event.registrations.public.show', title: 'Ir para Inscrições', params: { id: route.params.id } },
    { label: router.currentRoute.value.meta.title },
]);

// notifySuccess('Estamos felizes pela tua inscrição 🎉 estamos ansiosos pelo dia H e a tua presença!', 5000);

</script>

<template>
    <!-- Atualizado: contêiner principal em grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 px-4 py-5 w-full max-w-[1366px] items-center">
        <PLoading v-if="busy" />
        <PEmpty v-else-if="!busy && !iEvent" />

        <template v-else>
            <div class="flex w-full text-xs">
                <PBreadcrumb :items="items" />
            </div>

            <!-- Primeira coluna: imagem do evento -->
            <CardRoot class="lg:col-span-1 !h-[400px] !lg:h-[500px]">
                <Image :src="iEvent?.imageURL" width="100%" image-class="h-[300px] lg:h-[400px] lg:object-cover object-contain" />
                <div class="flex flex-col gap-5">
                    <div>
                        <p class="text-xl">{{ iEvent?.name }}</p>
                    </div>
                </div>  
            </CardRoot>

            <!-- Segunda parte: detalhes e inscrição ocupando 2 colunas em lg -->
            <div class="lg:col-span-2 flex flex-col gap-5">
                <CardRoot>
                    <div>
                        <p class="text-2xl">{{ iEvent.name }}</p>
                    </div>
                    <div class="flex justify-between">
                        <div class="flex flex-col gap-1 text-surface-600 text-sm mt-2">
                            <p class="flex items-center">
                                <i class="pi pi-calendar mr-1" /> 
                                <span v-formatDate="iEvent?.startDate" :title="iEvent?.startDate"/>
                                <span class="mx-1">-</span> 
                                <i class="pi pi-clock mr-1" /> 
                                <span v-formatTime="iEvent?.startTime" :title="iEvent?.startTime"/>
                            </p>
                            <p>
                                <i class="pi pi-calendar mr-1" /> 
                                <span v-formatDate="iEvent?.endDate" :title="iEvent?.endDate"/>
                                <span class="mx-1">-</span>  
                                <i class="pi pi-clock mr-1" /> 
                                <span v-formatTime="iEvent?.endTime" :title="iEvent?.endTime"/>
                            </p>
                        </div>
                    </div>
                </CardRoot>

                <CardRoot>
                    <div class="flex flex-col gap-5">
                        <div class="flex justify-between px-3">
                            <p class="text-xl font-semibold">Detalhes da incrição</p>
                        </div>
                        <TeamInformation v-if="iRegistration?.teamId" :iRegistration="iRegistration" />
                        <SingleInformation v-else :iRegistration="iRegistration" />
                    </div>
                </CardRoot>
            </div>
        </template>
    </div>
</template>