<script setup lang="ts">
import Dropdown from 'primevue/dropdown';
import DropdownOption from '@/components/PDropdown/DropdownOption.vue';

const props = defineProps<{
    options: Array<
        {
            id?: number | string,
            name?: string, 
            label: string, 
            icon?: string, 
            click?: (prop: any) => void 
        }>,
    optionLabel?: string,
    optionValue?: string,
    placeholder?: string,
    data: any,
    loading?: boolean
}>();
</script>

<template>
    <Dropdown 
        :options="props.options"
        class="p-0 bg-primary-500"
        option-label="label"
        :placeholder="props.placeholder"
        :loading
    >
        <template #value="{ value, placeholder }">
            <div v-if="value" class="flex justify-center items-center text-white">
                <i :class="value.icon" class="fa mr-1"/> {{ value.label }}
            </div>

            <div v-else class="flex justify-center items-center text-white">
                <i class="fa fa-cog mr-1"/> <span v-show="props.placeholder">{{ placeholder }}</span>
            </div>
        </template>

        <template #option="{ option }">
            <DropdownOption :label="option.label" :icon="option.icon" @click="option.click(props.data)"/>
        </template>

        <template #dropdownicon>
            <i class="fa fa-chevron-down text-white"/>
        </template>
    </Dropdown>
</template>