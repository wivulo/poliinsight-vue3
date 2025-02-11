<script setup>
import { reactive, ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useNotification } from '@/composables/useNotification';
import EventConfigServices from '@/services/EventConfigServices';
import SettingGroupItemContainer from '@/views/setting/components/SettingGroupItemContainer.vue';
import PLoading from '@/components/PLoading.vue';
import PDropdown from "@/components/PDropdown/PDropdown.vue";
import PDropdownTrigger from "@/components/PDropdown/PDropdownTrigger.vue";
import PDropdownMenu from "@/components/PDropdown/PDropdownMenu.vue";
import PDropdownItem from "@/components/PDropdown/PDropdownItem.vue";
import Button from 'primevue/button';
import InputSwitch from 'primevue/inputswitch';
import { ConfirmSwal } from '@/helpers/fireSwal';

const { notifyError, notifySuccess } = useNotification();
const router = useRouter();

const busy = ref(false);
const store_busy = ref(false);
const configuration = ref({
    id: null,
    isPublished: false,
    isRegistrationOpen: false,
    registrationType: null
})

const localConfiguration = ref({
    id: null,
    isPublished: false,
    isRegistrationOpen: false,
    registrationType: null
})

const registrationTypeOptions = ref({
    data: ['Individual', 'Grupo', 'Hibrido'],
    selected: null
})

async function fetchEventConfiguration() {
    try {
        busy.value = true;
        const response = await EventConfigServices.showByEventId(router.currentRoute.value.params.id);
        if (response.status === 200) {
            configuration.value.id = response.data?.id;
            configuration.value.isPublished = response.data?.isPublished;
            configuration.value.isRegistrationOpen = response.data?.isRegistrationOpen;
            configuration.value.registrationType = response.data?.registrationType;
            registrationTypeOptions.value.selected = response.data?.registrationType

            localConfiguration.value = { ...configuration.value }
            return
        }

        throw new Error(response.response.data);
    } catch (error) {
        console.error(error);
        notifyError('Erro ao buscar os certificados');
    } finally {
        busy.value = false;
    }
}

async function handleUpdateEventConfiguration(field, value) {
    try {
        const result = await ConfirmSwal()
        if (!result.isConfirmed) return

        store_busy.value = true;
        const response = await EventConfigServices.updateAtomic(
            configuration.value.id, 
            {field, value}
        );

        if (response.status === 200) {
            notifySuccess('Configuração atualizada com sucesso');
            fetchEventConfiguration()
            return
        }

        throw new Error(response.response.data);
    } catch (error) {
        console.error(error);
        notifyError('Erro ao atualizar a configuração');
    } finally {
        store_busy.value = false;
    }
}

function handleRegistrationTypeChanged(value) {
    registrationTypeOptions.value.selected = value;
}

function updateComponent() {
    fetchEventConfiguration()
}

defineExpose({
    updateComponent
})

onMounted(() => {
    fetchEventConfiguration()
})
</script>

<template>
    <PLoading v-if="busy" />

    <div v-else class="flex flex-col gap-3">
        <SettingGroupItemContainer label="Tipo de Inscrição"
            description="Configure o tipo de inscrição para o evento, afecta  o layout da página de inscrição"
        >
            <div class="flex justify-center">
                <PDropdown>
                    <PDropdownTrigger>
                        <div
                            class="flex items-center justify-between w-52 border rounded-md px-2 py-1 text-sm cursor-pointer border-surface-400">
                            {{ registrationTypeOptions.selected || 'Selecione' }}
                            <i class="fa fa-chevron-down text-surface-400 text-sm"></i>
                        </div>
                    </PDropdownTrigger>

                    <PDropdownMenu menu-class="min-w-[100px]">
                        <PDropdownItem v-for="option in registrationTypeOptions.data" :key="option"
                            @click="handleRegistrationTypeChanged(option)">
                            {{ option }}
                        </PDropdownItem>
                    </PDropdownMenu>
                </PDropdown>

                <Button v-show="registrationTypeOptions.selected !== configuration.registrationType"
                    rounded icon="pi pi-check" title="Salvar alterações"
                    size="small" class="h-8 w-8 ml-3 transition-all"
                    @click="handleUpdateEventConfiguration('registrationType', registrationTypeOptions.selected)"
                    :loading="store_busy"
                ></Button>
            </div>
        </SettingGroupItemContainer>

        <!-- isRegistrationOpen -->
        <SettingGroupItemContainer label="Inscrições Abertas"
            description="Habilita ou desabilita as inscrições para o evento"
        >
            <div class="flex justify-center pr-5">
                <InputSwitch v-model="localConfiguration.isRegistrationOpen" class="transition-all" />

                <Button v-show="localConfiguration.isRegistrationOpen !== configuration.isRegistrationOpen"
                    rounded icon="pi pi-check" title="Salvar alterações"
                    size="small" class="h-8 w-8 ml-3 transition-all"
                    @click="handleUpdateEventConfiguration('isRegistrationOpen', localConfiguration.isRegistrationOpen)"
                    :loading="store_busy"
                ></Button>
            </div>
        </SettingGroupItemContainer>

        <!-- //isPublished -->
        <SettingGroupItemContainer label="Publicar Evento"
            description="Habilita ou desabilita a visualização do evento para o público"
        >
            <div class="flex justify-center pr-5">
                <InputSwitch v-model="localConfiguration.isPublished" class="transition-all" />

                <Button v-show="localConfiguration.isPublished !== configuration.isPublished"
                    rounded icon="pi pi-check" title="Salvar alterações"
                    size="small" class="h-8 w-8 ml-3 transition-all"
                    @click="handleUpdateEventConfiguration('isPublished', localConfiguration.isPublished)"
                    :loading="store_busy"    
                ></Button>
            </div>
        </SettingGroupItemContainer>
    </div>
</template>