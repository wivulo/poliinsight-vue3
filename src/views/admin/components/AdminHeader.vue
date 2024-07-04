<script>
import { mapGetters } from 'vuex'
import AppLogo from '@/components/AppLogo.vue'
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Avatar from 'primevue/avatar';
import Skeleton from 'primevue/skeleton';

export default {
    name: 'AppGuestHeader',
    data() {
        return {
            search: '',
            links: ['perfil', 'sair']
        }
    },
    components: {
        AppLogo,
        InputText, Avatar,
        Button, Dropdown, Skeleton
    },
    computed: {
        ...mapGetters({
            user: 'auth/user',
            busy: "auth/busy"
        })
    },
    methods: {
        handleUserMenuClick(option){
            if(option === 'sair'){
                this.handleLogout()
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
        <div class="app-container flex justify-between  py-2 px-4 pl-5">
            <div class="py-1 flex items-center">
                <span class="relative">
                    <i class="fa fa-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600" />
                    <InputText v-model="search" placeholder="Search" size="small" class="pl-10" />
                </span>
            </div>

            <div class="flex">
                <nav class="app-navbar">
                     <ul class="flex items-center self-center mb-0">
                        <li>
                            <Button text class="soft-hover text-surface-500">
                                <i class="fa fa-moon"/>
                            </Button>
                        </li>

                        <li>
                            <Button text class="soft-hover text-surface-500">
                                <i class="fa fa-bell"/>
                            </Button>
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

                            <Dropdown :options="links" class="p-0">
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