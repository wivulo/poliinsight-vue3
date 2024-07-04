<script>
import { mapGetters } from 'vuex'
import AutoComplete from 'primevue/autocomplete';
import Card from 'primevue/card';
import InputGroup from 'primevue/inputgroup';
import Button from 'primevue/button'
import Image from 'primevue/image';
import { dateFormatter } from "@/utils/dateFormatter"

export default {
    name: 'Event.Statistic',
    components: {
        AutoComplete, Card,
        InputGroup, Button,
        Image
    },
    data(){
        return {
            value: '',
            items: [],
        }
    },
    async created(){
        if(this.$route.params.eventId){
            const potential = await this.$store.dispatch('event/fetchEventById', this.$route.params.eventId)

            if(potential.error || potential.response.status > 299){
                this.$toast.add({
                    severity: 'error',
                    summary: 'Erro ao pegar o evento',
                    detail: 'Alguma coisa deu errado, recarrege a página e tente novamente!',
                    life: 3000
                })
            }
        }
    },
    computed: {
        ...mapGetters({
            event: 'event/selectedEvent'
        }),
        date_formatter(){
            return dateFormatter
        }
    },
    methods: {
        search(event) {
            this.items = [...Array(10).keys()].map((item) => event.query + '-' + item);
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
                        <AutoComplete v-model="value" :suggestions="items" @complete="search" placeholder="Escreva para pesquisar" class="w-full h-9" inputClass="w-full border-l-0" id="autocomplete-statistic-viewer"/>
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
    
                            <div class="w-full h-52 border">
                                <Image />
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