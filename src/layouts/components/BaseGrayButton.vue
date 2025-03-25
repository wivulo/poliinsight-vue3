<script>
import Button from 'primevue/button';
export default {
    name: 'BaseGrayButton',
    props: {
        rounded: {
            type: Boolean,
            default: true
        },
        badge: {
            type: String,
            default: "0"
        }
    },
    components: {
        Button
    }
}
</script>

<template>
    <Button :rounded="rounded" severity="secondary" size="small" 
        class="bg-gray-300/70 hover:bg-gray-300/70 border-0 soft-hover text-surface-800 h-9"
        :badge="String(badge)"
    >
        <slot />
    </Button>
</template>