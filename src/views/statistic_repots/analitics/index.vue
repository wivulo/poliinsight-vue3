<script>
import EventServices from '@/services/EventServices';
import { mapGetters } from 'vuex';
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import InputGroup from 'primevue/inputgroup';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Dropdown from 'primevue/dropdown';
import CCard from "@/components/PCard/index.js"
import dayjs from 'dayjs'

export default {
    name: "statistic_repots.analitics",
    components: {
        Button, InputText,
        InputGroup, IconField,
        InputIcon, Dropdown,
        CardRoot: CCard.Root,
    },
    data(){
        return {
            busy: false,
            events: [],
            params: {
                query: null,
            },
        }
    },
    created(){
        this.fetchEvents()
    },
    computed: {
        ...mapGetters({
            user: 'auth/user'
        }),

        filtered_events(){
            if(!this.params.query) return this.events

            return this.events.filter(event => {
                return event.name.toLowerCase().includes(this.params.query.toLowerCase())
            })
        }
    },
    methods: {
        async fetchEvents(){
            this.busy = true
            const response = await EventServices.fetchEventsOrganizer(this.user.id)
            .catch(() => this.$toast.add({severity:'error', summary: 'Error', detail: 'Erro ao buscar os eventos', life: 3000}))
            .finally(() => this.busy = false )

            if(response.status == 200){
                this.events = response.data
                return
            }

            this.$toast.add({severity:'error', summary: 'Error', detail: 'Erro ao buscar os eventos', life: 3000})
        },

        handleViewEstatisticEvent(event){
            this.$router.push({name: 'analise_relatorios.analitics.show', params: {id: event.id}})
        },

        dateFormater(date) {
            return dayjs(date).format('D MMMM, YYYY')
        },
    }
}
</script>

<template>
    <div class="p-4 px-5 w-full">
        <div class="flex flex-col gap-5 items-center w-full">
            <CardRoot class="w-full shadow-sm cardroot">
                <InputGroup class="my-2">
                    <Button outlined class="h-9 w-9 border border-r-0 border-surface-300 bg-transparent hover:bg-transparent">
                        <i class="fa fa-search text-surface-700" />
                    </Button>
                    <InputText v-model="params.query" placeholder="Escreva para pesquisar" class="w-full h-9" inputClass="w-full border-l-0" />
                </InputGroup>

                <div v-if="busy" class="flex justify-center items-center h-32">
                    <i class="fa fa-spinner animate-spin text-black text-base" />
                </div>

                <div v-else-if="!busy && !filtered_events.length" class="flex-grow flex w-full h-full justify-center items-center py-5">
                    <p class="text-xl text-surface-400 font-light">
                        Nenhum evento encontrado
                    </p>
                </div>

                <div class="flex flex-wrap gap-5 w-full h-full py-2 pt-4 border-t border-zinc-100" v-else>
                    <div v-for="event in filtered_events" :key="event.id" class="event-block">
                        <div class="flex flex-col gap-2 p-3 h-full justify-between">
                            <div class="mb-2">
                                <p class="text-surface-700 font-semibold text-base text-ellipsis-2">{{ event.name }}</p>
                                <p class="text-surface-500 font-light text-sm text-ellipsis-2">
                                    {{ event.description }}
                                </p>
                            </div>
                            <Button size="small" @click="handleViewEstatisticEvent(event)" class="w-full h-8 bg-gray-400 border-0">
                                Ver mapa
                            </Button>
                        </div>
                    </div>
                </div>
            </CardRoot>
        </div>
    </div>
</template>

<style scoped>
.event-block {
    @apply max-w-[18vw] h-40 bg-slate-200/80 rounded-md shadow-sm;
}
</style>