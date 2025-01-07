<script lang="ts" setup>
import { ref, defineAsyncComponent } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

const emit = defineEmits(['updated', 'update:settingItem']);

let visible = ref(false);
let busy = ref(false);
let currentComponent = null;
let groupItem = ref(null);

const show = (setting: string, group: string, settingGroupItem: any) => {
    visible.value = true;
    currentComponent = defineAsyncComponent(() => import(`../${setting}/components/${group}/${settingGroupItem.key}SettingItemModal.vue`))
    groupItem.value = settingGroupItem;
}

const handleCancel = () => {
    visible.value = false;
    handleReset()
}

const handleHidden = () => {
    visible.value = false;
}

const handleReset = () => {
    busy.value = false;
    currentComponentRef.value = null;
    groupItem.value = null;
    currentComponent = null;
}

const currentComponentRef = ref(null);
const handleStore = async () => {
    currentComponentRef.value.handleUpdate()
}

const handleBusyupdated = (value: boolean) => {
    busy.value = value;
}

const handleSettingGroupItemUpdated = (data) => {
    emit('update:settingItem', data);
    handleHidden()
    handleReset()
}

//expor a função show para ser usada no componente pai
defineExpose({ show });
</script>

<template>
    <Dialog v-model:visible="visible" modal header="Alterar configuração" :style="{ width: '30rem' }">
        <component
            ref="currentComponentRef" 
            :is="currentComponent" 
            :setting="groupItem"
            v-model="busy"
            @update:busy="handleBusyupdated"
            @update:settingItem="handleSettingGroupItemUpdated" 
        />

        <template #footer>
            <div class="flex gap-3 justify-end">
                <Button severity="secondary" text @click="handleCancel" size="small" class="h-8">
                    <i class="fa fa-times mr-1"/> Cancelar
                </Button>
                <Button @click="handleStore" size="small" class="h-8" :loading="busy">
                    <i class="fas fa-spinner animate-spin mr-1" v-if="busy" />
                    <i class="fa fa-save mr-1"/> {{ busy ? 'Salvando...' : 'Salvar' }}
                </Button>
            </div>
        </template>
    </Dialog>
</template>