<script>
import DashboadServices from "@/services/DashboadServices"
import Card from "./OverviewCard/index.js"
import TableEvents from "./TableEvents.vue"
import { mapGetters } from 'vuex';

export default {
    name: "OrganizerOverviewInfo",
    components: {
        CardRoot: Card.Root,
        CardHeader: Card.Header,
        CardValue: Card.Value,
        CardInformation: Card.Information,
        TableEvents
    },
    data(){
        return {
            busy: false,
            data: {
                total_events: 0,
                last_five_events: [],
                popular: null,
                total_participants: 0,
            }
        }
    },
    created() {
        this.getDashboardData()
    },
    methods: {
        async getDashboardData(){
            this.busy = true
            const response = await DashboadServices.getDashboardOrganizerData(this.$route.params.id)
            .catch(() => this.errorMessages())
            .finally(() => this.busy = false)

            if(response.status === 200 && response.data.error){
                this.errorMessages()
                return
            }
            
            if(response.status === 200){
                this.data = response.data
                return
            }
    
            this.errorMessages()
        },

        errorMessages(){
            this.$toast.add({severity:'error', summary: 'Error', detail: 'Erro ao buscar os dados', life: 2000})
        }
    },
}
</script>

<template>
    <div>
        <div class="flex justify-between w-full">
            <CardRoot>
                <CardHeader icon="fa-chart-line text-red-600">
                    <p>Eventos</p>
                </CardHeader>
                <CardValue>
                    {{ data.total_events }}
                </CardValue>
                <CardInformation>
                    <p>0% - na ultima semana</p>
                </CardInformation>
            </CardRoot>


            <CardRoot>
                <CardHeader icon="fa-chart-line text-red-600">
                    <p>Total de participantes</p>
                </CardHeader>
                <CardValue>
                    {{ data.total_participants }}
                </CardValue>
                <CardInformation>
                    <p>0% - na ultima semana</p>
                </CardInformation>
            </CardRoot>

            <CardRoot>
                <CardHeader icon="fa-chart-line text-red-600">
                    <p>Evento Popular</p>
                </CardHeader>
                <CardValue>
                   <small> {{ data.popular ?? 'Nenhum evento popular' }}</small>
                </CardValue>
                <CardInformation>
                    <p>0% - na ultima semana</p>
                </CardInformation>
            </CardRoot>


            <CardRoot>
                <CardHeader icon="fa-chart-line text-red-600">
                    <p>Visitantes</p>
                </CardHeader>
                <CardValue>
                    {{ 0 }}
                </CardValue>
                <CardInformation>
                    <p>0% - na ultima semana</p>
                </CardInformation>
            </CardRoot>
        </div>

        <div class="flex flex-col gap-5 w-full mt-7">
            <div class="mt-3">
                <p class="text-[0.94rem] text-surface-400 font-semibold ">Últimos eventos</p>
            </div>

            <TableEvents :events="data.last_five_events" :busy="busy" />
        </div>
    </div>
</template>