<script>
import { mapGetters } from 'vuex'
import AutoComplete from 'primevue/autocomplete';
import Card from 'primevue/card';
import InputGroup from 'primevue/inputgroup';
import Button from 'primevue/button'
import Image from 'primevue/image';
import { dateFormatter } from "@/utils/dateFormatter"
import EventServices from '@/services/EventServices';

export default {
    name: 'Event.viewer',
    components: {
        AutoComplete, Card,
        InputGroup, Button,
        Image
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
            }
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
    <div class="flex px-5 py-7 w-full h-[90vh] overflow-y-auto">
        <div class="flex flex-col gap-5 items-center min-h-[90vh] w-full">
            <Card class="w-full shadow-sm">
                <template #content>
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
                </template>
            </Card>
    
            <div v-if="!event" class="flex-grow flex w-full h-full justify-center items-center">
                <p class="text-xl text-surface-400 font-light">
                    Selecione um evento para ver as estatísticas
                </p>
            </div>
    
            <div class="flex gap-5 flex-grow w-full h-full" v-else>
                <Card class="basis-1/4">
                    <template #content>
                        <div class="flex flex-col gap-3">
    
                            <div class="w-full h-[218px] border">
                                <Image :src="event.imageURL" :imageStyle="{height: '218px', width: '218px'}"/>
                            </div>

                            <div>
                                <p class="text-xl font-medium">
                                    {{ event.name }}
                                </p>
                                <p>{{ event.localization }}</p>
                                <p>{{date_formatter(event.date)}} - {{ date_formatter(event.endDate) }}</p>
                            </div>
                        </div>
                    </template>
                </Card>
    
                <Card class="basis-3/4"></Card>
            </div>
        </div>
    </div>
</template>

<style>

div#autocomplete-statistic-viewer[data-pc-name="autocomplete"] input{
    border-radius: 0 5px 5px 0px;
}

</style>