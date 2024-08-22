<script>
import EventServices from '@/services/EventServices';
import { dateFormatter } from "@/utils/dateFormatter"
import AutoComplete from 'primevue/autocomplete';
import Card from 'primevue/card';
import InputGroup from 'primevue/inputgroup';
import Button from 'primevue/button'
import Image from 'primevue/image';
import Dropdown from 'primevue/dropdown';
import CCard from "@/components/PCard/index.js"
import TabMenu from 'primevue/tabmenu';


export default {
    name: 'Event.viewer',
    components: {
        AutoComplete, Card,
        InputGroup, Button, TabMenu,
        Image, Dropdown, CardRoot: CCard.Root
    },
    data(){
        return {
            busy: false,
            event: null,
            events: {
                busy: false,
                data: []
            },
            params: {
                query: null,
                orderBy: {
                    field: 'name',
                    direction: 'asc'
                },
                userId: this.$store.getters['auth/user'].id,
            },

            tabItems: [
                { label: 'Incrições', icon: 'fa fa-pencil', route: 'event.show.registrations' },
                { label: 'Ingressos', icon: 'fa fa-dolar', route: 'event.show.tickets' },
            ]
        }
    },
    async created(){
        this.getEvent()
    },
    computed: {
        date_formatter(){
            return dateFormatter
        }
    },
    methods: {
        async getEvent(){
            this.busy = true
            const responde = await EventServices.show(this.$route.params.id)
            .catch(() => this.$toast.add({severity: 'error', summary: 'Erro', detail: 'Erro ao buscar evento'}))
            this.event = responde.data
            this.busy = false
        },

        async getEvents(query){
            console.log(query?.query)
            this.events.busy = true
            const responde = await EventServices.search(this.params)
            .catch(() => this.$toast.add({severity: 'error', summary: 'Erro', detail: 'Erro ao buscar os eventos'}))
            this.events.data = responde.data
            this.events.busy = false
        }
    }
}
</script>

<template>
    <div class="flex px-5 py-7 w-full">
        <div class="flex flex-col gap-5 items-center w-full">
            <CardRoot class="w-full shadow-sm cardroot">
                <InputGroup>
                    <Button outlined class="h-9 w-9 border border-r-0 border-surface-300 bg-transparent hover:bg-transparent">
                        <i class="fa fa-search text-surface-700" />
                    </Button>
                    <AutoComplete v-model="params.query" :suggestions="events.data" @complete="getEvents" placeholder="Escreva para pesquisar" class="w-full h-9" inputClass="w-full border-l-0" id="autocomplete-statistic-viewer" >
                        <template #option="slotProps">
                            <div class="flex items-center">
                                <div>{{ slotProps.option.name }}</div>
                            </div>
                        </template>
                    </AutoComplete>
                </InputGroup>
            </CardRoot>
    
            <div v-if="!event" class="flex-grow flex w-full h-full justify-center items-center">
                <p class="text-xl text-surface-400 font-light">
                    Selecione um evento para ver as estatísticas
                </p>
            </div>
    
            <div class="flex gap-5 w-full h-full" v-else>
                <CardRoot class="w-[30%] h-[530px]">
                    <div class="flex flex-col gap-3">
    
                            <div class="w-full h-[218px] border overflow-hidden">
                                <Image :src="event.imageURL" class="object-fill object-center" imageClass="h-[218px]" alt="event.name" preview/>
                            </div>

                            <div>
                                <p class="text-xl font-medium">
                                    {{ event.name }}
                                </p>
                                <p>{{ event.localization }}</p>
                            </div>

                        <div class="mt-2">
                            <ul class="flex flex-col gap-2 text-sm">
                                <li>
                                    <p><b>Tipo:</b></p>
                                    <p>{{ event?.type == 'free' ? 'Grátuito' : 'Pago' }}</p>
                                </li>
                                <li>
                                    <p><b>Categoria</b>: </p>
                                    <p>{{ event?.category?.name }}</p>
                                </li>
                                <li>
                                    <p><b>Departamento</b>:</p>
                                    <p>{{ event?.departament }}</p>
                                </li>
                                <li>
                                    <p><b>Vagas</b>:</p>
                                    <p>{{ event?.vacancies }}</p>
                                </li>
                                <li>
                                    <p><b>Data de início</b>:</p>
                                    <p>{{date_formatter(event.date)}}</p>
                                </li>
                                <li>
                                    <p><b>Data de fim</b>:</p>
                                    <p>{{ date_formatter(event.endDate) }}</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardRoot>
    
                <CardRoot class="w-[70%] h-[530px]">
                   <div class="flex flex-col gap-5">
                        <TabMenu :model="tabItems">
                            <template #item="{ item, props }">
                                <router-link v-slot="{ href, navigate }" :to="{name: item.route}" custom>
                                    <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                                        <span v-bind="props.icon" />
                                        <span v-bind="props.label">{{ item.label }}</span>
                                    </a>
                                </router-link>
                            </template>
                        </TabMenu>

                        <div>
                            <router-view v-slot="{ Component }">
                                <transition>
                                    <component :is="Component" />
                                </transition>
                            </router-view>
                        </div>
                   </div>
                </CardRoot>
            </div>
        </div>
    </div>
</template>

<style scoped>
div#autocomplete-statistic-viewer[data-pc-name="autocomplete"] input{
    border-radius: 0 5px 5px 0px;
}

.cardroot div[data-pc-section="content"]{
    @apply py-[5px]
}

.cardroot div[data-pc-section="body"] {
    @apply px-[5px]
}

ul li{
    @apply flex justify-between gap-1
}
</style>