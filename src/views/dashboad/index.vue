<script>
import { mapGetters } from 'vuex';
import { setDocumentTitleMixin } from "@/config/document.title.js"
import Card from 'primevue/card';
import AdminOverviewInfo from './components/AdminOverviewInfo.vue'
import OrganizerOverviewInfo from './components/OrganizerOverviewInfo.vue'

export default {
    name: "Admin.Dashboard",
    mixins: [setDocumentTitleMixin],
    components: {
        Card,
        AdminOverviewInfo,
        OrganizerOverviewInfo
    },
    data(){
        return {
            title: 'Dashboard | Poliinsights',
            busy: false,
        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/user',
        }),
    }
}
</script>

<template>
     <div class="flex flex-col py-3 px-5 gap-3 w-full">
        <template v-if="user">
            <div>
                <AdminOverviewInfo v-if="user?.groupId == 1" />

                <OrganizerOverviewInfo v-else-if="user?.groupId == 2"/>

                <div v-else>
                    Normal
                </div>
            </div>
        </template>
        <template v-else>
            <div class="flex w-full justify-center items-center h-28">
                <i class="fa fa-spinner animate-spin text-black text-lg"></i>
            </div>
        </template>
    </div>
</template>