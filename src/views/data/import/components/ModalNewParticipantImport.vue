<script>
import ImportServices from '@/services/ImportServices.js';
import EventServices from '@/services/EventServices';
import { mapGetters } from 'vuex';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea'

export default {
    name: "ModalNewParticipantImport",
    components: {
        Dialog, ProgressSpinner, Button,
        InputText, InputNumber, Dropdown, Textarea,
    },
    data(){
        return {
            visible: false,
            busy: false,
            importData: {
                description: null,
                operadorId: null,
                eventId: null,
                file: null
            },
            events: {
                busy: false,
                data: [],
                selected: null,
            },
            file: null,
            error: null,
            MAXSIZE:  5 * 1024 * 1024, // 5MB
        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/user',
        }),
    },
    methods : {
        async show(){
            this.visible = true;
            await this.fetchEvents();
        },

        async fetchEvents(){
            this.events.busy = true
            const response = await EventServices.fetchEventsOrganizer(this.user.id)
            .catch(() => this.$toast.add({severity:'error', summary: 'Error', detail: 'Erro ao buscar os eventos', life: 3000}))
            this.events.data = response.data
            this.events.busy = false
        },

        async handleStore(){
            this.busy = true;
            this.importData.operadorId = this.user.id
            this.importData.eventId = this.importData.eventId.id
            const response = await ImportServices.importParticipants(this.importData)
            .catch(() => this.handleErrorMessage())

            this.busy = false
            if(response?.data.error){
                this.$toast.add({severity:'error', summary: 'Error', detail: response.data.error, life: 3000});
                return;
            }

            if(response?.status == 201){
                this.$swal.fire('', 'Participantes importados com sucesso', 'success');
                this.$emit('created');
                this.reset();
                this.handlehidden();
                return;
            }else{
                this.handleErrorMessage();
            }

            this.handleErrorMessage();
        },

        handleErrorMessage(){
            this.$toast.add({severity:'error', summary: 'Error', detail: 'Erro ao importar os dados', life: 3000});
        },

        reset(){
            this.visible = false;
            this.importData = {
                description: null,
                operadorId: null,
                eventId: null,
                file: null
            }
        },

        handlehidden(){
            this.visible = false;
        },

        handleCancel(){
            this.handlehidden()
            this.reset()
        },

        prepareFile(file){
            if (file.size > this.MAXSIZE) {
                this.error = 'O arquivo é muito grande. Por favor, carregue um arquivo de no máximo 5MB.';
            } else {
                this.importData.file = file
                this.error = null
            }
        },

        handleOnChange(e){
            e.preventDefault();
            this.prepareFile(e.target.files[0])
        },

        formatBytes(bytes) {
            if (bytes < 1024) return bytes + " Bytes";
            else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + " KB";
            else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + " MB";
        },
    }
}
</script>

<template>
    <Dialog v-model:visible="visible" modal header="Importar participantes" :style="{ width: '40rem' }">
        <div>
            <div class="flex flex-col w-full">
                <label for="event">Evento</label>
                <Dropdown id="event" v-model="importData.eventId" :options="events.data" optionLabel="name" placeholder="Selecione um evento" 
                    class="w-full"
                >
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
            
            <div class="flex flex-col w-full my-3">
                <label for="name">Descrição</label>
                <Textarea v-model="importData.description" rows="3" cols="30" placeholder="Descrição da importação" class="hover:border-slate-400"/>
            </div>

            <div class="flex flex-col gap-1">
                <p>Participantes</p>
                <div class="flex justify-center items-center mt-2 w-full">
                    <div class="flex items-center justify-center w-full">
                        <label v-if="!importData.file" for="dropzone-file" class="flex flex-col items-center justify-center w-full h-28 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                </svg>
                                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click para importar</span> ou arrasta e larga aqui</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Ficheiro CSV ou Excel(.xlsx)</p>
                            </div>
                            <input id="dropzone-file" type="file" class="hidden" @change="handleOnChange" />
                        </label>

                        <div v-else class="w-full h-28 flex justify-center items-center">
                            <div class="flex flex-col items-center justify-center w-full h-28 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                    </svg>
                                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">{{ importData.file.name }}</span></p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatBytes(importData.file.size) }}</p>
                                </div>
                            </div>
                        </div>
                    </div> 
                </div>
            </div>
            
        </div>

        <template #footer>
                <div class="flex gap-3 justify-end">
                    <Button severity="secondary" text @click="handleCancel" size="small" class="h-9">
                        <i class="fa fa-times mr-1"/> Cancelar
                    </Button>
                    <Button @click="handleStore" size="small" class="h-9" :loading="busy">
                        <i class="fas fa-spinner animate-spin mr-2" v-if="busy" />
                        <i class="fa fa-upload mr-2"/> {{ busy ? 'Importando...' : 'Importar' }}
                    </Button>
                </div>
        </template>
    </Dialog>
</template>