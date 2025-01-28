<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useNotification } from '@/composables/useNotification';
import { useStore } from 'vuex';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

const router = useRouter();
const store = useStore();
const { notifyError, notifySuccess } = useNotification();
const emit = defineEmits(['useuserdata']);

const visible = ref(false);
let user = computed(() => store.getters['auth/user']);

function show() {
    visible.value = true;
    user = computed(() => store.getters['auth/user']);
}

function handlehidden (){
    visible.value = false;
}

function handleCancel () {
    emit('useuserdata', {isConfirmed: false});
    handlehidden();
};

function handleOK() {
    emit('useuserdata', {isConfirmed: true});
    handlehidden();
}

defineExpose({ show });
</script>

<template>
    <Dialog header="Incrição" :visible="visible" @hide="handlehidden" modal style="width: 20rem">
        <div class="w-full h-full flex flex-col justify-center">
            <p>{{ user?.name }}</p>
            <p class="text-sm text-surface-700 font-semibold">Deseja usar os dados da sua conta para fazer a inscrição?</p>
        </div>

        <template #footer>
            <div class="flex gap-3 justify-end">
                <Button severity="secondary" text @click="handleCancel" size="small" class="h-8">
                    Não
                </Button>
                <Button @click="handleOK" size="small" class="h-8">
                    Sim
                </Button>
            </div>
        </template>
    </Dialog>
</template>