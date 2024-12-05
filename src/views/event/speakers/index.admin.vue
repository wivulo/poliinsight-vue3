<script>
import EventServices from '@/services/EventServices';
import { setDocumentTitleMixin } from "@/config/document.title.js"
import { mapGetters } from 'vuex';
import Button from 'primevue/button';
import CCard from "@/components/PCard/index.js"
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import Marquee from '@/components/Marquee/index.vue';
import { mapActions } from "vuex";
import ModalNewSpeaker from './components/ModalNewSpeaker.vue';
import SpeakersTable from './components/SpeakersTable.vue';

export default {
    name: "event.speakers.admin",
    mixins: [setDocumentTitleMixin],
    components: {
        Button,
        CardRoot: CCard.Root, Marquee,
        InputText,
        InputGroup,
        ModalNewSpeaker, SpeakersTable
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
        <ModalNewSpeaker ref="ModalNewSpeaker" @created="handleRefresTableSpeakers" />

        <div class="mt-4 flex gap-5">
            <div class="flex grow">
                <CardRoot class="w-full h-full">
                    <div class="flex justify-between items-end mb-1">
                        <div class="flex flex-col">
                            <p class="text-base font-semibold">Palestrantes</p>
                            <p class="text-sm">Gestão de Palestrantes aqui</p>
                        </div>

                        <div class="flex gap-2">
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