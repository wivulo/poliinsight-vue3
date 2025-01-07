<script setup>
import { ref } from 'vue';
import { useDocumentTitle } from '@/composables/useDocumentTitle'
import { useRouter } from 'vue-router';
import { useRequest } from '@/composables/useRequest';
import SettingService from '@/services/SettingService';
import CardRoot from '@/components/PCard/CardRoot.vue';
import TabMenu from 'primevue/tabmenu';

const { execute } = useDocumentTitle()
execute('Defiçinições Gerais')

const router = useRouter()
const { executeRequest } = useRequest()

const tabItems = ref(null);
(async () => {
    if (!router.currentRoute.value.name.toString().match(/configuracoes\.general\..*/))
        router.push({name: 'configuracoes.general.profile'})

    tabItems.value = await executeRequest(
        () => SettingService.ShowGroupsBySettingCode('GENERAL'),
        null,
        'Erro ao buscar as configurações'
    )

    tabItems.value = tabItems.value.map(item => {
        return {
            ...item,
            label: item.name,
        }
    })
})();

</script>

<template>
    <div class="p-4 px-5 w-full" ref="componentRef">
        <CardRoot class="mt-4">
            <div class="flex justify-between items-center no-print">
                <div>
                    <h1 class="text-base font-semibold uppercase">Configurações Gerais</h1>
                    <p class="text-sm">Gerencie as configurações do sistema e de eventos aqui</p>
                </div>
            </div>

            <div class="flex flex-col gap-5 mt-5">
                <TabMenu :model="tabItems">
                    <template #item="{ item, props }">
                        <div v-ripple @click="() => router.push({name: item.code, query: {groupid: item.id}})" class="px-3 py-[.4rem] text-sm border border-gray-400/40  hover:bg-red-700/50 cursor-pointer hover:text-white"
                            :class="{'bg-[#DA5551] text-white': item.code == router.currentRoute.value.name}">
                            <span :class="'mr-1 fa ' + item.icon" />
                            <span v-bind="props.label">{{ item.label }}</span>
                        </div>

                        <!-- <router-link v-slot="{ href, navigate }" :to="{name: item.code}" custom>
                            <a v-ripple :href="href" @click="navigate" class="px-3 py-1 text-sm border border-gray-400/40  hover:bg-red-700/50 cursor-pointer hover:text-white rounded-none"
                                :class="{'bg-[#DA5551] text-white': item.code == router.currentRoute.value.name}"
                            >
                                <span :class="'mr-1 fa ' + item.icon" />
                                <span v-bind="props.label">{{ item.label }}</span>
                            </a>
                        </router-link> -->
                    </template>
                </TabMenu>

                <div>
                    <router-view v-slot="{ Component }">
                        <transition>
                            <component :is="Component" ref="settingGroup" />
                        </transition>
                    </router-view>
                </div>
            </div>

        </CardRoot>
    </div>
</template>

<style>
    
</style>