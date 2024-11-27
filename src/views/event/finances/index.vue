<script>
import EventServices from '@/services/EventServices';
import { setDocumentTitleMixin } from "@/config/document.title.js"
import { mapGetters } from 'vuex';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import CCard from "@/components/PCard/index.js"
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import TabMenu from 'primevue/tabmenu';

export default {
    name: "event.finances",
    mixins: [setDocumentTitleMixin],
    components: {
        Dropdown, Button, CardRoot: CCard.Root,
        InputText, InputGroup, TabMenu
    },
    data(){
        return {
            title: 'Poliinsight | Finanças',
            events: {
                busy: false,
                data: [],
                selectected: false
            },
            event: {
                busy: false,
                data: null,
            },

            filter: null,

            tabItems: [
                { label: 'Investimentos', icon: 'fa fa-coins', route: 'gestao-eventos.finance.investments' },
                { label: 'Receitas', icon: 'fa fa-hand-holding-usd', route: 'gestao-eventos.finance.income' },
                { label: 'Despesas', icon: 'fa fa-money-bill-wave', route: 'gestao-eventos.finance.expenses' },
                { label: 'Relatórios', icon: 'fa fa-file-alt', route: 'gestao-eventos.finance.reports' },
            ]
        }
    },
    created(){
        this.$router.push({name: 'gestao-eventos.finance.investments', query: this.$route.query})
        this.getEvents();

        if(this.$route.query.eventId){
            this.getEvent(this.$route.query.eventId)
        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/user'
        }),
    },
    methods: {
        async getEvents(){
            this.events.busy = true
            const response = await EventServices.fetchEventsOrganizer(this.user.id)
            .catch(() => this.$toast.add({severity:'error', summary: 'Error', detail: 'Erro ao buscar os eventos', life: 3000}))
            .finally(() => this.events.busy = false )

            if(response.status == 200){
                this.events.data = response.data
                return
            }

            this.$toast.add({severity:'error', summary: 'Error', detail: 'Erro ao buscar os eventos', life: 3000})
        },

        async getEvent(eventId){
            try {
                this.event.busy = true
                const responde = await EventServices.show(eventId)
                .catch(() => this.$toast.add({severity: 'error', summary: 'Erro', detail: 'Erro ao buscar evento'}))
                this.event.data = responde.data
            }finally{
                this.event.busy = false
            }
        },

        async handleSelectEvent(event){
            await this.getEvent(event.id)
            this.$router.push({query: {eventId: event.id}})
        }
    },
    watch: {
        // $route(to, from){
        //     if(to.query.eventId){
        //         this.getEvent(to.query.eventId)
        //     }
        // }
    }
}
</script>

<template>
    <div class="w-full py-3 px-5">
        <div class="mt-4 flex gap-5">
            <CardRoot class="grow">
                <div class="flex flex-col mb-5">
                    <p class="text-base font-semibold">Finanças</p>
                    <p class="text-sm">Controle as finanças do evento aqui</p>
                </div>

                <template v-if="event.data">
                    <TabMenu :model="tabItems">
                        <template #item="{ item, props }">
                            <router-link v-slot="{ href, navigate }" :to="{name: item.route, query: $route.query}" custom>
                                <a v-ripple :href="href" v-bind="props.action" @click="navigate" class="text-sm">
                                    <span v-bind="props.icon" />
                                    <span v-bind="props.label">{{ item.label }}</span>
                                </a>
                            </router-link>
                        </template>
                    </TabMenu>

                    <div>
                        <router-view v-slot="{ Component }">
                            <transition>
                                <component :is="Component" ref="componentTabela" :eventId="event.data?.id" />
                            </transition>
                        </router-view>
                    </div>
                </template>

                <template v-else>
                    <div class="flex justify-center items-center py-10">
                        <p class="text-slate-600 text-sm">Selecione um evento para continuar</p>
                    </div>
                </template>
            </CardRoot>

            <CardRoot class="flex-none w-80">
                <div class="flex mb-2">
                    <InputGroup>
                        <Button size="small" class="h-9 bg-transparent border border-surface-300 border-r-0">
                            <i class="fa fa-search text-black" />
                        </Button>

                        <InputText size="small" v-model="filter" id="search" type="text" placeholder="Escreva para pesquisar..." class="w-full rounded-none h-9 border-l-0" />
                    </InputGroup>
                </div>

                <hr />

                <div class="flex flex-col gap-5 mt-3">

                    <div v-if="events.busy" class="py-4">
                        <div class="flex justify-center items-center">
                            <i class="fa fa-spinner animate-spin text-black"></i>
                        </div>
                    </div>

                    <div v-else-if="!events.data.length" class="py-4">
                        <div class="flex justify-center items-center">
                            <p class="text-slate-600 text-sm">Nenhum evento encontrado</p>
                        </div>
                    </div>

                    <div v-else class="flex flex-col gap-3">
                        <div v-for="eventi in events.data" :key="eventi.id" class="flex h-[65px] items-center bg-gray-400/30 hover:bg-gray-400/40 p-2 rounded-md cursor-pointer border-l-4 relative overflow-hidden"
                            @click="handleSelectEvent(eventi)"
                            :class="{'bg-gray-400/40 border-primary-500': $route.query.eventId == eventi.id}"
                        >
                            <div v-if="event.busy" class="absolute top-0 left-0 w-full h-[65px] flex items-center justify-center bg-gray-400/10 z-20 rounded-md">
                                <div class="flex justify-center items-center">
                                    <i class="fa fa-spinner animate-spin text-black"></i>
                                </div>
                            </div>

                            <div class="flex items-center gap-3 z-10">
                                <div class="image-container">
                                    <img :src="eventi.imageURL" :alt="eventi.name" class="image" />
                                </div>
                                <div>
                                    <p class="text-slate-800 text-sm">{{ eventi.name }}</p>
                                    <p class="text-slate-400 text-xs">{{ eventi.description }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardRoot>
        </div>
    </div>
</template>

<style>
    
</style>