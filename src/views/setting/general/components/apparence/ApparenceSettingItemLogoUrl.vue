<script setup lang="ts">
import { ref } from 'vue';
import { useRequest } from '@/composables/useRequest';
import SettingService from '@/services/SettingService';
import Avatar from 'primevue/avatar';

const props = defineProps<{
    setting: {
        id: number,
        key: string,
        value: string,
        isCostumizable: boolean,
    }
}>()

</script>

<template>
    <Avatar v-if="props.setting.hasOwnProperty('value')" :image="props.setting.value" shape="circle" size="xlarge" class="cursor-pointer hover:scale-125 transform transition-transform"/>
    <Avatar v-else icon="fa fa-university" shape="circle" size="large" class="cursor-pointer hover:scale-110 transform transition-transform"/>
</template>