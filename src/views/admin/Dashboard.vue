<script>
import Header from './components/AdminHeader.vue';
import Sidebar from './components/AdminSidebar.vue';
import { mapGetters } from 'vuex';
import { setDocumentTitleMixin } from "@/config/document.title.js"

export default {
    name: "Admin.Dashboard",
    mixins: [setDocumentTitleMixin],
    components: {
        Header,
        Sidebar
    },
    data(){
        return {
            title: 'Dashboard do Administrador'
        }
    },
    computed: {
        ...mapGetters({
            user: "auth/user",
        })
    },
    created(){
        this.$store.dispatch("admin/fetchUsers")
        this.$store.dispatch("admin/fetchEvents")
    },
    watch: {
        user(){
            if(this.user.groupId !== 1) this.$router.push({name: 'home.user', params: {user: this.user.id}});
        }
    }
}
</script>

<template>
    <main class="flex w-full h-screen">
        <Sidebar class="h-screen" />

        <div class="flex flex-col flex-grow w-70vw">
            <Header />
            
            <div class="flex flex-grow px-3">
                <router-view />
            </div>
        </div>
    </main>
</template>