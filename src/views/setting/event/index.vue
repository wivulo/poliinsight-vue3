<script setup>
import { ref, defineAsyncComponent, markRaw, onMounted, shallowRef } from 'vue';
import { useDocumentTitle } from '@/composables/useDocumentTitle'
import { useRouter } from 'vue-router';
import { useRequest } from '@/composables/useRequest';
import SettingService from '@/services/SettingService';
import { componentMap } from '@/views/setting/components/componentMap.js';
import CardRoot from '@/components/PCard/CardRoot.vue';
import TabMenu from 'primevue/tabmenu';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

const { execute } = useDocumentTitle()
execute('Defiçinições de Evento')

const router = useRouter()
const { executeRequest } = useRequest()

const tabItems = ref([]);
async function fetchSettingGroup() {
    tabItems.value = await executeRequest(
        () => SettingService.ShowGroupsBySettingCode('EVENT'),
        null,
        'Erro ao buscar as configurações'
    )

    if (!router.currentRoute.value.query.groupid)
        router.push({query: {groupid: tabItems.value[0].id}})

    tabItems.value = tabItems.value.map(item => {
        return {
            ...item,
            label: item.name,
            component: shallowRef( defineAsyncComponent(componentMap[item.component]) )
        }
    })
}

onMounted(() => {
    fetchSettingGroup()
})

</script>

<template>
    <div class="p-4 px-5 w-full" ref="componentRef">
        <CardRoot class="mt-4">
            <div class="flex justify-between items-center no-print">
                <div>
                    <h1 class="text-base font-semibold uppercase">Configurações de Evento</h1>
                    <p class="text-sm">Gerencie as configurações de eventos aqui</p>
                </div>
            </div>

            <div class="flex flex-col gap-5 mt-5">
                <TabView id="custom_tabview" :unstyled="true">
                    <TabPanel v-for="item in tabItems" :key="item.id">
                        <template #header>
                            <div @click="() => router.push({query: {groupid: item.id}})">
                                <span :class="'mr-1 fa ' + item.icon" />
                                <span >{{ item.label }}</span>
                            </div>
                        </template>

                        <transition>
                            <component :is="item.component" ref="settingGroup" />
                        </transition>
                    </TabPanel>
                </TabView>
            </div>

        </CardRoot>
    </div>
</template>