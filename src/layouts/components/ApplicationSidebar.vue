<script>
import AppLogo from '@/components/AppLogo.vue'
import Button from 'primevue/button';
import Tree from 'primevue/tree';
import PanelMenu from 'primevue/panelmenu';
import { mapGetters } from 'vuex';
import anime from 'animejs';
import Skeleton from 'primevue/skeleton';


export default {
    name: 'AppSidebar',
    components: {
        AppLogo, Button, Tree, PanelMenu, Skeleton
    },
    data() {
        return {
            activeMenu: null,
            mapped_rules: {},
            mapped_paths: {}
        }
    },
    created() {
        this.navs.map(nav => {
            nav.rules.map(rule => {
                this.mapped_rules[rule.route] = nav
                this.mapped_paths[rule.link] = nav
            })
            nav.show = false
        })
    },
    mounted(){
        this.checkPath()
    },
    methods: {
        handleLogout() {
            this.$store.dispatch('auth/logout')
            this.$router.push({path: "/"})
        },
        togglePanelMenu(){
            return this.isPanelOpen = !this.isPanelOpen
        },

        toggleShow (showOrHidden, nav) {
            this.navs.forEach(nav => {
                nav.show = false
            })
            
            nav.show = showOrHidden
        },

        onEnter(el, done){
            anime({
                targets: el,
                height: [0, el.scrollHeight + 10],
                paddingTop: 5,
                easing: 'easeInOutQuad',
                delay: 0,
                duration: 300,
                complete: done,
            });
        },

        onLeave(el, done){
            anime({
                targets: el,
                height: 0,
                paddingTop: 0,
                easing: 'easeInOutQuad',
                delay: 0,
                duration: 0,
                complete: done,
            });
        },

        getPath(fullPath) {
            // Dividir o caminho em partes
            const pices = fullPath.split('/');
            
            // Pegar as três primeiras partes e reconstruir o caminho
            const target = `/${pices[1]}/${pices[2]}`;
            
            return target;
        },

        checkPath(){
            try {
                const mappedRule = this.mapped_rules[this.$route.name];
                if (mappedRule) {
                    this.activeMenu = mappedRule.code;
                    this.toggleShow(true, mappedRule);
                } else {
                    const path = this.getPath(this.$route.fullPath)
                    const mappedPath = this.mapped_paths[path]
                    // console.log(this.mapped_paths)
                    // console.log(path)
                    // console.log(this.mapped_paths[path])
                    if(mappedPath){
                        this.activeMenu = mappedPath.code;
                        this.toggleShow(true, mappedPath);
                    } else {
                        console.warn(`No mapped rule found for route: ${this.$route.name}`);
                    }
                }
            } catch (error) {
                console.error("Error in $route watcher:", error);
            }
        },
    },
    computed: {
        ...mapGetters({
            user: 'auth/user',
            navs: 'auth/navAndRoles',
            fetchNavsBusy: 'auth/fetchNavsBusy',
        })
    },
    watch: {
        $route(to, from){
            this.checkPath()
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
                <div v-if="fetchNavsBusy" class="w-full flex flex-col gap-2">
                    <Skeleton height="2rem"></Skeleton>
                    <Skeleton height="2rem"></Skeleton>
                    <Skeleton height="2rem"></Skeleton>
                    <Skeleton height="2rem"></Skeleton>
                    <Skeleton height="2rem"></Skeleton>
                    <Skeleton height="2rem"></Skeleton>
                </div>

                <ul v-else class="app-sidebar-nav list-group flex flex-col gap-1 relative text-md">
                    <template v-for="nav in navs">
                        <li v-if="nav.visible" :key="nav.code" 
                            class="list-group-item" :class="{'bg-slate-200': nav.show, 'bg-transparent': !nav.show, 'border-l-4 border-red-600': nav.show}"
                            @click="() => toggleShow(!nav.show, nav)"
                        >
                            <p class="app-sidebar-nav-link">
                                <span class="app-sidebar-nav-link-icon">
                                    <i :class="nav.icon"></i>
                                </span>
                                <span class="app-sidebar-nav-link-text" :class="{'text-zinc-950': nav.show, 'text-zinc-700': !nav.show}">
                                    {{nav.name}}
                                </span>

                                <small v-if="!nav.show">
                                    <i class="fa fa-chevron-left text-[0.63rem] absolute right-3 transform translate-y-1/2 opacity-80" />
                                </small>

                                <small v-else>
                                    <i class="fa fa-chevron-down text-[0.63rem] absolute right-3 transform translate-y-1/2 opacity-80" />
                                </small>
                            </p>

                            <Transition :css="false" @enter="onEnter" @leave="onLeave" :duration="{enter: 10, leave: 0}">
                                <ul class="flex flex-col gap-3 h-0 overflow-hidden" v-if="nav.show"  @click.stop>
                                    <template v-for="rule in nav.rules" :key="rule.code">
                                        <li v-if="rule.visible"  @click.stop>
                                            <router-link :to="{name: rule.route}" class="app-sidebar-nav-link pl-8" @click.stop>
                                                <span class="app-sidebar-nav-link-text hover:text-black hover:font-semibold"
                                                    :class="{'text-zinc-950 font-semibold': $route.fullPath.includes(rule.link)}"
                                                >
                                                    {{rule.name}}
                                                </span>
                                            </router-link>
                                        </li>
                                    </template>
                                </ul>
                            </Transition>
                        </li>
                    </template>
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
    width: 230px;
    z-index: 30;
    position: fixed;
    /* width: clamp(15vw, 18vw, 30vw); */
    height: 100vh;
    box-shadow: 0px 3px 10px #575757;
}

li.list-group-item{
    @apply cursor-pointer py-2 px-4 hover:bg-slate-200 rounded-md relative;
}

.app-sidebar-nav{
    width: 100%;
    margin: 0 auto
}
.app-sidebar-nav-link-icon{
    margin-left: 5px;
    margin-right: 10px;
}
.app-sidebar-nav-link-text{
    font-size: .85rem;
}

@media (min-width: 1500px){
    aside{
        width: 240px;
    }
}
</style>