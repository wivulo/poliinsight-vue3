<script>
import EventServices from '@/services/EventServices';
import { setDocumentTitleMixin } from "@/config/document.title.js"
import { mapGetters } from 'vuex'
import AutoComplete from 'primevue/autocomplete';
import Card from 'primevue/card';
import InputGroup from 'primevue/inputgroup';
import Button from 'primevue/button'
import { dateFormatter } from "@/utils/dateFormatter"

export default {
    name: "event.registrations",
    mixins: [setDocumentTitleMixin],
    components: {
        AutoComplete, Card,
        InputGroup, Button,
    },
    data() {
        return {
            title: 'Poliinsight | Incrições',
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
        };
    },
    methods: {
        async getEvents(query){
            this.events.busy = true
            const responde = await EventServices.search(this.params)
            .catch(() => this.$toast.add({severity: 'error', summary: 'Erro', detail: 'Erro ao buscar os eventos'}))
            this.events.data = responde.data
            this.events.busy = false
        },

        handleItemSelected(event){
            // console.log(event.value)
            this.$router.push({name: 'event.registrations.show', params: {id: event.value.id}})
        }
    }
}
</script>

<template>
    <div class="flex flex-col gap-5 px-5 py-7 w-full">
        <div class="flex items-center w-full">
            <InputGroup>
                <Button outlined class="h-9 w-9 border border-r-0 border-surface-300 bg-transparent hover:bg-transparent">
                    <i class="fa fa-search text-surface-700" />
                </Button>
                <AutoComplete v-model="params.query" :suggestions="events.data" @complete="getEvents" placeholder="Escreva para pesquisar um evento" class="w-full h-9" inputClass="w-full border-l-0"
                    @item-select="handleItemSelected" optionLabel="name" :loading="events.busy"
                >
                    <template #option="slotProps">
                        <div class="flex items-center">
                            <div>{{ slotProps.option.name }}</div>
                        </div>
                    </template>
                </AutoComplete>
            </InputGroup>
        </div>
    
        <div class="flex w-full justify-center items-center mt-4">
            <p class="text-xl text-surface-400 font-light">
                Selecione um evento para fazer Incrições
            </p>
        </div>
    </div>
</template>