<script>
import DashboadServices from "@/services/DashboadServices"
import Card from "@/components/PCard/index.js"
import TableEvents from "./TableEvents.vue"
import PChart from 'primevue/chart';
import dayjs from 'dayjs'
import { mapGetters } from "vuex";
import { emptyDataPlugin } from "@/helpers/chartjs.plugins.js";

export default {
    name: "OrganizerOverviewInfo",
    components: {
        CardRoot: Card.Root,
        CardHeader: Card.Header,
        CardValue: Card.Value,
        CardInformation: Card.Information,
        TableEvents, PChart,
    },
    data(){
        return {
            busy: false,
            data: {
                total_events: 0,
                last_five_events: [],
                popular: null,
                total_participants: 0,
                last_event: {}
            },
            dataGenderDistribuition: null,
            dataGenderDistribuitionChartOptions: null,
            ageDistribuition: null,
            ageDistribuitionChartOptions: null,
            pluginEmptyDataPlugin: emptyDataPlugin
        }
    },
    created() {
        this.getDashboardData()
        console.log(window.innerWidth)
    },
    mounted() {
        if (this.$refs.chart && this.$refs.chart.chart) {
            this.$refs.chart.chart.destroy();
        }
        
        this.dataGenderDistribuition = this.setdataGenderDistribuition();
        this.dataGenderDistribuitionChartOptions = this.setdataGenderDistribuitionChartOptions();
        this.ageDistribuition = this.setageDistribuition();
        this.ageDistribuitionChartOptions = this.setAgeDistribuitionChartOptions();
    },
    computed: {
        ...mapGetters({
            user: 'auth/user'
        })
    },
    methods: {
        async getDashboardData(){
            this.busy = true
            const response = await DashboadServices.getDashboardOrganizerData(this.user?.id)
            .catch(() => this.errorMessages())
            .finally(() => this.busy = false)

            if(response?.status === 200 && response.data.error){
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

        dateFormater(date) {
            return dayjs(date).format('DD/MM/YYYY')
        },

        time(date){
            return dayjs(date).format('HH:mm')
        },

        setdataGenderDistribuition() {
            let male = 0;
            let female = 0;

            if(this.data.last_event?.statistic?.genderDistribution){
                male = this.data.last_event?.statistic.genderDistribution?.male;
                female = this.data.last_event?.statistic.genderDistribution?.female;
            }

            return {
                labels: ['Masculino', 'Feminino'],
                datasets: [
                    {
                        data: [male, female],
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

        setdataGenderDistribuitionChartOptions() {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--text-color');

            return {
                plugins: {
                    legend: {
                        labels: {
                            usePointStyle: true,
                            color: textColor
                        }
                    },
                    isempty: {
                        text: "Nenhum dado disponível",
                        font: '16px Arial',
                    }
                }
            };
        },

        setageDistribuition() {
            let ages = [0, 0, 0, 0]

            if(this.data.last_event?.statistic?.agesDistribution){
                let objAges = this.data.last_event?.statistic.agesDistribution;
                for(const age in objAges){
                    if(+age >= 40 ){
                        ages[3] += objAges[age]
                    }
                    else if(+age >= 30 && +age < 40){
                        ages[2] += objAges[age]
                    }
                    else if(+age >= 25 && +age < 30){
                        ages[1] += objAges[age]
                    }
                    else {
                        ages[0] += objAges[age]
                    }
                }
            }

            return {
                labels: ['17-24', '25-30', '30-40', '40-75'],
                datasets: [
                    {
                        label: 'Faixa etária',
                        data: ages,
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
                    },
                    isempty: {
                        text: "Nenhum dado disponível",
                        font: '16px Arial',
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
                        suggestedMax: 50,
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

        updateCharts() {
            this.dataGenderDistribuition = this.setdataGenderDistribuition();
            this.dataGenderDistribuitionChartOptions = this.setdataGenderDistribuitionChartOptions();
            this.ageDistribuition = this.setageDistribuition();
            this.ageDistribuitionChartOptions = this.setAgeDistribuitionChartOptions();

            this.$nextTick(() => {
                if (this.$refs.chart && this.$refs.chart.chart) {
                    this.$refs.chart.chart.update();
                }
            });
        }
    },
    watch: {
        data() {
            this.updateCharts();
        }
    },
}
</script>

<template>
    <div id="organizerOverview">
        <div class="flex justify-between w-full">
            <CardRoot>
                <CardHeader icon="fa-chart-line text-red-600">
                    <p>Eventos</p>
                </CardHeader>
                <CardValue>
                    <i class="fa fa-spinner animate-spin text-black text-base" v-if="busy"></i>
                   <span v-else> {{ data.total_events }}</span>
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
                    <i class="fa fa-spinner animate-spin text-black text-base" v-if="busy"></i>
                    <span v-else>{{ data.total_participants }}</span>
                </CardValue>
                <CardInformation>
                    <p>0% - na ultima semana</p>
                </CardInformation>
            </CardRoot>

            <CardRoot>
                <CardHeader icon="fa-chart-line text-red-600">
                    <p>Evento Popular</p>
                </CardHeader>
                <CardValue class="text-sm py-1" v-if="data.popular">
                    <template v-if="data.popular?.name.length > 16">
                        {{ data.popular?.name.substr(0, 18) +'... - Nº '+ data.popular?.registrations?.length ?? 'Nenhum evento popular' }}
                    </template>
                   <template v-else="data.popular?.name.length <= 16">
                    {{ data.popular?.name +' - Nº '+ data.popular?.registrations?.length ?? 'Nenhum evento popular' }}
                   </template>
                </CardValue>
                <CardValue class="text-sm py-1" v-else>
                    <i class="fa fa-spinner animate-spin text-black text-base" v-if="busy"></i>
                    <span v-else>Nenhum evento popular</span>
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
                    <i class="fa fa-spinner animate-spin text-black text-base" v-if="busy"></i>
                    <span v-else>{{ 0 }}</span>
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

            <template v-if="busy">
                <div class="flex justify-between gap-7">
                    <div class="w-[30%] text-base text-surface-600 font-medium">
                        <CardRoot class="cardInformation h-[300px] flex flex-col justify-center items-center">
                            <i class="fa fa-spinner animate-spin text-black text-base" />
                        </CardRoot>
                    </div>

                    <CardRoot class="cardroot flex justify-center items-center" style="width: 300px;height: 300px;">
                        <i class="fa fa-spinner animate-spin text-black text-base" />
                    </CardRoot>

                    <CardRoot class="cardroot flex justify-center items-center" style="width: 300px;height: 300px;">
                        <i class="fa fa-spinner animate-spin text-black text-base" />
                    </CardRoot>
                </div>
            </template>

            <template v-else>
                <div v-if="data.last_event.event && data.last_event?.statistic.id" class="flex flex-wrap justify-between">
                    <div class="w-[30%] text-base text-surface-600 font-medium">
                        <CardRoot class="cardInformation h-[300px] flex flex-col">
                            <CardHeader>
                                <p>{{ data.last_event?.event?.name }}</p>
                            </CardHeader>
                            <CardValue>
                            
                            </CardValue>
                            <CardInformation class="mt-2 flex flex-col gap-2 relative h-full text-sm">
                                <p><b>Localização</b>: {{ data.last_event?.event?.localization }}</p>
                                <p><b>Data de início</b>: {{ dateFormater(data.last_event?.event?.date) }} às {{ time(data.last_event?.event?.time) }}</p>
                                <p><b>Data de fim</b>: {{ dateFormater(data.last_event?.event?.endDate) }}</p> às {{ time(data.last_event?.event?.timeEnd) }}
                                <p><b>Categoria</b>: {{ data.last_event?.event?.category?.name }}</p>
                                <p><b>Departamento</b>: {{ data.last_event?.event?.departament }}</p>

                                <RouterLink :to="{name: 'analise_relatorios.analitics.show', params: {id: data.last_event?.event?.id ?? 1}}" class="text-red-600 absolute left-0 bottom-0">
                                    Ver mais
                                </RouterLink>
                            </CardInformation>
                        </CardRoot>
                    </div>

                    <CardRoot class="cardroot flex justify-center">
                        <PChart ref="chart" type="pie" :data="dataGenderDistribuition" :options="dataGenderDistribuitionChartOptions" :plugins="[pluginEmptyDataPlugin]" class="w-full md:w-30rem" />
                    </CardRoot>

                    <CardRoot class="cardroot flex justify-center">
                        <PChart ref="chart" type="bar" :data="ageDistribuition" :options="ageDistribuitionChartOptions" :plugins="[pluginEmptyDataPlugin]" :canvas-props="{width: 300, height: 300}" />
                    </CardRoot>
                </div>

                <div v-else class="flex flex-col justify-center items-center text-center text-sm h-72">
                    <p>Nenhum evento recente encontrado</p>
                    <p>Por favor, clica no link abaixo <br /> para criar um evento</p>
                    <RouterLink :to="{name: 'gestao-eventos.create'}" class="text-red-600 font-semibold">
                        Criar evento
                    </RouterLink>
                </div>
            </template>
        </div>

        <div class="flex flex-col gap-5 w-full mt-7">
            <div class="mt-3">
                <p class="text-[0.9rem] text-slate-600 font-semibold ">Últimos eventos</p>
            </div>

            <CardRoot>
                <TableEvents :events="data.last_five_events" :busy="busy" />
            </CardRoot>
        </div>
    </div>
</template>

<style>
#organizerOverview {
    .cardroot div[data-pc-section="content"]{
        padding-top: 5px;
        padding-bottom: 0
    }

    .cardInformation div[data-pc-section="body"],
    .cardInformation div[data-pc-section="content"],
    .cardInformation div[data-pc-section="content"] > div{
        height: 100%; 
    }

    .cardInformation div[data-pc-section="content"] > div{
        display: flex;
        flex-direction: column;
    }
}
</style>