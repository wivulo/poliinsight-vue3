<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router';
import EventServices from '@/services/EventServices';
import { useNotification } from '@/composables/useNotification'
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import ModalEditEvent from "@/views/event/components/ModalEditEvent.vue"
import ModalDeleteEvent from "@/views/event/components/ModalDeleteEvent.vue"
import EventStatus from '@/components/EventStatus.vue';
import Dropdown from 'primevue/dropdown';
import CardRoot from "@/components/PCard/CardRoot.vue"

const route = useRoute()
const store = useStore()
const user = computed(() => store.getters['auth/user'])

const { notifyError } = useNotification()

const busy = ref(false)
const events = ref([])
const filter = ref(null)


async function fetchEvents(){
   try {
       busy.value = true
       const response = await EventServices.fetchEventsOrganizer(route.params.id)
       events.value = response.data
   } catch (error) {
       console.log(error)
       notifyError(error)
   } finally {
       busy.value = false
   }
}
fetchEvents()
</script>

<template>
    <div class="flex flex-col gap-5 w-full">
        <div v-if="busy" class="flex-grow flex w-full h-full justify-center items-center">
            <i class="fa fa-spinner animate-spin text-black text-base" />
        </div>

        <div v-else-if="!busy && events.length === 0" class="flex-grow flex w-full h-full justify-center items-center">
            <p class="text-xl text-surface-400 font-light">
                Nenhum evento encontrado!
            </p>
        </div>

        <div v-else class="flex flex-wrap gap-3 w-full">
            <CardRoot 
                v-for="event in events" :key="event.id" :event="event" 
                class="w-[233px] max-h-[180px] min-h-[110px] border hover:bg-zinc-100" 
                :class="{'border-green-500': event.status?.name === 'Aberto', 'border-yellow-500': event.status?.name === 'Brevemente', 'border-red-500': event.status?.name === 'Cancelado'}"
            >
                <div class="flex justify-between items-center text-ellipsis-2" :title="event.name">
                    <RouterLink :to="{name: 'event.show', params: {id: event.id}}" class="text-sm font-bold text-surface-900 cursor-pointer">{{ event.name }}</RouterLink>
                </div>

                <div class="flex flex-col gap-1 text-surface-500 text-xs mt-2">
                    <p class="flex">
                        <span v-formatDate="event.startDate" />
                    </p>
                    <p><i class="pi pi-map-marker"></i> {{ event.location }}</p>
                </div>
            </CardRoot>
        </div>
    </div>
</template>