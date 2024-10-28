<script>
export default {
    name: "CardHeader",
    props: ['icon'],
}
</script>

<template>
    <div class="card-title font-semibold flex justify-between items-center gap-5">
        <slot />
        <i class="fa" :class="icon" v-if="icon" />
    </div>
</template>

<style>
.card-title p{
    font-size: clamp(0.94rem, 1vw, 1.5rem);
}
</style>