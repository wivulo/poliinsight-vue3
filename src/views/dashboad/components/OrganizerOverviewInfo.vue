<script>
import DashboadServices from "@/services/DashboadServices"
import Card from "./OverviewCard/index.js"
import TableEvents from "./TableEvents.vue"
import { mapGetters } from 'vuex';
import Chart from 'primevue/chart';

export default {
    name: "OrganizerOverviewInfo",
    components: {
        CardRoot: Card.Root,
        CardHeader: Card.Header,
        CardValue: Card.Value,
        CardInformation: Card.Information,
        TableEvents, Chart,
    },
    data(){
        return {
            busy: false,
            data: {
                total_events: 0,
                last_five_events: [],
                popular: null,
                total_participants: 0,
            },
            genderDistribuition: null,
            genderDistribuitionChartOptions: null,
            ageDistribuition: null,
            ageDistribuitionChartOptions: null,
        }
    },
    created() {
        this.getDashboardData()
    },
    mounted() {
        this.genderDistribuition = this.setgenderDistribuition();
        this.genderDistribuitionChartOptions = this.setgenderDistribuitionChartOptions();
        this.ageDistribuition = this.setageDistribuition();
        this.ageDistribuitionChartOptions = this.setAgeDistribuitionChartOptions();
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
        },

        setgenderDistribuition() {
            return {
                labels: ['Homens', 'Mulheres'],
                datasets: [
                    {
                        data: [50, 30],
                        backgroundColor: [
                            'rgb(54, 162, 235)',
                            'rgb(255, 99, 132)',
                        ],
                        hoverBackgroundColor: [
                            'rgb(54, 162, 235)',
                            'rgb(255, 100, 135)',
                        ]
                    }
                ]
            };
        },

        setgenderDistribuitionChartOptions() {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');

            return {
                plugins: {
                    legend: {
                        labels: {
                            usePointStyle: true,
                            color: textColor
                        }
                    }
                }
            };
        },

        setageDistribuition() {
            return {
                labels: ['18', '20', '25', '+30'],
                datasets: [
                    {
                        label: 'Idades',
                        data: [540, 325, 702, 620],
                        backgroundColor: ['rgba(249, 115, 22, 0.2)', 'rgba(6, 182, 212, 0.2)', 'rgb(107, 114, 128, 0.2)', 'rgba(139, 92, 246, 0.2)'],
                        borderColor: ['rgb(249, 115, 22)', 'rgb(6, 182, 212)', 'rgb(107, 114, 128)', 'rgb(139, 92, 246)'],
                        borderWidth: 1
                    }
                ]
            };
        },

        setAgeDistribuitionChartOptions() {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
            const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

            return {
                plugins: {
                    legend: {
                        labels: {
                            color: textColor
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder
                        }
                    }
                }
            };
        },
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
                <CardValue class="text-sm py-1">
                    <template v-if="data.popular?.name.length > 16">
                        {{ data.popular?.name.substr(0, 18) +'... - Nº '+ data.popular?.registrations?.length ?? 'Nenhum evento popular' }}
                    </template>
                   <template v-else>
                    {{ data.popular?.name +' - Nº '+ data.popular?.registrations?.length ?? 'Nenhum evento popular' }}
                   </template>
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
                <p class="text-[0.9rem] text-surface-600 font-semibold ">Estatísticas do evento mais recente </p>
            </div>

            <div class="flex flex-wrap gap-14">
                <div class="card w-1/4 flex flex-col gap-4 text-base text-surface-600 font-medium mr-10">
                    <!-- <p class="font-medium">Nome do evento aqui</p>
                    <p>Localização do evento aqui</p>
                    <p>Data do evento aqui</p>
                    <p>Tipo do evento aqui</p>
                    <p>Departamento aqui</p> -->

                    <CardRoot class="h-[220px] flex flex-col">
                        <CardHeader>
                            <p>Nome do evento aqui</p>
                        </CardHeader>
                        <CardValue>
                           
                        </CardValue>
                        <CardInformation class="mt-5 flex flex-col gap-1">
                            <p>Localização do evento aqui</p>
                            <p>Data do evento aqui</p>
                            <p>Tipo do evento aqui</p>
                            <p>Departamento aqui</p>

                            <RouterLink :to="{name: 'analise_relatorios.analitics'}" class="mt-2 text-red-600">
                                Ver mais
                            </RouterLink>
                        </CardInformation>
                    </CardRoot>
                </div>

                <div class="card flex justify-content-center">
                    <Chart type="pie" :data="genderDistribuition" :options="genderDistribuitionChartOptions" class="w-full md:w-30rem" />
                </div>

                <div class="card flex justify-content-center">
                    <Chart type="bar" :data="ageDistribuition" :options="ageDistribuitionChartOptions" :width="300" :height="300" :canvas-props="{width: 300, height: 300}" />
                </div>
            </div>
        </div>

        <div class="flex flex-col gap-5 w-full mt-7">
            <div class="mt-3">
                <p class="text-[0.9rem] text-slate-600 font-semibold ">Últimos eventos</p>
            </div>

            <TableEvents :events="data.last_five_events" :busy="busy" />
        </div>
    </div>
</template>