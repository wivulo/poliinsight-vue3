<script setup>
import { ref, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import SettingService from '@/services/SettingService';
import CategoryService from '@/services/CategoryService';
import SettingGroupItemContainer from '@/views/setting/components/SettingGroupItemContainer.vue';
import ModalChanceSettingItem from '../../../components/ModalChanceSettingItem.vue';
import { useNotification } from '@/composables/useNotification';
import { ConfirmSwal } from '@/helpers/fireSwal';
import { SwalConfirmAlert } from '@/helpers/swalConfirmAlert';
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Dropdown from 'primevue/dropdown';
import ModalNewCategory from './ModalNewCategory.vue';

const router = useRouter()
const store = useStore()
const { notifyError, notifySuccess } = useNotification()

const categories = ref([])
const busy = ref(false)
const isItemSelected = ref(false), itemSelected = ref(null),
filter = ref(null),
selectedCategories = ref([]),
selectionModeIsVisible = ref(false)

const fetchSettingGroupitems = async () => {
    try {
        busy.value = true
        const response = await CategoryService.index()
        categories.value = [...response.data]
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

function onRowSelected(item){
    this.selectedCategories.value.push(item.data);
    this.isItemSelected = true;
}

function onRowUnselected(item){
    this.selectedCategories.value = this.selectedCategories.value.filter(category => category.id !== item.data.id);

    if(this.selectedCategories.value.length === 0){
        this.isItemSelected = false;
    }
}

function handleHideSelectionMode(){
    this.selectionModeIsVisible = false;
    this.selectedCategories.value = [];
}

const ModalNewCategoryRef = ref(null)
function handleShowModalNewCategory(){
    ModalNewCategoryRef.value.show()
}

</script>

<template>
    <div class="flex flex-col text-sm">
        <ModalNewCategory ref="ModalNewCategoryRef" @updated="fetchSettingGroupitems" />
        <div class="flex">
            <InputGroup>
                <Button size="small" class="h-9 bg-transparent border border-surface-300 border-r-0">
                    <i class="fa fa-search text-black" />
                </Button>
                <InputText size="small" v-model="filter" id="search" type="text" placeholder="Pesquisar..." class="w-full rounded-none h-9 border-l-0" />

                <Button size="small" severity="transparent" class="h-9 border border-zinc-300" @click="handleShowModalNewCategory">
                    <i class="pi pi-plus mr-1"></i>
                    Adicionar
                </Button>
            </InputGroup>
        </div>

        <DataTable 
            :value="categories" size="small" paginator :rows="7"
            v-model:selection="itemSelected" dataKey="id" scrollable
            @row-select="onRowSelected" @row-unselect="onRowUnselected"
            :loading="busy" lazy class="ctable" :rowsPerPageOptions="[7, 10, 20, 50]" 
            :totalRecords="categories.length" stripedRows tableClass="mt-2"
        >

            <Column selectionMode="multiple" v-if="selectionModeIsVisible" headerStyle="width: 3rem"></Column>

            <Column field="name" header="Nome" />

            <Column field="description" header="descrição" class="truncate">
                <template #body="props">
                    <div class="truncate w-[350px]">{{ props.data.description }}</div>
                </template>
            </Column>

            <Column field="actions" header="Ações" class="no-print">
                <template #body="props">
                    <Dropdown 
                        :options="[]" 
                        class="p-0 bg-primary-500"
                        option-label="label"
                    >
                        <template #value>
                            <div class="flex justify-center items-center text-white">
                                <i class="fa fa-cog"/>
                            </div>
                        </template>

                        <template #option="{ option }">
                            <div class="h-2 text-sm flex items-center text-zinc-700 py-2 w-full" @click="option.command">
                                <i :class="option.icon" class="mr-1" /> {{ option.label }}
                            </div>
                        </template>

                        <template #dropdownicon>
                            <i class="fa fa-chevron-down text-white"/>
                        </template>
                    </Dropdown>
                </template>
            </Column>
        </DataTable>
    </div>
</template>