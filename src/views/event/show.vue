<script setup>
import { ref, reactive, computed, onMounted, watch, shallowRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import EventServices from '@/services/EventServices';
import { dateFormatter } from "@/utils/dateFormatter";
import AutoComplete from 'primevue/autocomplete';
import Card from 'primevue/card';
import InputGroup from 'primevue/inputgroup';
import Button from 'primevue/button';
import Image from 'primevue/image';
import Dropdown from 'primevue/dropdown';
// import CCard from "@/components/PCard/index.js";
import CardRoot from '@/components/PCard/CardRoot.vue';
import TabMenu from 'primevue/tabmenu';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import ModalNewRegistration from './components/ModalNewRegistration.vue';
import RegistrationTable from "@/views/event/components/RegistrationTable.vue";
import TicketsTable from "@/views/event/components/TicketsTable.vue";
import SpeakersTable from './components/SpeakersTable.vue';
import ActivitiesTab from './components/ActivitiesTab.vue';
import dayjs from 'dayjs';
import { SwalConfirmAlert } from '@/helpers/swalConfirmAlert';
import { useNotification } from '@/composables/useNotification';
import ModalChangeEventStatus from './components/ModalChangeEventStatus.vue';

const route = useRoute();
const router = useRouter();
const store = useStore();
const { notifyError, notifySuccess } = useNotification();

const busy = ref(false);
const event = ref(null);
const events = reactive({
    busy: false,
    data: []
});
const params = reactive({
    where: {
        name: {
            contains: ''
        },
        organizerId: store.getters['auth/user'].id,
    },
});

const tabItems = [
    { label: 'Atividades', component: ActivitiesTab, icon: 'fa fa-tasks' },
    { label: 'Incrições', component: RegistrationTable, icon: 'fa fa-pencil', route: 'event.show.registrations' },
    { label: 'Palestrantes', component: SpeakersTable, icon: 'fa fa-users', route: 'event.show.speakers' },
    { label: 'Ingressos', component: TicketsTable, icon: 'fa fa-file', route: 'event.show.tickets' },
];
const tabICurrenttem = ref('RegistrationTable');
const showMoreDetails = ref(false);

const date_formatter = computed(() => dateFormatter);

const getEvent = async () => {
    try {
        busy.value = true;
        const response = await EventServices.show(route.params.id);
        if (response.status === 200) {
            event.value = response.data;
            return;
        }
        throw new Error();
    } catch (error) {
        handleError('Erro ao buscar evento');
    } finally {
        busy.value = false;
    }
};

const getEvents = async () => {
    try {
        events.busy = true;
        const response = await EventServices.search(params);
        events.data = response.data;
    } catch (error) {
        handleError('Erro ao buscar os eventos');
    } finally {
        events.busy = false;
    }
};

const ModalNewRegistrationRef = ref(null)
function handleShowModalNewRegistration() {
    ModalNewRegistrationRef.value.show();
};

const componentTabelaRef = ref(null);
const handleRegistrationCompleted = () => {
    getEvent();
    componentTabelaRef.value.updateComponent();
};

const handleEventSelected = (event) => {
    router.push({ name: 'event.show', params: { id: event.value.id } });
};

const handleChangeTable = (component) => {
    tabICurrenttem.value = component;
};

const handleError = (error) => {
    toast.add({ severity: 'error', summary: 'Erro', detail: error });
};

const timeFormatter = (time) => {
    return dayjs(time).format('HH:mm');
};

const ModalChangeEventStatusRef = ref(null);
const handleChangeEventStatus = async () => {
    ModalChangeEventStatusRef.value.show();
};

onMounted(() => {
    getEvent();
});

watch(route, () => {
    getEvent();
});
</script>

<template>
    <div id="eventShow" class="flex flex-col px-5 pt-7 pb-5 gap-5 w-full flex-auto">
        <ModalNewRegistration 
            ref="ModalNewRegistrationRef" 
            @created:registration="handleRegistrationCompleted" 
        />

        <ModalChangeEventStatus 
            ref="ModalChangeEventStatusRef" 
            @updated="getEvent"
        />

        <!-- <div class="flex flex-col gap-5 w-full"> -->
            <CardRoot class="w-full shadow-sm cardroot">
                <InputGroup>
                    <Button outlined class="h-9 w-9 border-0 border-surface-300 bg-transparent hover:bg-transparent">
                        <i class="fa fa-search text-surface-700" />
                    </Button>
                    <AutoComplete 
                        v-model="params.where.name.contains" 
                        :suggestions="events.data" @complete="getEvents"
                        optionLabel="name"
                        placeholder="Escreva para pesquisar" class="w-full h-9" inputClass="w-full border-0" 
                        id="autocomplete-statistic-viewer" @item-select="handleEventSelected"
                    >
                        <template #option="slotProps">
                            <div class="flex items-center">
                                <div>{{ slotProps.option.name }}</div>
                            </div>
                        </template>
                    </AutoComplete>
                </InputGroup>
            </CardRoot>

            <div v-if="busy" class="flex-grow flex w-full h-full justify-center items-center">
                <i class="fa fa-spinner animate-spin text-black text-base" />
            </div>
    
            <div v-else-if="!busy && !event" class="flex-grow flex w-full h-full justify-center items-center">
                <p class="text-xl text-surface-400 font-light">
                    Nenhum evento encontrado!
                </p>
            </div>
    
            <div class="flex gap-5 w-full" v-else>
                <CardRoot class="w-[30%]">
                    <div class="flex flex-col gap-3">
    
                        <div class="w-full h-[218px] border overflow-hidden">
                            <Image :src="event.imageURL" class="object-fill object-center w-full" imageClass="h-[218px] w-full" alt="event.name" preview/>
                        </div>

                        <div>
                            <p class="text-xl font-medium">
                                {{ event.name }}
                            </p>
                            <p>{{ event.location }}</p>
                        </div>

                        <div class="mt-2 min-h-160 relative">
                            <ul class="flex flex-col gap-2 text-sm">
                                <li>
                                    <p><b>Tipo:</b></p>
                                    <p>{{ event?.type }}</p>
                                </li>
                                <li>
                                    <p><b>Categoria</b>: </p>
                                    <p>{{ event?.category?.name }}</p>
                                </li>
                                <li>
                                    <p><b>Departamento</b>:</p>
                                    <p>{{ event?.department.name }}</p>
                                </li>
                                <li>
                                    <p><b>Vagas</b>:</p>
                                    <p>{{ event?.vacancies }}</p>
                                </li>
                                <li>
                                    <p><b>Data de início</b>:</p>
                                    <p>{{date_formatter(event.startDate)}}</p>
                                </li>
                                <li>
                                    <p><b>Data de fim</b>:</p>
                                    <p>{{ date_formatter(event.endDate) }}</p>
                                </li>
                            </ul>

                            <ul v-show="showMoreDetails" class="flex flex-col gap-2 text-sm mt-2">
                                <li>
                                    <p><b>Hora de inicio</b>:</p>
                                    <p>{{ timeFormatter(event.startTime) }}</p>
                                </li>
                                <li>
                                    <p><b>Hora de Fim</b>:</p>
                                    <p>{{ timeFormatter(event.endTime) }}</p>
                                </li>
                                <li class="group relative cursor-pointer">
                                    <p><b>Estado</b>:</p>
                                    <p
                                        class="group-hover:-translate-x-7 relative transform transition-all"
                                        :class="{'text-green-500': event.status?.name == 'Aberto', 'text-red-500': event.status?.name == 'Cancelado', 'text-yellow-500': event.status?.name == 'Brevemente'}"
                                    >
                                        {{ event.status?.name }}
                                    </p>

                                    <Button 
                                        icon="pi pi-pencil" text severity="secondary" size="small" 
                                        class="w-5 h-5 !absolute right-0 bottom-0 opacity-0 group-hover:opacity-100 transition-all transform" 
                                        title="Mudar estado do evento" @click="handleChangeEventStatus"
                                    />
                                </li>
                            </ul>

                            <div class="flex justify-end my-1">
                                <Button text severity="secondary" size="small" @click="showMoreDetails = !showMoreDetails"
                                    class="h-8 bg-gray-400/80 hover:bg-gray-400 border-0"
                                >
                                    <span class="text-slate-700 text-xs" v-if="!showMoreDetails">
                                        <i class="fa fa-plus text-sm " /> Ver mais
                                    </span>

                                    <span class="text-slate-700 text-xs" v-else>
                                        <i class="fa fa-minus text-sm " /> Ver menos
                                    </span>
                                </Button>
                            </div>
                        </div>

                        <div class="flex flex-col gap-3 border-t border-zinc-200 py-2">
                            <Button severity="secondary" size="small" class="h-8 bg-gray-400/80 hover:bg-gray-400 border-0 w-full" @click="handleShowModalNewRegistration">
                                <span class="text-black">
                                    <i class="fa fa-file-signature text-sm " /> Fazer inscrição
                                </span>
                            </Button>

                            <router-link v-slot="{ navigate }" :to="{name: 'analise_relatorios.analitics.show', params: {id: event.id}}" custom>
                                <Button severity="secondary" v-ripple size="small" class="h-8 bg-gray-400/80 border-0 hover:bg-gray-400 w-full p-ripple" @click="navigate">
                                    <span class="text-black">
                                        <i class="fa fa-map text-sm " /> Mapa do evento
                                    </span>
                                </Button>
                            </router-link>
                        </div>
                    </div>
                </CardRoot>
    
                <CardRoot class="w-[70%]">
                   <div class="flex flex-col gap-5">
                        <TabView id="custom_tabview" :unstyled="true">
                            <TabPanel v-for="item in tabItems" :key="item.id">
                                <template #header>
                                    <div>
                                        <span :class="'mr-1 fa ' + item.icon" />
                                        <span >{{ item.label }}</span>
                                    </div>
                                </template>

                                <transition>
                                    <component 
                                        :is="item.component" 
                                        ref="componentTabelaRef"
                                        :eventType="event.category?.name" 
                                    />
                                </transition>
                            </TabPanel>
                        </TabView>
                   </div>
                </CardRoot>
            </div>
        <!-- </div> -->
    </div>
</template>

<style>

#eventShow {
    div#autocomplete-statistic-viewer[data-pc-name="autocomplete"] input{
        border-radius: 0 5px 5px 0px;
    }

    div.cardroot div[data-pc-section="content"]{
        @apply py-[5px]
    }

    .cardroot div[data-pc-section="body"] {
        @apply px-[5px]
    }

    ul li{
        @apply flex justify-between gap-1
    }
}
</style>