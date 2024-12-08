<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRequest } from '@/composables/useRequest';
import { useStore } from 'vuex';
import ExportServices from '@/services/ExportServices';
import { useErrorNotification } from '@/composables/useErrorNotification';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';

const {busy, executeRequest: exportGeneralData, error} = useRequest();
const store = useStore();
const { notifyError } = useErrorNotification();
const $emit = defineEmits(['exported']);

const visible = ref(false);
const user = computed(() => store.getters['auth/user']);
const exportData = reactive({
    operadorId: user.value.id,
    description: null
});

const show = async () => {
    visible.value = true;
};

const handleHidden = () => {
    visible.value = false;
};

const reset = () => {
    exportData.operadorId = null;
    exportData.description = null;
};

const handleCancel = () => {
    reset();
    handleHidden();
};

const handleOK = async () => {
    const [isValid, message] = verifyRequiredFields();
    if (!isValid) {
        return notifyError(message);
    }

    const response = await exportGeneralData(
        () => ExportServices.exportGeneralEventsData(exportData), 
        'Dados exportados com sucesso', 
        'Erro ao exportar os dados gerais'
    );

    if (response && !error.value) {
        const blob = new Blob([response], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `dados_gerais_${new Date().toISOString()}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        $emit('exported');
        handleHidden();
        reset();
    }
};

const verifyRequiredFields = () => {
    if (!exportData.description) {
        return [false, 'O campo descrição é obrigatório, por favor preencha-o'];
    }

    return [true, null];
};

defineExpose({
    show
});
</script>

<template>
    <Dialog v-model:visible="visible" modal header="Exportar" :style="{ width: '35rem' }">
        <div class="flex flex-col gap-3 text-sm">
            <div class="flex flex-col gap-1 w-full">
                <label for="description">Descreva a necessidade da exportação <span class="text-red-600">*</span></label>
                
                <Textarea id="description" nmae="description" v-model="exportData.description" placeholder="Ex.: Para integração com a plataforma xy..." class="hover:border-slate-300" rows="5"/>
            </div>
        </div>

        <template #footer>
           <div class="flex gap-3 justify-end">
               <Button severity="secondary" text @click="handleCancel" size="small" class="h-8">
                   <i class="fa fa-times mr-1"/> Cancelar
               </Button>
               <Button @click="handleOK" size="small" class="h-8" :loading="busy">
                   <i class="fas fa-spinner animate-spin mr-2" v-if="busy" />
                   <i class="fa fa-upload mr-2"/> {{ busy ? 'Exportando...' : 'Exportar' }}
               </Button>
           </div>
        </template>
    </Dialog>
</template>