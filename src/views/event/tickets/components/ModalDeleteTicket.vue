<script>
import TicketsService from '@/services/TicketsService.js';
import Dialog from 'primevue/dialog';
import BlockUI from 'primevue/blockui';
import ProgressSpinner from 'primevue/progressspinner';
import Button from 'primevue/button';

export default {
    name: "ModalDeleteTicket",
    components: {
        Dialog, BlockUI, ProgressSpinner, Button
    },
    data(){
        return {
            visible: false,
            busy: false,
            ticket: {
                data: null,
                busy: false
            },
        }
    },
    methods : {
        async show(id){
            this.visible = true;
            await this.getTicket(id)
        },

        async getTicket(id){
            this.ticket.busy = true;
            const response = await TicketsService.show(id)
            .catch(() => this.$toast.add({severity:'error', summary: 'Error', detail: 'Erro ao buscar o ticket'}) )
            this.ticket.busy = false

            if(response.status == 200){
                this.ticket.data = response.data;
                return;
            }

            this.$toast.add({severity:'error', summary: 'Error', detail: 'Erro ao buscar o ticket'});
        },

        reset(){
            this.visible = false;
            this.ticket.data = null;
        },

        handlehidden(){
            this.visible = false;
        },

        handleCancel(){
            this.handlehidden()
            this.reset()
        },

        async handleDeleteTicket(){
            this.busy = true;
            const response = await TicketsService.delete(this.ticket.data.id)
            .catch(() => this.$toast.add({severity:'error', summary: 'Error', detail: 'Erro ao eliminar ingresso', life: 3000}) )
            .finally(() => this.busy = false )

            if(response.status == 200){
                this.$toast.add({severity:'success', summary: 'Success', detail: 'Ingresso eliminado com sucesso', life: 3000});
                this.$emit('deleted');
                this.reset();
                this.handlehidden();
                return;
            }

            this.$toast.add({severity:'error', summary: 'Error', detail: 'Erro ao eliminar ingresso', life: 3000});
        },
    }
}
</script>

<template>
    <Dialog v-model:visible="visible" modal header="Eliminar ticket" :style="{ width: '25rem' }">
        <BlockUI :blocked="ticket.busy">
            <div class="flex justify-center items-center">
                <ProgressSpinner v-if="ticket.busy" />

                <div v-else>
                    <p class="text-center">Tem certeza que deseja eliminar o ticket</p>
                    <p class="text-center font-semibold mb-3">{{ ticket.data?.name }}?</p>
                </div>
            </div>
        </BlockUI>

        <template #footer>
                <div class="flex gap-3 justify-end">
                    <Button text @click="handleCancel" class="w-auto h-9" size="small">
                            <i class="fa fa-close mr-1" /> <span>Cancelar</span>
                        </Button>

                        <Button class="text-white w-auto h-9" @click="handleDeleteTicket" size="small">
                            <ProgressSpinner v-if="busy" class="mr-2 w-6 h-6" />
                            <i class="fa fa-trash mr-1"  v-else/> <span>{{ busy ? 'Eliminando' : 'Eliminar' }}</span>
                        </Button>
                </div>
        </template>
    </Dialog>
</template>