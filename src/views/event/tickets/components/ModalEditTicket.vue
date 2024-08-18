<script>
import TicketsService from '@/services/TicketsService.js';
import Dialog from 'primevue/dialog';

export default {
    name: "ModalEditTicket",
    components: {
        Dialog
    },
    data(){
        return {
            visible: false
        }
    },
    methods : {
        show(id){
            this.visible = true;
        },
    }
}
</script>

<template>
    <Dialog v-model:visible="visible" modal header="Editar ticket" :style="{ width: '25rem' }">
        <div class="flex justify-center items-center">
            Modal editar ticket
        </div>
    </Dialog>
</template>