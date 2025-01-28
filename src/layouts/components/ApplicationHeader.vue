<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { mapGetters } from 'vuex'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Avatar from 'primevue/avatar';
import Skeleton from 'primevue/skeleton';
import BaseGrayButton from './BaseGrayButton.vue'

const store = useStore()
const route = useRoute()

const user = computed(() => store.getters['auth/user'])
const busy = computed(() => store.getters['auth/busy'])
</script>

<template>
    <header class="border-b border-slate-200 w-full">
        <div class="app-container flex justify-end  py-2 px-4 pl-5">
            <div class="flex">
                <nav class="app-navbar">
                     <ul class="flex items-center self-center mb-0">
                        <li>
                            <BaseGrayButton>
                                <i class="fa fa-moon text-slate-800"/>
                            </BaseGrayButton>
                        </li>

                        <li>
                            <BaseGrayButton>
                                <i class="fa fa-bell text-slate-800"/>
                            </BaseGrayButton>
                        </li>

                        <li v-if="busy" class="flex gap-2">
                            <div class="flex items-center">
                                <Skeleton shape="circle" size="2rem"></Skeleton>
                            </div>
                            <div class="flex flex-col gap-2">
                                <Skeleton width="6rem" />
                                <Skeleton width="6rem" />
                            </div>
                        </li>
                        
                        <li v-else-if="user" class="flex border-x border-slate-200 px-1">

                            <Dropdown 
                                :options="[
                                    {label: 'Página Inicial', route: 'home' },
                                    {label: 'Perfil', route: 'profile.geral'},
                                    {label: 'Sair', route: 'logout'}
                                ]" 
                                class="p-0 h-9"
                            >
                                <template #value>
                                    <div class="flex gap-1 items-center h-6 pt-[2px]">
                                        <div class="h-6 flex items-center">
                                            <Avatar v-if="user.imageURL" :image="user.imageURL" shape="circle" class="cursor-pointer hover:scale-110 transform transition-transform"/>
                                            <Avatar v-else :label="user.name.charAt(0).toUpperCase()" class="h-5 text-sm" shape="circle"  />
                                        </div>
                                        <div class="flex items-center h-6">
                                            <!-- <p class="text-md">{{ user.name }}</p> -->
                                            <p class="text-sm text-slate-600">
                                                {{ user.email }}
                                            </p>
                                        </div>
                                    </div>
                                </template>

                                <template #option="{ option }">
                                    <div class="h-3 text-sm text-zinc-500 w-full text-left justify-start">
                                        <router-link :to="{name: option.route}">
                                            {{ option.label }}
                                        </router-link>
                                    </div>
                                </template>
                            </Dropdown>
                        </li>
    
                        <li v-else class="border-x border-slate-200 px-2 ms-3">
                            <div class="flex gap-1 ">
                                <!-- <Button text class="soft-hover h-8 border-slate-200"> -->
                                    <router-link :to="{name: 'login'}">
                                        <Button severity="secondary" text class="soft-hover h-8 border-slate-200">
                                            Login
                                        </Button>
                                    </router-link>
                                <!-- </Button> -->

                                <router-link :to="{name: 'signup'}">
                                    <Button severity="secondary" text class="soft-hover h-8 border-slate-200">
                                        Criar conta
                                    </Button>
                                </router-link>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </header> 
</template>

<style scoped>
.app-navbar ul{
    list-style: none;
    display: flex;
    gap: 1rem;
}
</style>