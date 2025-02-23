<script>
import { mapGetters } from 'vuex'
import AppLogo from '@/components/AppLogo.vue'
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Avatar from 'primevue/avatar';
import BaseGrayButton from './BaseGrayButton.vue'
import logo from '@/assets/logo_without_bg.png'

export default {
    name: 'ApplicationHeader',
    data() {
        return {
            logo: logo,
            search: '',
            links: ['Perfil', 'Sair']
        }
    },
    components: {
        AppLogo, BaseGrayButton,
        InputText, Avatar,
        Button, Dropdown
    },
    computed: {
        ...mapGetters({
            user: 'auth/user',
            group: 'group/workGroup'
        })
    },
    mounted() {
        if(['organizador', 'admininistrator'].includes(this.group?.name)){
            this.links = [
                'Gestão de eventos',
                ...this.links
            ]
        }
    },
    methods: {
        handleUserMenuClick(option){
            if(option === 'Sair'){
                this.handleLogout()
            }else if(option === 'Gestão de eventos'){
                this.$router.push({ name: 'dashboard.overview' })
            } else if(option === 'Perfil'){
                if(['organizador', 'admininistrator'].includes(this.group?.name)){
                    this.$router.push({name: 'profile.geral' })
                } else {
                    this.$router.push({name: 'profile' })
                }
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
                <nav class="app-navbar flex items-center">
                    <ul class="flex items-center self-center mb-0">
                        <li>
                            <BaseGrayButton>
                                <i class="fa fa-moon text-slate-900"/>
                            </BaseGrayButton>
                        </li>
                        
                        <li v-if="user" class="flex border-x border-slate-200 me-3 px-1 pe-2">

                            <Dropdown :options="links">
                                <template #value>
                                    <!-- Exibe versão completa em telas maiores e somente avatar em smartphones -->
                                    <div>
                                        <div class="hidden sm:flex gap-1 items-center h-6 pt-[2px]">
                                            <div class="h-6 flex items-center">
                                                <Avatar :label="user.name.charAt(0).toUpperCase()" class="h-5 text-sm" shape="circle" />
                                            </div>
                                            <div class="flex items-center h-6">
                                                <p class="text-sm text-slate-600">
                                                    {{ user.email }}
                                                </p>
                                            </div>
                                        </div>
                                        <div class="flex sm:hidden">
                                            <Avatar :label="user.name.charAt(0).toUpperCase()" class="h-5 text-sm" shape="circle" />
                                        </div>
                                    </div>
                                </template>

                                <template #option="{ option }">
                                    <div class="h-3 text-sm text-zinc-500 w-full text-left justify-start" @click="handleUserMenuClick(option)">
                                        {{ option }}
                                    </div>
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