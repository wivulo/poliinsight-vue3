<script lang="ts" setup>
const props = defineProps(['setting']);
const color = props.setting.value;
const colorsTime = [
    {
        main: '#FFFFFF',
        secondary: 'F1F5F9',
        brand: '#DA5551'
    },
    {
        main: '#FFFFFF',
        secondary: 'F1F5F9',
        brand: '#F59E0B'
    },
    {
        main: '#FFFFFF',
        secondary: 'F1F5F9',
        brand: '#10B981'
    },
    {
        main: '#FFFFFF',
        secondary: 'F1F5F9',
        brand: '#3B82F6'
    }
]

</script>

<template>
    <div class="w-2/3 flex gap-3 h-20 items-center">
        <span class="fa fa-circle fa-dot text-3xl cursor-pointer hover:text-5xl transition-all" :class="'#'+color"></span>
    </div>
</template>