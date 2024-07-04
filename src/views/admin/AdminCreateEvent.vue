<script>
import { mapGetters } from 'vuex';
import noImagemAvailable from '@/assets/no-picture-available-icon-9.jpg'
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

export default {
    name: 'Admin.CreateEvent',
    components: {
        FileUploader, Button, ProgressBar, Badge,
        InputText, FloatLabel, Textarea, Calendar,
        IconField, InputIcon
    },
    data(){
        return {
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
                localization: ''
            },

            busy: false
        }
    },
    computed: {
        ...mapGetters({
            hasBenCreated: 'event/hasBenCreated',
            user: 'auth/user'
        }),
    },
    methods: {
        handleCreateEvent(){ 
            // console.log(this.event)      
            this.busy = true    
            this.$store.dispatch('event/createEvent', {...this.event, organizerId: this.user?.id ?? 1})
            .then(result => {
                if(result.error){
                    this.$toast.add({
                        severity: 'danger',
                        summary: 'Error', 
                        detail: 'Erro ao criar o evento', 
                        life: 2000
                    })
                }

                this.$toast.add({severity: 'success', summary: 'Success', detail: 'Evento criado com sucesso', life: 2000})

                this.busy = false
            })
        },
        
        handleUploadedFile(file){
            this.event.flayer = file
        }
    },
    watch: {
        hasBenCreated(value){
            if(value){
                this.$router.push({
                    name: 'event.home', 
                    params: {
                        id: this.$store.getters['event/createdEventId']
                    }
                })
            }
        }
    }
}
</script>

<template>
    <div class="p-4 px-5 w-full flex flex-col gap-5">
        <div>
            <p class="text-surface-400 font-semibold text-xl">Criar Evento</p>
        </div>

        <div class="flex flex-col gap-3">
            <div class="flex gap-3 flex-grow">

                <div class="flex flex-grow">
                    <FileUploader @uploaded="handleUploadedFile"/>
                </div>

                <div class="flex flex-col gap-4 flex-grow">
                    <FloatLabel>
                        <InputText id="name" v-model="event.name" class="w-full border-zinc-300 h-9 " :required="true"/>
                        <label for="name">
                            <small> Nome do evento </small>
                        </label>
                    </FloatLabel>

                    <Textarea v-model="event.description" rows="5" cols="30" placeholder="Descrição do evento"/>

                    <FloatLabel class="mt-2">
                        <InputText id="localization" v-model="event.localization" class="w-full border-zinc-300 h-9 " :required="true"/>
                        <label for="localization">
                            <small> Localização </small>
                        </label>
                    </FloatLabel>

                    <div class="flex gap-3">
                        <Calendar v-model="event.date" placeholder="Data de inicio" :showIcon="true" :readonlyInput="true" :showOnFocus="true" :minDate="new Date()" :maxDate="new Date(2025, 12, 31)" iconDisplay="input" class="flex-grow border-zinc-300 h-9 focus:outline-zinc-400" inputClass="hover:border-zinc-400"/>

                        <Calendar v-model="event.endDate" placeholder="Data de fim" :showIcon="true" :readonlyInput="true" :showOnFocus="true" :minDate="new Date()" :maxDate="new Date(2025, 12, 31)"  iconDisplay="input" class="flex-grow border-zinc-300 h-9 focus:outline-zinc-400" inputClass="hover:border-zinc-400"/>
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
                <Button @click="handleCreateEvent" class="bg-surface-500 border-none text-black hover:bg-surface-600" size="small" :disabled="busy">
                    <i class="fas fa-spinner animate-spin mr-1" v-if="busy" />
                    Criar evento
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
