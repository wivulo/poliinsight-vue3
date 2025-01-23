<script setup lang="ts">
const props = defineProps<{
        label: string, 
        icon: string, 
}>();
</script>

<template>
    <div class="h-2 text-sm flex items-center text-zinc-700 py-2 w-full">
        <i :class="props.icon" class="mr-1 fa" /> {{ props.label }}
    </div>
</template>