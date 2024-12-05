<script>
import CCard from "@/components/PCard/index.js"
import Marquee from '@/components/Marquee/index.vue';
import SpeakerServices from '@/services/SpeakerServices';
import SpeakerInfoCard from "./SpeakerInfoCard.vue";
import Sidebar from 'primevue/sidebar';

export default {
    name: "event.speakers.list.info",
    components: {
        CardRoot: CCard.Root, Marquee, SpeakerInfoCard,
        Sidebar,
    },
    data(){
        return {
            speakers: [],
            busy: false,
            visible: false,
            speaker: null,

            activities: [
                {id: 1, name: 'Desenvolvimento Web'},
                {id: 2, name: 'Impacto da tecnologia na sociedade'},
                {id: 3, name: 'Inteligência Artificial'},
                {id: 4, name: 'Machine Learning'},
                {id: 5, name: 'Desenvolvimento Mobile'},
                {id: 6, name: 'Desenvolvimento de Jogos'},
            ]
        }
    },
    created(){
        this.fetchSpeakers()
    },
    methods: {
        async fetchSpeakers(){
            try {
                this.busy = true
                const response = await SpeakerServices.showByEvent(this.$route.params.id)

                if(response.status == 200){
                    this.speakers = response.data
                    return
                }

                this.handleErrorMessage()
            } catch (error) {
                console.error(error)
                this.handleErrorMessage(error)
            } finally {
                this.busy = false
            }
        },

        handleErrorMessage(message = 'Erro ao buscar os palestrantes'){
            this.$toast.add({severity:'error', summary: 'Error', detail: message, life: 3000});
        },

        handleShowSpeakerInfo(speaker){
            this.visible = true
            this.speaker = {...speaker}
            console.log(this.speaker)
        }
    },
    watch: {
        '$route.params.id': {
            handler: function(old, eventId){
                if(eventId && old != eventId){
                    this.fetchSpeakers()
                }
            },
            immediate: true
        }
    }
}
</script>

<template>
    <div class="flex flex-wrap gap-5 w-full h-full">
        <div v-if="busy" class="py-4">
            <div class="flex justify-center items-center">
                <i class="fa fa-spinner animate-spin text-black"></i>
            </div>
        </div>
        
        <div class="w-full h-28 flex justify-center items-center" v-else-if="!speakers.length">
            <div class="flex justify-center items-center">
                <p class="text-slate-600 text-sm">Nenhum palestrante encontrado</p>
            </div>
        </div>

        <div v-else class="flex flex-wrap gap-5">
            <SpeakerInfoCard v-for="speaker_event in speakers" :key="speaker_event.id" :speaker_event="speaker_event" 
                @click="handleShowSpeakerInfo(speaker_event.speaker)"
            />
        </div>

        <Sidebar v-model:visible="visible" header="" position="right">
            <div class="flex flex-col gap-3">
                <div class="flex justify-center items-center">
                    <img :src="speaker.imageURL" alt="avatar" class="w-24 h-24 rounded-full" />
                </div>

                <div class="text-center">
                    <h2 class="text-xl font-medium text-gray-600 dark:text-light">
                        {{ speaker.name }}
                    </h2>
                </div>

                <div class="mt-3 flex flex-col gap-3 text-sm">
                    <div class="flex justify-between border-b">
                        <p>Email:</p>
                        <p>{{ speaker.email }}</p>
                    </div>

                    <div class="flex justify-between border-b">
                        <p>Contacto:</p>
                        <p>{{ speaker.phone }}</p>
                    </div>

                    <div class="flex flex-col justify-between border-b gap-1">
                        <p>Descrição</p>
                        <p class="border rounded-md p-2 min-h-28">{{ speaker.description }}</p>
                    </div>

                    <hr />

                    <div class="flex flex-col gap-1">
                        <p>Actividades:</p>
                        <ul class="pl-2">
                            <li v-for="activity, i in activities" :key="activity.id" class="my-1">
                                <p>{{ ++i }}. {{ activity.name }}</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </Sidebar>
    </div>
</template>