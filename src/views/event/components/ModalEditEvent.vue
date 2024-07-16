<script>
import Dialog from 'primevue/dialog';

export default {
    name: "ModalEditEvent",
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
    <Dialog v-model:visible="visible" modal header="Edditar evento" :style="{ width: '25rem' }">
        <div class="flex justify-center items-center">
            Modal editar evento
        </div>
    </Dialog>
</template>