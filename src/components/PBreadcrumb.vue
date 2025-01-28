<script setup>
import { ref } from 'vue';
import Breadcrumb from 'primevue/breadcrumb';

const { items } = defineProps({
    items: Array
});
const home = ref({
    icon: 'pi pi-home', label: 'Página Inicial', route: 'home', title: 'Ir para Página Inicial'
});
</script>

<template>
    <div class="flex w-full text-xs">
            <div class="w-[33%]">
                <Breadcrumb :home="home" :model="items">
                    <template #item="{ item, props }">
                        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="{name: item.route, params: item.params}" custom>
                            <a :href="href" v-bind="props.action" @click="navigate">
                                <span :class="[item.icon, 'text-color']" />
                                <span class="ml-1.5 font-semibold" :title="item.title">{{ item.label }}</span>
                            </a>
                        </router-link>
                        
                        <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                            <span class="text-color">{{ item.label }}</span>
                        </a>
                    </template>
                </Breadcrumb>
            </div>
        </div>
</template>