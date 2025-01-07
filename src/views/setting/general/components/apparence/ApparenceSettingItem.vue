<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue';
import { useStore } from 'vuex';
import SettingService from '@/services/SettingService';
import { ConfirmSwal } from '@/helpers/fireSwal';
import { useNotification } from '@/composables/useNotification';

const store = useStore()
const { notifySuccess, notifyError } = useNotification()

const props = defineProps(['setting'])
const emit = defineEmits(['update:setting'])

const currentComponent = defineAsyncComponent(() => import(`./ApparenceSettingItem${props.setting.key}.vue`))

const updateSetting = async (setting: string) => {
    const result = await ConfirmSwal()
    if(!result.isConfirmed) return

    update(setting)
}

const busy = ref(false)
const update = async (setting: string) => {
    try {
        busy.value = true
        const response = await SettingService.updateGroupItem(setting)

        if(response.status < 200 || response.status > 299 || response.data?.error) 
            throw new Error('Erro ao atualizar configuração')

        // store.commit('setting/update', data)
        emit('update:setting', true)
        notifySuccess('Configuração atualizada com sucesso')
    } catch (error) {
        console.log(error)
        notifyError('Erro ao atualizar configuração')
    } finally {
        busy.value = false
    }
}

</script>

<template>
    <component 
        :is="currentComponent" 
        :setting="props.setting"
        @update:setting="updateSetting" 
    />
</template>