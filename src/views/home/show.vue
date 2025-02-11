<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { useNotification } from '@/composables/useNotification';
import EventServices from '@/services/EventServices';
import Image from 'primevue/image';
import Button from 'primevue/button';
import Breadcrumb from 'primevue/breadcrumb';
import CardRoot from '@/components/PCard/CardRoot.vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import { event } from '@/store/modules/event';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import Timeline from 'primevue/timeline';
import Chip from 'primevue/chip';
import Avatar from 'primevue/avatar';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Tag from 'primevue/tag';

document.title = 'Evento | Poliinsight';

const store = useStore();
const route = useRoute();
const router = useRouter()
const { notifyError, notifySuccess } = useNotification();

const events = ref([]);
const busy = ref(false);
const iEvent = ref({});

const tabItems = ref([])
async function fetchEvent() {
    try {
        busy.value = true;
        const response = await EventServices.showPublic(route.params.id);
            
        if(response.status === 200) {
            iEvent.value = response.data;

            const eventStartDay = dayjs.utc(iEvent.value?.startDate).date();
            const eventEndDay = dayjs.utc(iEvent.value?.endDate).date();
            let count = 1;

            for (let i = eventStartDay; i <= eventEndDay; i++) {
                tabItems.value.push({
                    label: 'Dia ' + count,
                    activities: iEvent.value.activities?.filter(activity => dayjs(activity.date).date() === i),
                })

                count++;
            }

            return 
        }
    } catch (error) {
        notifyError(error);
    } finally {
        busy.value = false;
    }
}
fetchEvent();

const home = ref({
    icon: 'pi pi-home', label: 'Página Inicial', route: 'home', title: 'Ir para Página Inicial'
});
const items = ref([
    { label: router.currentRoute.value.meta.title },
]);


const feedback = ref({
    name: '',
    email: '',
    message: ''
});
const feedback_busy = ref(false);

async function handleOk () {
    if(!feedback.value.name || !feedback.value.email || !feedback.value.message) {
        notifyError('Preencha todos os campos');
        return;
    }

    send()
} 

async function send() {
    try {
        feedback_busy.value = true;
        const response = await EventServices.feedback(iEvent.value.id, feedback.value);
            
        if(response.status === 200) {
            notifySuccess('Feedback enviado com sucesso');
            feedback.value = {
                name: '',
                email: '',
                message: ''
            }
            return 
        }
    } catch (error) {
        notifyError(error);
    } finally {
        feedback_busy.value = false;
    }
}

</script>

<template>
    <div class="flex flex-col px-14 gap-5 py-5 w-full max-w-[1366px] items-center">
        <div class="flex w-full text-xs">
            <div class="w-[33%]">
                <Breadcrumb :home="home" :model="items">
                    <template #item="{ item, props }">
                        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="{name: item.route}" custom>
                            <a :href="href" v-bind="props.action" @click="navigate">
                                <span :class="[item.icon, 'text-color']" />
                                <span class="ml-1.5 font-semibold" :title="item.title">{{ item.label }}</span>
                            </a>
                        </router-link>
                        
                        <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                            <span class="text-color">{{ item.label }}</span>
                        </a>

                    </template>
                </Breadcrumb>
            </div>
        </div>

        <div class="flex gap-5 w-full">
            <CardRoot class="!w-[33%] !h-[450px] overflow-hidden">
                <Image :src="iEvent.imageURL" width="100%" image-class="h-[400px] object-cover hover:" class="hover:scale-125 transform transition-all duration-600" />
            </CardRoot>

            <div class="w-[65%] flex flex-col gap-5">
                <CardRoot>
                    <!-- <div class="w-full bg-surface-200 p-7"> -->
                        <div>
                            <p class="text-2xl"> {{ iEvent.name }}</p>
                        </div>
                        <div class="flex justify-between">
                            <div class="flex flex-col gap-1 text-surface-600 text-sm mt-2">
                                <p class="flex items-center">
                                        <i class="pi pi-calendar mr-1" /> 
                                        <span :title="iEvent?.startDate">
                                           {{ dayjs.utc(iEvent?.startDate).format('dddd, D [de] MMM') }}
                                        </span>
                                        <span class="mx-1">-</span> 
                                        <i class="pi pi-clock mr-1" /> 
                                        <span :title="iEvent?.startTime">
                                            {{ dayjs.utc(iEvent?.startTime).format('HH:mm') }}
                                        </span>
                                    </p>
                                    <p>
                                        <i class="pi pi-calendar mr-1" /> 
                                        <span :title="iEvent?.endDate">
                                            {{ dayjs.utc(iEvent?.endDate).format('dddd, D [de] MMM') }}
                                        </span>
                                        <span class="mx-1">-</span>  
                                        <i class="pi pi-clock mr-1" /> 
                                        <span :title="iEvent?.endTime">
                                            {{ dayjs.utc(iEvent?.endTime).format('HH:mm') }}
                                        </span>
                                    </p>
                                <p><i class="pi pi-map-marker"></i> {{ iEvent.location }}</p>
                                <div>
                                    <Tag :severity="iEvent.status?.severity" :value="iEvent.category?.name" class="my-0.5 !font-medium" />
                                </div>
                            </div>

                            <div>
                                <!-- <Button icon="fa fa-edit" label="Inscrever-se" size="small" class="h-9">
                                    <RouterLink :to="{ name: 'event.registration', params: { id: iEvent.id }}" />
                                </Button> -->

                                <router-link v-slot="{ href, navigate }" :to="{name: 'event.registrations.public.show', params: {id: iEvent.id}}" custom>
                                    <Button icon="fa fa-edit" label="Inscrever-se" size="small" class="h-9" @click="navigate" />
                                </router-link>
                            </div>
                        </div>
                    <!-- </div> -->
                </CardRoot>

                <CardRoot class="my-3">
                    <div>
                        <p class="text-xl">Descrição</p>
                    </div>
                    <div class="mt-2">
                        <p class="text-surface-600 text-base"> {{ iEvent.description }} </p>
                    </div>
                </CardRoot>

                <CardRoot class="dark:bg-surface-800 dark:text-white">
                    <div class="my-3">
                        <p class="text-xl">Programação</p>
                    </div>

                    <TabView id="custom_tabview" :unstyled="true">
                        <TabPanel v-for="item in tabItems" :key="item.id">
                            <template #header>
                                <div>
                                    <span >{{ item.label }}</span>
                                </div>
                            </template>

                            <transition>
                                <Timeline :value="item.activities" class="mt-3">
                                    <template #opposite="slotProps">
                                        <small class="p-text-secondary">
                                            <span v-formatTime="slotProps.item.startTime"></span>  - <span v-formatTime="slotProps.item.endTime"></span>
                                        </small>
                                    </template>
                                    <template #content="slotProps">
                                        <p class="text-surface-600 text-base">
                                            <Chip :label="slotProps.item?.type?.name" class="mr-1 text-xs" />
                                            {{ slotProps.item.name }} 
                                        </p>
                                        <div class="flex flex-wrap gap-5 ml-7 my-4">
                                            <div v-for="guest in slotProps.item.guests" :key="guest.id" class="flex items-center gap-2 text-sm">
                                                <template v-if="guest.userId">
                                                    <Avatar v-if="guest.user?.imageURL" :image="guest.user?.imageURL" size="large" shape="circle"/>
                                                    <Avatar v-else :label="guest.user.name[0]" size="large" shape="circle"/>
                                                </template>

                                                <template v-else>
                                                    <Avatar v-if="guest.imageURL" :image="guest.imageURL" size="large" shape="circle"/>
                                                    <Avatar v-else :label="guest.name[0]" size="large" shape="circle"/>
                                                </template>
                                                <div class="text-xs">
                                                    <p class="text-surface-700"> {{ guest.name ?? guest?.user?.name }} </p>
                                                    <p class="text-surface-400">{{ guest.roleInActivity }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </Timeline>
                            </transition>
                        </TabPanel>
                    </TabView>
                </CardRoot>

                <CardRoot>
                    <div>
                        <p class="text-xl">Convidados</p>
                    </div>

                    <div class="flex flex-wrap gap-5 ml-5 my-3">
                         <div v-for="guest in iEvent.Guest" :key="guest.id" class="flex items-center gap-2 text-sm min-w-[250px] max-w-[300px]">
                             <template v-if="guest.userId">
                                 <Avatar v-if="guest.user?.imageURL" :image="guest.user?.imageURL" size="xlarge" shape="circle" class="!w-20"/>
                                 <Avatar v-else :label="guest.user.name[0]" size="xlarge" shape="circle"/>

                                 <div class="truncate">
                                    <p class="text-surface-600"> {{ guest.user?.name }} </p>
                                    <p class="text-surface-400">{{ guest.biography }}</p>
                                </div>
                             </template>

                             <template v-else>
                                 <Avatar v-if="guest.imageURL" :image="guest.imageURL" size="xlarge" shape="circle" class="!w-20"/>
                                 <Avatar v-else :label="guest.name[0]" size="xlarge" shape="circle" />

                                 <div class="text-ellipsis-2">
                                    <p class="text-surface-600"> {{ guest.name }} </p>
                                    <p class="text-surface-400">{{ guest.biography }}</p>
                                </div>
                             </template>
                         </div>
                     </div>
                </CardRoot>

                <CardRoot class="flex justify-center items-center py-5">
                    <div class="flex flex-col gap-5 justify-center items-center w-full text-surface-600">
                        <p class="text-xl text-center font-medium">
                            Departamento de {{ iEvent.department?.name }} <br />
                        </p>
                        <div class="w-full">
                            <ul class="text-sm">
                                <li class="flex justify-between">
                                    <b>Telefone: </b> {{ iEvent.department?.phone ?? 'Não disponível' }}
                                </li>
                                <li class="flex justify-between">
                                    <b>Email: </b> {{ iEvent.department?.email ?? 'Não disponível' }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardRoot>

                <CardRoot class="flex justify-center items-center py-5">
                    <div class="flex flex-col gap-5 justify-center items-center w-full text-surface-600">
                        <p class="text-xl text-center font-medium">
                            Dá-nos a tua opinião sobre o evento
                        </p>
                        <div class="w-full flex flex-col gap-5">
                            <div class="flex gap-3">
                                <InputText v-model="feedback.name" placeholder="Nome" class="w-[300px] h-9"/>
                                <InputText v-model="feedback.email" placeholder="Email" class="w-[300px]  h-9"/>
                            </div>

                            <Textarea v-model="feedback.message" placeholder="Mensagem" rows="5" class="hover:border-zinc-400" />

                            <div class="w-full flex justify-end">
                                <Button icon="pi pi-send" label="Enviar" size="small" class="h-9" 
                                    @click="handleOk" :loading="feedback_busy"
                                />
                            </div>
                        </div>
                    </div>
                </CardRoot>
            </div>
        </div>
    </div>
</template>

