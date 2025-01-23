<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import EventServices from '@/services/EventServices';
import { useNotification } from '@/composables/useNotification'
import CardRoot from "@/components/PCard/CardRoot.vue"

const store = useStore()
const { notifyError } = useNotification()

const busy = ref(false)
const certificates = ref([])
</script>

<template>
    <div class="flex flex-col gap-5 w-full">
        <div v-if="busy" class="flex-grow flex w-full h-full justify-center items-center">
            <i class="fa fa-spinner animate-spin text-black text-base" />
        </div>

        <div v-else-if="!busy && certificates.length === 0" class="flex-grow flex w-full h-full justify-center items-center">
            <p class="text-sm text-surface-400 font-light py-10">
                Calma, você ainda não tem nenhum certificado! 😢
            </p>
        </div>

        <div v-else class="flex flex-wrap gap-3 w-full">
            <CardRoot 
                v-for="certificate in certificates" :key="certificate.id"
                class="w-[233px] max-h-[180px] min-h-[110px] border hover:bg-zinc-100">
                <div class="flex justify-between items-center text-ellipsis-2" :title="certificate.name">
                    <h2 class="text-sm font-bold text-surface-900 cursor-pointer">{{ certificate.name }}</h2>
                </div>

                <div class="flex flex-col gap-1 text-surface-500 text-xs mt-2">
                    algumas informações aqui
                </div>
            </CardRoot>
        </div>
    </div>
</template>