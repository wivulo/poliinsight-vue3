<script>
import EventServices from '@/services/EventServices';
import CategoryService from '@/services/CategoryService';
import { mapGetters } from 'vuex';
import Button from 'primevue/button';
import ProgressBar from 'primevue/progressbar';
import Badge from 'primevue/badge';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Textarea from 'primevue/textarea'
import Calendar from 'primevue/calendar';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import FileUploader from '@/components/FileUploader.vue';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';

export default {
    name: 'Admin.CreateEvent',
    components: {
        FileUploader, Button, ProgressBar, Badge,
        InputText, FloatLabel, Textarea, Calendar,
        IconField, InputIcon, Dropdown, InputNumber
    },
    data(){
        return {
            categories: {
                data: [],
                busy: false,
                selected: null
            },
            event_type: [
                {label: 'Gratuito', value: 'free'},
                {label: 'Pago', value: 'paid'}
            ],
            eventTypeSelected: null,
            flayerName: null,
            event: {
                flayer: null,
                organizerId: 1,
                name: '',
                description: '',
                date: null,
                endDate: null,
                time: '',
                timeEnd: '',
                localization: '',
                departament: '',
                vacancies: 0,
                type: '',
                categoryId: null
            },

            busy: false
        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/user'
        }),
    },
    created(){
        this.buscarCategorias()
    },
    methods: {
        handleErrorMessage(){
            this.$toast.add({
                    severity: 'error',
                    summary: 'Error', 
                    detail: 'Erro ao criar o evento', 
                    life: 2000
            })
        },
        
        async handleCreateEvent(){ 
            // console.log(this.event)      
            this.busy = true
            this.event.categoryId = this.categories.selected.id
            this.event.type = this.eventTypeSelected.value
            // console.log(this.event)
            const response = await EventServices.createEvent({...this.event, organizerId: this.user.id})
            .catch(() => this.handleErrorMessage())
            this.busy = false
            
            if(response.error){
                this.handleErrorMessage()
                return
            }

            this.$toast.add({severity: 'success', summary: 'Success', detail: 'Evento criado com sucesso', life: 2000})
            this.$router.push({
                    name: 'event.show',
                    params: {
                        id: response.data.id
                    }
            })
        },
        
        handleUploadedFile(file){
            this.event.flayer = file
        },

        async buscarCategorias(){
            this.categories.busy = true
            const response = await CategoryService.index()
            .finally(() => this.categories.busy = false)
            
            if(response.error){
                this.$toast.add({severity: 'error', summary: 'Error', detail: 'Erro ao buscar as categorias', life: 2000})
                return
            }
            
            this.categories.data = response.data
        }
    },
}
</script>

<template>
    <div class="p-4 px-5 w-full flex flex-col gap-5">
        <div>
            <p class="text-surface-600 font-semibold text-lg">Criar Evento</p>
        </div>

        <div class="flex w-full my-3 gap-5 justify-between">
            <div class="flex flex-col">
                <label for="category" class="flex-grow pl-3 text-surface-400">
                    <small>Catégoria</small>
                </label>
                <Dropdown id="category" v-model="categories.selected"  :options="categories.data" optionLabel="name" placeholder="Selecione uma categória" class="h-9 w-[290px]">
                    <template #value="slotProps">
                        <div v-if="slotProps.value" class="flex items-center text-black">
                            {{ slotProps.value.name }}
                        </div>
                        <div v-else>
                            {{ slotProps.placeholder }}
                        </div>
                    </template>
                </Dropdown>
            </div>

            <div class="flex flex-col">
                <label for="vacancies" class="pl-3 text-surface-400">
                    <small> Número de vagas </small>
                </label>
                <InputNumber id="vacancies" v-model="event.vacancies" class="w-full border-slate-300 h-9" :required="true"/>
            </div>

            <div class="flex flex-col">
                <label for="freeOrPaid" class="pl-3 text-surface-400">
                    <small> Tipo de evento </small>
                </label>
                <Dropdown id="freeOrPaid" v-model="eventTypeSelected"  :options="event_type" optionLabel="label" placeholder="Selecione o tipo de evento" class="h-9 w-[290px]">
                    <template #value="slotProps">
                        <div v-if="slotProps.value" class="flex items-center text-black">
                            {{ slotProps.value.label }}
                        </div>
                        <div v-else>
                            {{ slotProps.placeholder }}
                        </div>
                    </template>
                </Dropdown>
            </div>

            <div class="flex flex-col">
                <label for="departament" class="pl-3 text-surface-400">
                    <small> Departamento </small>
                </label>
                <InputText id="departament" v-model="event.departament" class="w-full border-slate-300 h-9" :required="true" placeholder="Ex:. Engenharia"/>
            </div>
        </div>

        <div class="flex flex-col gap-3">
            <div class="flex gap-3 flex-grow">

                <div class="flex flex-grow max-w-[439px] max-h-[326px]">
                    <FileUploader @uploaded="handleUploadedFile"/>
                </div>

                <div class="flex flex-col gap-4 flex-grow">
                    <FloatLabel>
                        <InputText id="name" v-model="event.name" class="w-full border-slate-300 h-9" :required="true"/>
                        <label for="name" class="text-slate-400">
                            <small class="text-slate-400"> Nome do evento </small>
                        </label>
                    </FloatLabel>

                    <Textarea v-model="event.description" rows="5" cols="30" placeholder="Descrição do evento" class="hover:border-slate-400"/>

                    <FloatLabel class="mt-2">
                        <InputText id="localization" v-model="event.localization" class="w-full border-slate-300 h-9" :required="true"/>
                        <label for="localization" class="text-slate-400">
                            <small class="text-slate-400"> Localização </small>
                        </label>
                    </FloatLabel>

                    <div class="flex gap-3">
                        <Calendar v-model="event.date" placeholder="Data de inicio" :showIcon="true" :readonlyInput="true" :showOnFocus="true" :minDate="new Date()" :maxDate="new Date(2025, 12, 31)" iconDisplay="input" class="flex-grow border-slate-300 h-9 focus:outline-slate-400" inputClass="hover:border-slate-400"/>

                        <Calendar v-model="event.endDate" placeholder="Data de fim" :showIcon="true" :readonlyInput="true" :showOnFocus="true" :minDate="new Date()" :maxDate="new Date(2025, 12, 31)"  iconDisplay="input" class="flex-grow border-slate-300 h-9 focus:outline-slate-400" inputClass="hover:border-slate-400"/>
                    </div>

                    <div class="flex gap-3">
                        <IconField class="border border-surface-300 rounded-md h-10 flex-grow">
                            <InputIcon>
                                <i class="fa fa-clock" />
                            </InputIcon>

                            <Calendar id="calendar-timeonly" v-model="event.time" timeOnly class="remove-border h-9 w-full" placeholder="Hora de inicio"/>
                        </IconField>

                        <IconField class="border border-surface-300 rounded-md h-10 flex-grow">
                            <InputIcon>
                                <i class="fa fa-clock" />
                            </InputIcon>

                            <Calendar id="calendar-timeonly" v-model="event.timeEnd" timeOnly class="remove-border h-9 w-full" placeholder="Hora de termino"/>
                        </IconField>
                    </div>
                </div>
            </div>

            <div class="w-full flex justify-end">
                <Button @click="handleCreateEvent" class=" text-black" size="small" :disabled="busy">
                    <i class="fas fa-spinner animate-spin mr-1" v-if="busy" />
                   {{ busy ? 'Criando o evento...' : ' Criar evento' }}
                </Button>
            </div>
        </div>
    </div>
</template>

<style>
#calendar-timeonly.remove-border input {
   border: none !important;
}
</style>
