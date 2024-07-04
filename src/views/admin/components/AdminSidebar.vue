<script>
import AppLogo from '@/components/AppLogo.vue'
import Button from 'primevue/button';
import Tree from 'primevue/tree';
import PanelMenu from 'primevue/panelmenu';

export default {
    name: 'AppSidebar',
    components: {
        AppLogo, Button, Tree, PanelMenu
    },
    data() {
        return {
            panelItems: [
                {
                    label: 'Gestão de Eventos',
                    icon: 'fa fa-calendar',
                    icon2: 'fa fa-chevron-left',
                    icon3: 'fa fa-chevron-down',
                    to: null,
                    items: [
                        {
                            label: 'Criar evento',
                            to: 'admin.create_event'
                        },
                        {
                            label: 'Gerir eventos',
                            to: 'admin.event'
                        }
                    ]
                },
            ],
            isPanelOpen: false,
        }
    },
    methods: {
        handleLogout() {
            this.$store.dispatch('auth/logout')
            this.$router.push({path: "/"})
        },
        togglePanelMenu(){
            return this.isPanelOpen = !this.isPanelOpen
        }
    }
}
</script>

<template>
    <aside class="bg-surface-100">
        <div class="app-sidebar flex flex-col">

            <div class="app-sidebar-header flex justify-center vh-10">
                <div class="app-sidebar-header-content flex items-center justify-center ">
                    <AppLogo />
                </div>
            </div>

            <div class="app-sidebar-body mt-4 flex flex-col vh-75 overflow-y-auto ">
                <ul class="app-sidebar-nav list-group flex flex-col gap-2 relative text-md">
                    <li class="list-group-item">
                        <router-link to="overview" class="app-sidebar-nav-link">
                            <span class="app-sidebar-nav-link-icon">
                                <i class="fa fa-home" />
                            </span>
                            <span class="app-sidebar-nav-link-text">
                                Overview
                            </span>
                        </router-link>
                    </li>
                    <li class="list-group-item">
                        <PanelMenu :model="panelItems" class="w-full text-sm"
                            @panel-open="togglePanelMenu"
                            @panel-close="togglePanelMenu"
                        >
                            <template #item="{item}">
                                <router-link :to="{name: item.to}">
                                    <div class="flex gap-2 px-2 relative">
                                        <i :class="item.icon" class="mr-2" />
                                        <span>{{ item.label }}</span>
                                        <i :class="isPanelOpen ? item?.icon3 : item?.icon2" class="fa absolute right-0 mr-1 text-sm items-center self-center" />
                                    </div>
                                </router-link>
                            </template>
                        </PanelMenu>
                    </li>
                    <li class="list-group-item">
                        <router-link :to="{name: 'admin.users'}" class="app-sidebar-nav-link">
                            <span class="app-sidebar-nav-link-icon">
                                <i class="fa fa-users" />
                            </span>
                            <span class="app-sidebar-nav-link-text">
                                Gestão de usuários
                            </span>
                        </router-link>
                    </li>
                    <li class="list-group-item">
                        <router-link :to="{name: 'admin.schedules'}" class="app-sidebar-nav-link">
                            <span class="app-sidebar-nav-link-icon">
                                <i class="fa fa-calendar" />
                            </span>
                            <span class="app-sidebar-nav-link-text">
                                Calendário
                            </span>
                        </router-link>
                    </li>
                    <li class="list-group-item">
                        <router-link :to="{name: 'admin.reports'}" class="app-sidebar-nav-link">
                            <span class="app-sidebar-nav-link-icon">
                                <i class="fa fa-chart-line" />
                            </span>
                            <span class="app-sidebar-nav-link-text">
                                Análise e Relatórios
                            </span>
                        </router-link>
                    </li>
                    <li class="list-group-item">
                        <router-link :to="{name: 'admin.data.import'}" class="app-sidebar-nav-link">
                            <span class="app-sidebar-nav-link-icon">
                                <i class="fa fa-upload" />
                            </span>
                            <span class="app-sidebar-nav-link-text">
                                Importação
                            </span>
                        </router-link>
                    </li>
                    <li class="list-group-item">
                        <router-link :to="{name: 'admin.data.export'}" class="app-sidebar-nav-link">
                            <span class="app-sidebar-nav-link-icon">
                                <i class="fa fa-download" />
                            </span>
                            <span class="app-sidebar-nav-link-text">
                                Exportação
                            </span>
                        </router-link>
                    </li>
                    <li class="list-group-item">
                        <router-link :to="{name: 'admin.settings'}" class="app-sidebar-nav-link">
                            <span class="app-sidebar-nav-link-icon">
                                <i class="fa fa-gear" />
                            </span>
                            <span class="app-sidebar-nav-link-text">
                                Configurações
                            </span>
                        </router-link>
                    </li>
                </ul>
            </div>
            <div class="h-10vh">
                <ul class="app-sidebar-nav list-group list-group-flush position-relative text-md">
                    <li class="list-group-item w-100 " @click="handleLogout">
                        <div class="app-sidebar-nav-link">
                            <span class="app-sidebar-nav-link-icon">
                                <i class="fa fa-sign-out"></i>
                            </span>
                            <span class="app-sidebar-nav-link-text">
                                logout
                            </span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </aside>
</template>

<style scoped>
aside{
    width: clamp(15vw, 18vw, 30vw);
    height: 100vh;
    box-shadow: 0px 3px 10px #575757;
}

li.list-group-item{
    @apply bg-transparent cursor-pointer border-none py-1 hover:bg-slate-200 rounded-sm;
}

.app-sidebar-nav{
    width: 90%;
    margin: 0 auto
}
.app-sidebar-nav-link-icon{
    margin-left: 5px;
    margin-right: 10px;
}
.app-sidebar-nav-link-text{
    font-size: .85rem;
}
</style>