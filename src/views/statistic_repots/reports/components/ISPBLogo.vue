<script>
export default {
    name: 'ISPBLogo',
    props: {
        src: {
            type: String,
            required: true,
            default: '/images/ispb logo.svg'
        }
    }
}
</script>

<template>
    <div class="logo-container">
        <img :src="src" />
    </div>
</template>