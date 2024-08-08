<script>
import { mapGetters } from 'vuex';
import { setDocumentTitleMixin } from "@/config/document.title.js"
import DashboadServices from "@/services/DashboadServices"
import Card from 'primevue/card';

export default {
    name: "Admin.Dashboard",
    mixins: [setDocumentTitleMixin],
    components: {
        Card
    },
    data(){
        return {
            title: 'Dashboard | Poliinsights',
            busy: false,
            data: {
                total_users: null,
                total_organizers: null,
                total_events: null,
                last_five_events: [],
            }
        }
    },
    created() {
        this.getDashboardData()
    },
    methods: {
        async getDashboardData(){
            this.busy = true
            const response = await DashboadServices.getDashboardData()
            .catch(() => this.$toast.add({severity:'error', summary: 'Error', detail: 'Erro ao entrar no sistema', life: 2000}))
            .finally(() => this.busy = false)
            
            if(response.status === 200){
                this.data = response.data
                return
            }
    
            this.$toast.add({severity:'error', summary: 'Error', detail: 'Erro ao entrar no sistema', life: 2000})
        }
    }
}
</script>

<template>
     <div class="flex flex-col py-3 px-3 gap-3">
        <div class="my-3">
            <p class="text-lg text-surface-400 font-semibold ">Overview</p>
        </div>

        <div class="flex gap-7 w-full">
            <Card class="py-0 bg-surface-100">
                <template #content>
                    <p class="card-title font-semibold">Eventos</p>
                    <p>{{ data.total_events }}</p>
                    <p class="card-text">
                        0% per - na ultima semana
                    </p>
                    <a href="#" class=" text-md">Gestão de eventos</a>
                </template>
            </Card>

            <Card class="py-0 bg-surface-100">
                <template #content>
                    <p class="card-title font-semibold">Organizadores de evento</p>
                    <p>{{ data.total_organizers }}</p>
                    <p class="card-text">
                        0% per - na ultima semana
                    </p>
                    <a href="#" class=" text-md">Gestão de usuários</a>
                </template>
            </Card>
    
            <Card class="py-0 bg-surface-100">
                <template #content>
                    <p class="card-title font-semibold">Usuários</p>
                    <p>{{ data.total_users }}</p>
                    <p class="card-text">
                        0% per - na ultima semana
                    </p>
                    <a href="#" class=" text-md">Gestão de usuários</a>
                </template>
            </Card>
    
            <Card class="py-0 bg-surface-100">
                <template #content>
                    <p class="card-title font-semibold">Visitantes</p>
                    <p>{{ 0 }}</p>
                    <p class="card-text">
                        0% per - na ultima semana
                    </p>
                    <a href="#" class=" text-md">Gestão de visitantes</a>
                </template>
            </Card>
        </div>

        <div class="flex gap-7 w-full my-3">
            <p class="text-base text-surface-400 font-semibold ">Últimos 5 eventos</p>

            <ul v-if="data.last_five_events && data.last_five_events.length > 0">
                <li v-for="event in data.last_five_events">
                    <p>{{ event?.name }} - {{ event?.localization }} - {{ event?.date }}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.card{
    width: clamp(13rem, 18vw, 25rem);
}

.card-title{
    font-size: clamp(1rem, 1.25vw, 2rem);
}

.card-text{
    font-size: clamp(0.75rem, 1vw, 1.10rem);
}
</style>