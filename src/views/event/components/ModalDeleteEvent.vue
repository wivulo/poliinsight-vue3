<script>
import EventServices from '@/services/EventServices';
import Dialog from 'primevue/dialog';
import BlockUI from 'primevue/blockui';
import ProgressSpinner from 'primevue/progressspinner';
import Button from 'primevue/button';

export default {
    name: "ModalDeleteEvent",
    components: {
        Dialog, BlockUI, ProgressSpinner, Button
    },
    data(){
        return {
            visible: false,
            busy: false,
            event: {
                data: null,
                busy: false
            }
        }
    },
    methods : {
        async show(id){
            this.visible = true;
            await this.findEvent(id)
        },

        async findEvent(id){
            this.event.busy = true;
            const response = await EventServices.show(id)
            .catch(() => this.$toast.add({severity:'error', summary: 'Error', detail: 'Erro ao buscar evento'}) )
            .finally(() => this.event.busy = false )

            if(response.status == 200){
                this.event.data = response.data;
                return;
            }

            this.$toast.add({severity:'error', summary: 'Error', detail: 'Erro ao buscar evento'});
        },

        reset(){
            this.visible = false;
            this.event.data = null;
        },

        handlehidden(){
            this.visible = false;
        },

        handleCancel(){
            this.handlehidden()
            this.reset()
        },

        async handleDeleteEvent(){
            this.busy = true;
            const response = await EventServices.delete(this.event.data.id)
            .catch(() => this.$toast.add({severity:'error', summary: 'Error', detail: 'Erro ao eliminar evento', life: 3000}) )
            .finally(() => this.busy = false )

            if(response.status == 200){
                this.$toast.add({severity:'success', summary: 'Success', detail: 'Evento eliminado com sucesso', life: 3000});
                this.$emit('event-deleted');
                this.reset();
                this.handlehidden();
                return;
            }

            this.$toast.add({severity:'error', summary: 'Error', detail: 'Erro ao eliminar evento', life: 3000});
        },
    }
}
</script>

<template>
    <Dialog v-model:visible="visible" modal header="Eliminar evento" :style="{ width: '25rem' }">
        <BlockUI :blocked="event.busy">
            <div class="flex justify-center items-center">
                <ProgressSpinner v-if="event.busy" />

                <div v-else>
                    <p class="text-center">Tem certeza que deseja eliminar o evento</p>
                    <p class="text-center font-semibold mb-3">{{ event.data?.name }}?</p>

                    <div class="flex justify-end gap-x-3">
                        <Button text @click="handleCancel" class="w-auto">
                            <i class="fa fa-close mr-1" /> <span>Cancelar</span>
                        </Button>

                        <Button severity="secondary" text class="text-red-600 w-auto" @click="handleDeleteEvent">
                            <ProgressSpinner v-if="busy" class="mr-2 w-6 h-6" />
                            <i class="fa fa-trash mr-1"  v-else/> <span>{{ busy ? 'Eliminando' : 'Eliminar' }}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </BlockUI>
    </Dialog>
</template>