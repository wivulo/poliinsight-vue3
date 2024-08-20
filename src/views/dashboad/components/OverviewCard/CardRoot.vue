<script>
import Card from "primevue/card";

export default {
    name: "CardRoot",
    components: {
        Card
    },
}
</script>

<template>
    <Card class="py-0">
        <template #content>
            <div class="relative">
                <slot />
            </div>
        </template>
    </Card>
</template>

<style scoped>
.card{
    width: clamp(13rem, 18vw, 25rem);
}
</style>