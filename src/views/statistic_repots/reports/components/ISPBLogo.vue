<script setup>
import { ref, onMounted, computed } from 'vue';
import SettingService from '@/services/SettingService';
import { useStore } from 'vuex';

const props = defineProps({
    src: {
        type: String,
        required: false,
        default: '/images/ispb logo.svg'
    }
})

const store = useStore();

const user = computed(() => store.getters['auth/user']);
const token = computed(() => store.getters['auth/token']);

const logo = ref(props.src);
const busy = ref(false);
async function fetchSetting(){
    try {
        busy.value = true;
        const response = await SettingService.showSettingGroupItemByKey('LogoUrl');

        if(response?.status === 200){
            logo.value = response.data?.value !== null ? response.data?.value : props.src;
            return
        }

        throw new Error();
    } catch (error) {
        console.error(error);
    } finally {
        busy.value = false;
    }
}

onMounted(() => {
    if(user.value?.id && token.value)
        fetchSetting();
})

</script>

<template>
    <div class="logo-container my-3">
        <img :src="props.src" />
    </div>
</template>