<script setup>
import { ref, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import SettingService from '@/services/SettingService';
import DepartamentService from '@/services/DepartamentService';
import SettingGroupItemContainer from '@/views/setting/components/SettingGroupItemContainer.vue';
import ModalChanceSettingItem from '../../../components/ModalChanceSettingItem.vue';
import { useNotification } from '@/composables/useNotification';
import { ConfirmSwal } from '@/helpers/fireSwal';
import { SwalConfirmAlert } from '@/helpers/swalConfirmAlert';

const router = useRouter()
const store = useStore()
const { notifyError, notifySuccess } = useNotification()

const settings = ref([])
const busy = ref(false)
const fetchSettingGroupitems = async () => {
    try {
        busy.value = true
        const response = await SettingService.showGroupItemsByGroupId(+router.currentRoute.value.query.groupid)
        settings.value = [...response.data]
    } catch (error) {
        console.error(error)
        notifyError()
    } finally {
        busy.value = false
    }
}
fetchSettingGroupitems()

const importComponent = (component) => {
    return defineAsyncComponent(() => import(`./${component}SettingItem.vue`))
}

const handleUpdateSetting = async (setting) => {
    try {
        if(!await SwalConfirmAlert()) return

        busy.value = true
        const response = await SettingService.updateGroupItem(setting)

        if(response.status === 200) {
            notifySuccess('Configuração atualizada com sucesso')
            fetchSettingGroupitems()
            return
        }

        throw new Error('Erro ao atualizar configuração')
    } catch (error) {
        console.error(error)
        notifyError()
    } finally {
        busy.value = false
    }
}

</script>

<template>
    <div class="flex flex-col gap-y-5 text-sm">
        <SettingGroupItemContainer
            v-for="setting in settings" :key="`${setting.id}-${setting.value}`"
            v-show="setting.roles.includes(store.getters['auth/user'].group?.name.toLowerCase())"
            :label="setting.label"
            description=""
            @setting:update="() => handleUpdateSetting(setting)"
        >
            <component :is="importComponent(setting.key)" :setting="setting" @update:setting="handleUpdateSetting" />
        </SettingGroupItemContainer>
    </div>
</template>