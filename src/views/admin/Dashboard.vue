<script>
import { mapGetters } from 'vuex';
import { setDocumentTitleMixin } from "@/config/document.title.js"

export default {
    name: "Admin.Dashboard",
    mixins: [setDocumentTitleMixin],
    data(){
        return {
            title: 'Dashboard do Administrador'
        }
    }
}
</script>

<template>
    <main class="flex w-full h-screen">
        
    </main>
</template>