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
        this.$router.push({name: 'gestao-eventos.finance.investments'})
        this.getEvents();
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

        handleSelectEvent(event){
            this.events.selectected = event
        }
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

                <template v-if="events.selectected">
                    <TabMenu :model="tabItems">
                        <template #item="{ item, props }">
                            <router-link v-slot="{ href, navigate }" :to="{name: item.route}" custom>
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
                                <component :is="Component" ref="componentTabela" :eventId="events.selectected?.id" />
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

                    <div v-else>
                        <div v-for="event in events.data" :key="event.id" class="flex justify-between items-center bg-gray-400/30 p-2 rounded-md cursor-pointer"
                            @click="handleSelectEvent(event)"
                        >
                            <div class="flex items-center gap-3">
                                <div class="w-12 h-12 rounded-full overflow-hidden">
                                    <img :src="event.imageURL" :alt="event.name" class="object-fill h-12" />
                                </div>
                                <div>
                                    <p class="text-slate-600 text-sm">{{ event.name }}</p>
                                    <p class="text-slate-400 text-xs">{{ event.description }}</p>
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