<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
// import { User } from '@/model/user.model'

const store = useStore()
const router = useRouter()

// const user = ref<User>(null)
const busy = ref<boolean>(false)
</script>

<template>
    <div>
        <h1>Utilizador</h1>
    </div>
</template>