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
import SpeakersListInfoCard from './components/SpeakersListInfoCard.vue';
import ModalNewSpeaker from './components/ModalNewSpeaker.vue';

export default {
    name: "event.speakers",
    mixins: [setDocumentTitleMixin],
    components: {
        Button,
        CardRoot: CCard.Root, Marquee,
        InputText,
        InputGroup, SpeakersListInfoCard,
        ModalNewSpeaker
    },
    data(){
        return {
            title: 'Poliinsight | Palestrantes',
            events: {
                data: [],
                busy: false
            },
            event: {
                data: null,
                busy: false
            },

            filter: null,
        }
    },
    computed: {
        ...mapGetters({
            user: 'auth/user'
        }),
    },
    created(){
        this.fetchEvents()
    },
    methods: {
        async fetchEvents(){
            try {
                this.events.busy = true
                const response = await EventServices.fetchEventsOrganizer(this.user.id)

                if(response.status == 200){
                    this.events.data = response.data
                    return
                }

                this.handleErrorMessage()
            } catch (error) {
                console.error(error)
                this.handleErrorMessage(error)
            } finally {
                this.events.busy = false
            }
        },

        async fetchEvent(eventId){
            try {
                this.event.busy = true
                console.log(eventId)
                const responde = await EventServices.show(eventId)

                if(responde.status == 200){
                    this.event.data = responde.data
                    return
                }

                this.handleErrorMessage()
            } catch (error) {
                console.error(error)
                this.handleErrorMessage(error)
            } finally {
                this.event.busy = false
            }
        },

        handleErrorMessage(message = 'Erro ao buscar os eventos'){
            this.$toast.add({severity:'error', summary: 'Error', detail: message, life: 3000});
        },

        handleSelectEvent(event){
            this.$router.push({params: {id: event.id}})
        },

        ...mapActions("printer", ["handlePrint"]),

        handleShowModalNewSpeaker(){
            this.$refs.ModalNewSpeaker.show(this.event.data.id)
        },

        handleRefresSpeakerList(){
            this.$refs.SpeakersListInfoCard.fetchSpeakers()
        },
    },
    watch: {
        '$route': {
            handler: function(route){
                if(route && route.params?.id){
                    this.fetchEvent(route.params?.id)
                }
            },
            immediate: true
        }
    }
}
</script>

<template>
    <div class="w-full py-3 px-5">
        <ModalNewSpeaker ref="ModalNewSpeaker" @created="handleRefresSpeakerList" />

        <div class="mt-4 flex gap-5">
            <div class="flex grow">
                <CardRoot class="w-full min-h-[500px]">
                    <div class="flex justify-between items-end mb-1">
                        <div class="flex flex-col">
                            <p class="text-base font-semibold">Palestrantes</p>
                            <p class="text-sm">Gestão de Palestrantes aqui</p>
                        </div>

                        <div class="flex gap-2">
                            <Button size="small" class="h-8" @click="handleShowModalNewSpeaker" title="criar lista de palestrantes" :disabled="!event.data">
                               <span class="text-xs"> <i class="fa fa-plus font-light mr-1"/>adicionar</span>
                            </Button>

                            <Button severity="secondary" size="small" class="h-8" @click="handlePrint" title="Imprimir lista de palestrantes" :disabled="!event.data">
                               <span class="text-slate-800 text-xs"> <i class="fa fa-print mr-1"/>imprimir</span>
                            </Button>
                        </div>
                    </div>

                    <hr />

                    <div v-if="event.data" class="my-4 flex flex-wrap gap-5">
                        <SpeakersListInfoCard ref="SpeakersListInfoCard" />
                    </div>

                    <div v-else class="flex justify-center items-center py-10 my-3">
                        <p class="text-slate-600 text-sm">Selecione um evento para continuar</p>
                    </div>
                </CardRoot>
           </div>

            <div>
                <CardRoot class="w-80 h-full">
                    <div class="flex mb-2">
                        <InputGroup>
                            <Button size="small" class="h-9 bg-transparent border border-surface-300 border-r-0">
                                <i class="fa fa-search text-black" />
                            </Button>

                            <InputText size="small" v-model="filter" id="search" type="text" placeholder="Escreva para pesquisar..." class="w-full rounded-none h-9 border-l-0" />
                        </InputGroup>
                    </div>

                    <hr />

                    <div class="flex flex-col gap-5 mt-3">

                        <div v-if="events.busy" class="py-4">
                            <div class="flex justify-center items-center">
                                <i class="fa fa-spinner animate-spin text-black"></i>
                            </div>
                        </div>

                        <div v-else-if="!events.data.length" class="py-4">
                            <div class="flex justify-center items-center">
                                <p class="text-slate-600 text-sm">Nenhum evento encontrado</p>
                            </div>
                        </div>

                        <div v-else class="flex flex-col gap-3">
                            <div v-for="eventi in events.data" :key="eventi.id" class="h-16 flex justify-between border-l-4 items-center bg-gray-400/30 hover:bg-gray-400/40 p-2 rounded-md cursor-pointer relative overflow-hidden"
                                @click="handleSelectEvent(eventi)"
                                :class="{'bg-gray-400/50 border-primary-500': $route.query.eventId == eventi.id}"
                            >
                                <div v-if="event.busy" class="absolute top-0 left-0 w-full h-[65px] flex items-center justify-center bg-gray-400/10 z-20 rounded-md">
                                    <div class="flex justify-center items-center">
                                        <i class="fa fa-spinner animate-spin text-black"></i>
                                    </div>
                                </div>

                                <div class="flex items-center gap-3 z-10">
                                    <div class="image-container">
                                        <img :src="eventi.imageURL" :alt="eventi.name" class="image" />
                                    </div>
                                    <div class="overflow-hidden">
                                        <Marquee class="text-slate-600 text-sm whitespace-nowrap">
                                            {{ eventi.name }}
                                        </Marquee>
                                        <p class="text-slate-400 text-xs truncate w-[210px]">{{ eventi.description }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardRoot>
           </div>
        </div>
    </div>
</template>