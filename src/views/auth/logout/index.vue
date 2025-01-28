<script setup>
import { useStore } from 'vuex';
const store = useStore()
store.dispatch('auth/logout')
</script>

<template>
   <div class="flex-grow flex w-full h-full justify-center items-center">
        <i class="fa fa-spinner animate-spin text-black text-base" />
    </div>
</template>