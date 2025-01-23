<script>
import EventServices from '@/services/EventServices';
import CategoryService from '@/services/CategoryService';
import DepartamentService from '@/services/DepartamentService';
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
import CCard from "@/components/PCard/index.js"

export default {
    name: 'Admin.CreateEvent',
    components: {
        FileUploader, Button, ProgressBar, Badge,
        InputText, FloatLabel, Textarea, Calendar,
        IconField, InputIcon, Dropdown, InputNumber,
        CardRoot: CCard.Root,
    },
    data(){
        return {
            categories: {
                data: [],
                busy: false,
                selected: null
            },

            department: {
                data: [],
                busy: false,
                selected: null
            },

            event_type: [
                {label: 'Gratuito', value: 'Gratuito'},
                {label: 'Pago', value: 'Pago'}
            ],

            eventTypeSelected: null,
            flayerName: null,
            event: {
                flayer: null,
                organizerId: 1,
                name: '',
                description: '',
                startDate: null,
                endDate: null,
                startTime: '',
                endTime: '',
                location: '',
                departmentId: '',
                vacancies: 0,
                type: '',
                categoryId: null
            },

            busy: false,

            fieldInvalid: {},
        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/user'
        }),
    },
    created(){
        this.buscarCategorias()
        this.fetchDepartments()
    },
    methods: {
        handleErrorMessage(message){
            this.$toast.add({
                    severity: 'error',
                    summary: 'Erro', 
                    detail: message, 
                    life: 2000
            })
        },
        
        async handleCreateEvent(){
            const [ valid, names ] = this.verifyRequiredFields()
            if(!valid){
                names.forEach(name => {
                    this.handleErrorMessage(`O campo ${name} é obrigatório`)
                })

                return
            }

            const result = await this.$swal.fire({
                    text: 'Tem a certeza?',
                    icon: 'warning',
                    cancelButtonText: 'Não',
                    confirmButtonText: 'Sim, tenho',
            })

            if(!result.isConfirmed) return

            this.busy = true
            // this.event.categoryId = this.categories.selected.id
            // this.event.type = this.eventTypeSelected.value
            const response = await EventServices.createEvent({...this.event, organizerId: this.user.id})
            .catch(() => this.handleErrorMessage())
            this.busy = false
            
            if(response.status < 200 || response.status >= 300){
                this.handleErrorMessage('Erro ao criar o evento')
                return
            }

            this.$toast.add({severity: 'success', summary: 'Success', detail: 'Evento criado com sucesso', life: 2000})
            this.$router.push({name: 'event.show', params: { id: response.data.id } })
        },
        
        handleUploadedFile(file){
            this.event.flayer = file
        },

        async buscarCategorias(){
            try {
                this.categories.busy = true
                const response = await CategoryService.index()
            
                if(response && response?.error){
                    throw new Error('Erro ao buscar as categorias')
                }
                
                this.categories.data = response.data
            } catch (error) {
                this.$toast.add({severity: 'error', summary: 'Error', detail: 'Erro ao buscar as categorias', life: 2000})
            } finally {
                this.categories.busy = false
            }
        },

        async fetchDepartments(){
            try {
                this.department.busy = true
                const response = await DepartamentService.index()
                
                if(response && response?.error){
                    throw new Error('Erro ao buscar os departamentos')
                }
                
                this.department.data = response.data
            } catch (error) {
                this.$toast.add({severity: 'error', summary: 'Error', detail: 'Erro ao buscar os departamentos', life: 2000})
            } finally {
                this.department.busy = false
            }
        },

        verifyRequiredFields() {
            let fieldInvalidName = [];

            this.fieldInvalid = Object.entries(this.event).reduce((acc, [key, value]) => {
                if (value === '' || value === null) {
                    acc[key] = value;
                    fieldInvalidName.push(key);
                }
                return acc;
            }, {});

            const count = fieldInvalidName.length;
            const valid = count === 0;

            return [valid, fieldInvalidName];
        },
    },
}
</script>

<template>
    <CardRoot class="w-full">
        <div class="w-full flex flex-col gap-3">
            <div>
                <p class="text-surface-600 font-semibold text-lg">Criar Evento</p>
            </div>

            <div class="flex w-full my-3 gap-5 justify-between">
                <div class="flex flex-col">
                    <label for="category" class="flex-grow pl-3 text-surface-400">
                        <small>Catégoria</small>
                    </label>
                    <Dropdown id="category" v-model="event.categoryId" optionLabel="name" option-value="id"  :options="categories.data" placeholder="Selecione uma categória" class="h-9 w-[290px]">
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="flex items-center text-black">
                                {{ categories.data.find(cat => cat.id === slotProps.value).name }}
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
                        <small> Acesso ao evento </small>
                    </label>
                    <Dropdown id="freeOrPaid" v-model="event.type"  :options="event_type" optionLabel="label" optionValue="value" placeholder="Selecione a forma de acesso ao evento" class="h-9 w-[290px]">
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="flex items-center text-black">
                                {{ slotProps.value }}
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
                    <!-- {{ event.departamentId }} -->
                    <!-- <InputText id="departament" v-model="event.departament" class="w-full border-slate-300 h-9" :required="true" placeholder="Ex:. Engenharia"/> -->
                    <Dropdown id="department" v-model="event.departmentId"  :options="department.data" optionLabel="name" option-value="id" placeholder="Selecione um departamento" class="h-9 w-[230px]">
                        <template #value="slotProps">
                            <div v-if="slotProps.value" class="flex items-center text-black">
                                {{ department.data.find(department => department.id === slotProps.value).name }}
                            </div>
                            <div v-else>
                                {{ slotProps.placeholder }}
                            </div>
                        </template>
                    </Dropdown>
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
                            <InputText id="localization" v-model="event.location" class="w-full border-slate-300 h-9" :required="true"/>
                            <label for="localization" class="text-slate-400">
                                <small class="text-slate-400"> Localização </small>
                            </label>
                        </FloatLabel>

                        <div class="flex gap-3">
                            <Calendar v-model="event.startDate" placeholder="Data de inicio" :showIcon="true" :readonlyInput="true" :showOnFocus="true" :minDate="new Date()" :maxDate="new Date(2025, 12, 31)" iconDisplay="input" class="flex-grow border-slate-300 h-9 focus:outline-slate-400" inputClass="hover:border-slate-400"/>

                            <Calendar v-model="event.endDate" placeholder="Data de fim" :showIcon="true" :readonlyInput="true" :showOnFocus="true" :minDate="new Date()" :maxDate="new Date(2025, 12, 31)"  iconDisplay="input" class="flex-grow border-slate-300 h-9 focus:outline-slate-400" inputClass="hover:border-slate-400"/>
                        </div>

                        <div class="flex gap-3">
                            <IconField class="border border-surface-300 rounded-md h-10 flex-grow">
                                <InputIcon>
                                    <i class="fa fa-clock" />
                                </InputIcon>

                                <Calendar id="calendar-timeonly" v-model="event.startTime" timeOnly class="remove-border h-9 w-full" placeholder="Hora de inicio"/>
                            </IconField>

                            <IconField class="border border-surface-300 rounded-md h-10 flex-grow">
                                <InputIcon>
                                    <i class="fa fa-clock" />
                                </InputIcon>

                                <Calendar id="calendar-timeonly" v-model="event.endTime" timeOnly class="remove-border h-9 w-full" placeholder="Hora de termino"/>
                            </IconField>
                        </div>
                    </div>
                </div>

                <div class="w-full flex justify-end">
                    <Button @click="handleCreateEvent" class="h-8 text-black" size="small" :disabled="busy">
                        <i class="fas fa-spinner animate-spin mr-1" v-if="busy" />
                    {{ busy ? 'Criando o evento...' : ' Criar evento' }}
                    </Button>
                </div>
            </div>
        </div>
    </CardRoot>
</template>

<style>
#calendar-timeonly.remove-border input {
   border: none !important;
}
</style>
