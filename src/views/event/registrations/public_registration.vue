<script setup>
import { ref, reactive, onMounted, defineAsyncComponent } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { useNotification } from '@/composables/useNotification';
import EventServices from '@/services/EventServices';
import EventConfigServices from '@/services/EventConfigServices.js';
import RegistrationServices from '@/services/RegistrationServices.js'
import Image from 'primevue/image';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import CardRoot from '@/components/PCard/CardRoot.vue';
import PEmpty from '@/components/PEmpty.vue';
import PLoading from '@/components/PLoading.vue';
import PBreadcrumb from '@/components/PBreadcrumb.vue';
import PError from '@/components/PError.vue';
import Tag from 'primevue/tag';

document.title = 'Inscrições | Poliinsight';

const store = useStore();
const route = useRoute();
const router = useRouter()
const { notifyError, notifySuccess, notifyWarn } = useNotification();

const busy = ref(false);
const iEvent = ref(null);
const eventConfig = reactive({
    data: {},
    busy: false
});

async function fetchEvent() {
    try {
        busy.value = true;
        const response = await EventServices.showPublic(route.params.id);
            
        if(response.status === 200) {
            iEvent.value = response.data;
            fetchEventConfig(iEvent.value?.category.name);
            return 
        }
    } catch (error) {
        console.error(error)
        notifyError(error);
    } finally {
        busy.value = false;
    }
}
fetchEvent();

async function fetchEventConfig(eventType) {
    try {
        eventConfig.busy = true;
        const response = await EventConfigServices.showByEventType(eventType);

        if(response.status === 200) {
            eventConfig.data = response.data;
            return 
        }
    } catch (error) {
        console.error(error)
        notifyError(error);
    } finally {
        eventConfig.busy = false;
    }
}

const items = ref([
    { label: 'Evento', route: 'public.event.show', title: 'Ir para Eventos', params: { id: route.params.id } },
    { label: router.currentRoute.value.meta.title },
]);

const AsyncComp = (component) => {
    try {
        console.log(component)
        return defineAsyncComponent({
            loader: () => import(`@/views/event/registrations/components/${component}_alt.vue`),
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

</script>

<template>
    <div class="flex flex-col px-14 gap-5 py-5 w-full max-w-[1366px] items-center">
        <PLoading v-if="busy" />
        <PEmpty v-else-if="!busy && !iEvent" />

        <template v-else>
            <div class="flex w-full text-xs">
                <PBreadcrumb :items="items" />
            </div>

            <div class="flex gap-5 w-full">
                <CardRoot class="!w-[33%] !h-[650px]">
                    <Image :src="iEvent?.imageURL" width="100%" image-class="h-[400px] object-cover" />

                    <div class="flex flex-col gap-5">
                        <!-- <div class="w-full bg-surface-200 p-7"> -->
                            <div>
                                <p class="text-xl"> {{ iEvent?.name }}</p>
                            </div>

                            <div class="flex justify-between">
                                <div class="flex flex-col gap-2 text-surface-600 text-sm mt-2">
                                    <p class="flex items-center">
                                        <i class="pi pi-calendar mr-1" /> <span v-formatDate="iEvent?.startDate" :title="iEvent?.startDate"/>
                                        <span class="mx-1">-</span> 
                                        <i class="pi pi-clock mr-1" /> <span v-formatTime="iEvent?.startTime" :title="iEvent?.startTime"/>
                                    </p>
                                    <p>
                                        <i class="pi pi-calendar mr-1" /> <span v-formatDate="iEvent?.endDate" :title="iEvent?.endDate"/>
                                        <span class="mx-1">-</span>  
                                        <i class="pi pi-clock mr-1" /> <span v-formatTime="iEvent?.endTime" :title="iEvent?.endTime"/>
                                    </p>
                                    <p>
                                        <i class="pi pi-map-marker"></i> {{ iEvent?.location }}
                                    </p>
                                    
                                    <p>
                                        <i class="pi pi-users"></i> {{ iEvent?.vacancies }} vagas
                                    </p>
                                    <div>
                                        <Tag :severity="iEvent.status?.severity" :value="iEvent.category?.name" class="my-0.5 !font-medium" />
                                    </div>
                                </div>
                            </div>
                        <!-- </div> -->
                    </div>  
                </CardRoot>

                <div class="w-[65%] flex flex-col gap-5">
                    <CardRoot>
                        <div class="flex flex-col gap-5">
                            <div class="flex justify-between px-3">
                                <p class="text-xl font-semibold">Inscrição</p>
                            </div>

                            <div v-if="eventConfig.data?.template" class="flex flex-col gap-5">
                                <component 
                                    :is="AsyncComp(eventConfig.data?.template)" 
                                    :fields="eventConfig?.data.fields"
                                    :event="iEvent"
                                />
                            </div>
                        </div>
                    </CardRoot>
                </div>  
            </div>
        </template>
    </div>
</template>