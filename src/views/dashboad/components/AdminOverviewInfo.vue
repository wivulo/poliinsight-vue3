<script>
import DashboadServices from "@/services/DashboadServices"
import Card from "@/components/PCard/index.js"
import TableEvents from "./TableEvents.vue"

export default {
    name: "AdminOverviewInfo",
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
                    <p>Organizadores de evento</p>
                </CardHeader>
                <CardValue>
                    {{ data.total_organizers }}
                </CardValue>
                <CardInformation>
                    <p>0% - na ultima semana</p>
                </CardInformation>
            </CardRoot>

            <CardRoot>
                <CardHeader icon="fa-chart-line text-red-600">
                    <p>Usuários</p>
                </CardHeader>
                <CardValue>
                    {{ data.total_users }}
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