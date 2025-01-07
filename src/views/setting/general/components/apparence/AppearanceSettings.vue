<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import SettingService from '@/services/SettingService';
import SettingGroupItemContainer from '@/views/setting/components/SettingGroupItemContainer.vue';
import ApparenceSettingItem from './ApparenceSettingItem.vue';
import ModalChanceSettingItem from '../../../components/ModalChanceSettingItem.vue';
import { useNotification } from '@/composables/useNotification';

const router = useRouter()
const store = useStore()
const { notifyError } = useNotification()

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

const ModalChanceSettingItemRef = ref(null)
const handleChangeSetting = (setting: any) => {
    ModalChanceSettingItemRef.value.show('general', 'apparence', setting)
}

</script>

<template>
    <div class="flex flex-col gap-y-5 text-sm">
        <ModalChanceSettingItem ref="ModalChanceSettingItemRef" @update:settingItem="fetchSettingGroupitems" />
        
        <SettingGroupItemContainer
            v-for="setting in settings" :key="`${setting.id}-${setting.value}`"
            v-show="setting.roles.includes(store.getters['auth/user'].group?.name.toLowerCase())"
            :label="setting.label" showUpdateButton
            description=""
            @setting:update="() => handleChangeSetting(setting)"
        >
            <ApparenceSettingItem 
                :key="`${setting.id}-${setting.value}`" 
                :setting class="flex justify-center text-sm"
                @update:setting="fetchSettingGroupitems" 
            />
        </SettingGroupItemContainer>
    </div>
</template>