<script>
import { setDocumentTitleMixin } from "@/config/document.title.js"
import { mapGetters } from 'vuex';
import Button from 'primevue/button';
import CCard from "@/components/PCard/index.js"
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import Marquee from '@/components/Marquee/index.vue';
import { mapActions } from "vuex";
import SpeakersTable from './components/SpeakersTable.vue';
import ModalAdminNewSpeaker from "./components/ModalAdminNewSpeaker.vue";
import Dropdown from 'primevue/dropdown';

export default {
    name: "event.speakers.admin",
    mixins: [setDocumentTitleMixin],
    components: {
        Button,
        CardRoot: CCard.Root, Marquee,
        InputText, Dropdown,
        InputGroup,
        SpeakersTable, ModalAdminNewSpeaker,
    },
    data(){
        return {
            title: 'Poliinsight | Palestrantes',
            filter: null,
        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/user'
        }),
    },
    methods: {
        ...mapActions("printer", ["handlePrint"]),

        handleShowModalNewSpeaker(){
            this.$refs.ModalNewSpeaker.show()
        },

        handleRefresTableSpeakers(){
            this.$refs.SpeakersTable.fetchSpeakers()
        },
    },
}
</script>

<template>
    <div class="w-full py-3 px-5">
        <ModalAdminNewSpeaker ref="ModalNewSpeaker" @created="handleRefresTableSpeakers" />

        <div class="mt-4 flex gap-5">
            <div class="flex grow">
                <CardRoot class="w-full min-h-[500px]">
                    <div class="flex justify-between items-end mb-1">
                        <div class="flex flex-col">
                            <p class="text-base font-semibold">Palestrantes</p>
                            <p class="text-sm">Gestão de Palestrantes aqui</p>
                        </div>

                        <div class="flex gap-2 no-print">
                            <Button size="small" class="h-8" @click="handleShowModalNewSpeaker" title="criar lista de palestrantes">
                               <span class="text-xs"> <i class="fa fa-plus font-light mr-1"/>adicionar</span>
                            </Button>

                            <Button severity="secondary" size="small" class="h-8" @click="handlePrint" title="Imprimir lista de palestrantes">
                               <span class="text-slate-800 text-xs"> <i class="fa fa-print mr-1"/>imprimir</span>
                            </Button>
                        </div>
                    </div>

                    <hr />
                    
                    <SpeakersTable ref="SpeakersTable" />
                    
                </CardRoot>
           </div>
        </div>
    </div>
</template>