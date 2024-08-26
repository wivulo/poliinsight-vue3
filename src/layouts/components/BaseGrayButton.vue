<script>
import Button from 'primevue/button';
export default {
    name: 'BaseGrayButton',
    components: {
        Button
    }
}
</script>

<template>
    <Button size="small" text class="bg-gray-300/30 soft-hover text-surface-500 h-9">
        <slot />
    </Button>
</template>