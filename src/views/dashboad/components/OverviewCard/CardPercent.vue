<template>
    <p class="card-text">
        <slot />
    </p>
</template>

<style scoped>
.card-text{
    font-size: clamp(0.75rem, 1vw, 1.10rem);
}
</style>