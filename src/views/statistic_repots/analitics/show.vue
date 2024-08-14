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
    name: 'Statistic_repots.analitics.show',
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
    
            <div class="flex gap-5 flex-grow w-full h-full" v-if="event">
               
            </div>
        </div>
    </div>
</template>

<style>

div#autocomplete-statistic-viewer[data-pc-name="autocomplete"] input{
    border-radius: 0 5px 5px 0px;
}

</style>