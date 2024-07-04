<script>
import logo from '@/assets/logo_without_bg.png'
export default {
    name: "AppLogo",
    props: {
        width: {
            type: Number,
            default: 30
        },
        height: {
            type: Number,
            default: 60
        },
        textIsVisible: {
            type: Boolean,
            default: true
        }
    },
    data(){
        return {
            logo: logo
        }
    }
}
</script>
<template>
    <div class="flex items-center gap-1">
        <img :src="logo" alt="poliinsgiht logo" :width="width" :height="height"/>
        <p v-if="textIsVisible" class="app-title font-bold mb-0 mt-3 tracking-wider uppercase">
            Poliinsight
        </p>
    </div>
</template>