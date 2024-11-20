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
import ModalNewRegistration from './components/ModalNewRegistration.vue';
import RegistrationTable from "@/views/event/components/RegistrationTable.vue"
import TicketsTable from "@/views/event/components/TicketsTable.vue"

export default {
    name: 'Event.viewer',
    components: {
        AutoComplete, Card, ModalNewRegistration,
        InputGroup, Button, TabMenu,
        Image, Dropdown, CardRoot: CCard.Root,
        RegistrationTable, TicketsTable
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
                { label: 'Incrições', component: 'RegistrationTable', icon: 'fa fa-pencil', route: 'event.show.registrations' },
                { label: 'Ingressos', component: 'TicketsTable' , icon: 'fa fa-file', route: 'event.show.tickets' },
            ],
            tabICurrenttem: 'RegistrationTable',
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
            try {
                this.busy = true
                const responde = await EventServices.show(this.$route.params.id)
                this.event = responde.data
            } catch (error) {
                this.handleError('Erro ao buscar evento')
            } finally {
                this.busy = false
            }
        },

        async getEvents(){
            try {
                this.events.busy = true
                const responde = await EventServices.search(this.params)
                this.events.data = responde.data
            } catch (error) {
                this.handleError('Erro ao buscar os eventos')
            } finally {
                this.events.busy = false
            }
        },

        handleShowModalNewRegistration(){
            this.$refs.ModalNewRegistration.show()
        },

        handleRegistrationCompleted(){
            this.getEvent()
            this.$refs.componentTabela.updateComponent()
        },

        handleEventSelected(event){
            this.$router.push({name: 'event.show', params: {id: event.id}})
        },

        handleChangeTable(component){
            this.tabICurrenttem = component
        },

        handleError(error){
            this.$toast.add({severity: 'error', summary: 'Erro', detail: error})
        }
    }
}
</script>

<template>
    <div id="eventShow" class="flex flex-col px-5 pt-7 pb-5 gap-5 w-full flex-auto">
        <ModalNewRegistration 
            ref="ModalNewRegistration" 
            @created:registration="handleRegistrationCompleted" 
        />

        <!-- <div class="flex flex-col gap-5 w-full"> -->
            <CardRoot class="w-full shadow-sm cardroot">
                <InputGroup>
                    <Button outlined class="h-9 w-9 border border-r-0 border-surface-300 bg-transparent hover:bg-transparent">
                        <i class="fa fa-search text-surface-700" />
                    </Button>
                    <AutoComplete v-model="params.query" :suggestions="events.data" @complete="getEvents" 
                        placeholder="Escreva para pesquisar" class="w-full h-9" inputClass="w-full border-l-0" 
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

                        <div class="flex flex-col gap-3 border-t border-zinc-200 py-2">
                            <Button severity="secondary" size="small" class="h-9 bg-gray-400/80 hover:bg-gray-400 border-0 w-full" @click="handleShowModalNewRegistration">
                                <span class="text-black">
                                    <i class="fa fa-file-signature text-sm " /> Fazer inscrição
                                </span>
                            </Button>

                            <router-link v-slot="{ navigate }" :to="{name: 'analise_relatorios.analitics.show', params: {id: event.id}}" custom>
                                <Button severity="secondary" v-ripple size="small" class="h-9 bg-gray-400/80 border-0 hover:bg-gray-400 w-full p-ripple" @click="navigate">
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
                        <TabMenu :model="tabItems">
                            <template #item="{ item, props }">
                                <div v-ripple @click="() => handleChangeTable(item.component)" class="px-3 py-[.5rem] text-sm border border-gray-400/40  hover:bg-red-700/50 cursor-pointer hover:text-white"
                                    :class="{'bg-[#DA5551] text-white': item.component == tabICurrenttem}">
                                    <span v-bind="props.icon" />
                                    <span v-bind="props.label">{{ item.label }}</span>
                                </div>
                            </template>
                        </TabMenu>

                        <div>
                            <!-- <router-view v-slot="{ Component }"> -->
                                <transition>
                                    <component 
                                        :is="tabICurrenttem" 
                                        ref="componentTabela"
                                        :eventType="event.category?.name"
                                    />
                                </transition>
                            <!-- </router-view> -->
                        </div>
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