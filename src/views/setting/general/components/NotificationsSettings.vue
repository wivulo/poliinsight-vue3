<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useRequest } from '@/composables/useRequest';
import SettingService from '@/services/SettingService';
import CardRoot from '@/components/PCard/CardRoot.vue';

const router = useRouter()

const { busy:fetchSettingsBusy, data:settings } = useRequest({
    immediate: true, 
    requestFn: () => SettingService.ShowGroupsBySettingCode('GENERAL'),
    errorMessage: 'Erro ao buscar as configurações'
})

</script>

<template>
    <div>
        Configurações de Notificações
    </div>
</template>