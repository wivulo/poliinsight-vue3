<script>
import logo from '@/assets/logo_without_bg.png'
export default {
    name: "AppLogo",
    data(){
        return {
            logo: logo
        }
    }
}
</script>
<template>
    <div class="flex items-center gap-1">
        <img :src="logo" alt="poliinsgiht logo" width="30" height="60"/>
        <p class="app-title font-bold mb-0 mt-3 tracking-wider uppercase">
            Poliinsight
        </p>
    </div>
</template>