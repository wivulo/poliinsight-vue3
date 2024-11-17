<script>
import EventConfigServices from '@/services/EventConfigServices.js';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import Dropdown from 'primevue/dropdown';
import RegistrationTableTeam from './RegistrationTableTeam.vue';
import RegistrationTableSingle from './RegistrationTableSingle.vue';

export default {
    name: "event.show.registrations",
    props: {
        eventType: {
            type: String,
            required: true
        }
    },
    components: {
        DataTable, Column, Button, InputText, InputGroup, Dropdown,
        RegistrationTableTeam, RegistrationTableSingle
    },
    data(){
        return {
            busy: false,
            filter: null,

            eventConfig: {
                data: {},
                busy: false
            },
            
            activeTable: null
        }
    },
    async created(){
        await this.getEventConfig();
    },
    methods: {
        async getEventConfig(){
            try {
                this.busy = true
                const responde = await EventConfigServices.showByEventType(this.eventType)
                
                const conf = responde.data
                
                if(conf.registrationType == 'single' || conf.registrationType == 'hibrido'){
                    this.activeTable = 'RegistrationTableSingle'
                }else{
                    this.activeTable = 'RegistrationTableTeam'
                }
            } catch (error) {
                this.handleError('Erro ao buscar configuração do evento')
            } finally {
                this.busy = false
            }
        },
    }
}

</script>

<template>
    <div class="flex flex-col">
        <div class="flex">
            <InputGroup>
                <Button size="small" class="h-9 bg-transparent border border-surface-300 border-r-0">
                    <i class="fa fa-search text-black" />
                 </Button>
                <InputText size="small" v-model="filter" id="search" type="text" placeholder="Escreva para pesquisar..." class="w-full rounded-none h-9 border-l-0" />
            </InputGroup>
        </div>

        <template v-if="activeTable">
            <component :is="activeTable" />
        </template>

        <template v-else>
            <div>
                carregando...
            </div>
        </template>
    </div>
</template>