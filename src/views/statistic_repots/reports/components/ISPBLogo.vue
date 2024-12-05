<script>
export default {
    name: 'ISPBLogo',
    props: {
        src: {
            type: String,
            required: false,
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