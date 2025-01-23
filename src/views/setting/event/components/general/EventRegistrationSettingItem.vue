<script lang="ts" setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import InputSwitch from 'primevue/inputswitch';

const props = defineProps(['setting']);
const emit = defineEmits(['update:setting']);
const setting = ref(props.setting.value);
</script>

<template>
    <div class="flex h-20 items-center justify-center gap-3">
        <div>
            <InputSwitch v-model="setting" />
        </div>

        <div class="ml-2" v-if="setting !== props.setting.value">
           <Button icon="pi pi-check" class="text-green-500 w-8 h-8" size="small" rounded
                v-tooltip.bottom="'Salvar alterações'" @click="emit('update:setting', { ...props.setting, value: setting })"
           />
        </div>
    </div>
</template>