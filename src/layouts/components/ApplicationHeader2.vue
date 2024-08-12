<script>
import { mapGetters } from 'vuex'
import AppLogo from '@/components/AppLogo.vue'
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Avatar from 'primevue/avatar';

import logo from '@/assets/logo_without_bg.png'

export default {
    name: 'ApplicationHeader',
    data() {
        return {
            logo: logo,
            search: '',
            links: ['perfil', 'sair']
        }
    },
    components: {
        AppLogo,
        InputText, Avatar,
        Button, Dropdown
    },
    computed: {
        ...mapGetters({
            user: 'auth/user'
        })
    },
    mounted() {
        if(this.user?.groupId != 3){
            this.links = [
                'Gestão de eventos',
                ...this.links
            ]
        }
    },
    methods: {
        handleUserMenuClick(option){
            if(option === 'sair'){
                this.handleLogout()
            }else if(option === 'Gestão de eventos'){
                this.$router.push({name: 'dashboard.overview', params: {id: this.user.id}})
            }
        },

        handleLogout() {
            this.$store.dispatch('auth/logout')
            this.$router.push({path: "/"})
        },
    }
}
</script>

<template>
    <header class="border-b border-surface-100 w-full">
        <div class="app-container flex justify-between  p-2 px-3">
            <AppLogo />

            <div class="flex gap-4">
                <div class="py-1 flex items-center">
                    <span class="relative">
                        <i class="fa fa-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600" />
                        <InputText v-model="search" placeholder="Search" size="small" class="pl-10" />
                    </span>
                </div>
    
                <nav class="app-navbar flex items-center">
                    <ul class="flex items-center self-center mb-0">
                        <li>
                            <Button text class="soft-hover text-surface-500">
                                <i class="fa fa-moon"/>
                            </Button>
                        </li>
                        
                        <li v-if="user" class="flex border-x border-slate-200 me-3 px-1 pe-2">

                            <Dropdown :options="links">
                                <template #value>
                                    <div class="flex gap-1">
                                        <div class="h-2">
                                            <Avatar :label="user.name.charAt(0).toUpperCase()" class="mr-2 h-2" shape="circle"  />
                                        </div>
                                        <div class="flex flex-col">
                                            <p class="text-md">{{ user.name }}</p>
                                            <p class="text-sm">
                                                {{ user.email }}
                                            </p>
                                        </div>
                                    </div>
                                </template>

                                <template #option="{ option }">
                                    <Button class="h-2 text-md text-zinc-500 hover:text-blue-600" :label="option" link @click="handleUserMenuClick(option)" />
                                </template>
                            </Dropdown>
                        </li>
    
                        <li v-else class="border-x border-slate-200 px-2 ms-3">
                            <div class="flex gap-1 ">
                                <Button text class="soft-hover h-8 border-slate-200">
                                    <router-link to="/login">
                                        Login
                                    </router-link>
                                </Button>
    
                                <Button text class="soft-hover h-8 border-slate-200">
                                    <router-link to="/signup">
                                        Criar conta
                                    </router-link>
                                </Button>
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

div[data-pc-name="avatar"]{
    height: 35px !important;
}
</style>