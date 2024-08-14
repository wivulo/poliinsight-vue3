<script>
import EventServices from '@/services/EventServices';
import AutoComplete from 'primevue/autocomplete';
import Card from 'primevue/card';
import InputGroup from 'primevue/inputgroup';
import Button from 'primevue/button'
import Image from 'primevue/image';
import PChart from 'primevue/chart';
import { dateFormatter } from "@/utils/dateFormatter"
import { emptyDataPlugin } from "@/helpers/chartjs.plugins.js";
import CCard from "@/views/dashboad/components/OverviewCard/index"

export default {
    name: 'Statistic_repots.analitics.show',
    components: {
        AutoComplete, Card,
        InputGroup, Button,
        Image, PChart,
        CardRoot: CCard.Root,
        CardHeader: CCard.Header,
        CardValue: CCard.Value,
        CardInformation: CCard.Information,
    },
    data(){
        return {
            busy: false,
            event: null,
            statistic: null,
            dataGenderDistribuition: null,
            dataGenderDistribuitionChartOptions: null,
            ageDistribuition: null,
            ageDistribuitionChartOptions: null,
            pluginEmptyDataPlugin: emptyDataPlugin
        }
    },
    async created(){
        this.getEvent()
        this.getStatistic()
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
        date_formatter(){
            return dateFormatter
        }
    },
    methods: {
        async getEvent(){
            this.busy = true
            const responde = await EventServices.show(this.$route.params.id)
            .catch(() => this.$toast.add({severity: 'error', summary: 'Erro', detail: 'Erro ao buscar evento'}))
            this.event = responde.data
            this.busy = false
        },

        async getStatistic(){
            this.busy = true
            const responde = await EventServices.getStatistic(this.$route.params.id)
            .catch(() => this.$toast.add({severity: 'error', summary: 'Erro', detail: 'Erro ao buscar as estatísticas'}))
            this.statictic = responde.data
            this.busy = false
        },

        setdataGenderDistribuition() {
            let male = 0;
            let female = 0;

            if(this.statictic?.genderDistribution != null){
                male = this.statictic.genderDistribution?.male;
                female = this.statictic.genderDistribution?.female;
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

            if(this.statictic?.agesDistribution != null){
                let objAges = this.statictic.agesDistribution;
                for(const age in objAges){
                    if(+age >= 40 ){
                        ages[3] = objAges[age]
                    }
                    else if(+age >= 30 && +age < 40){
                        ages[2] = objAges[age]
                    }
                    else if(+age >= 25 && +age < 30){
                        ages[1] = objAges[age]
                    }
                    else {
                        ages[0] = objAges[age]
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
                        suggestedMax: 1000,
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
    }
}
</script>

<template>
    <div class="flex px-5 py-7 w-full">
        <div class="flex flex-col gap-10 items-center w-full">
    
            <div class="flex flex-col gap-4 w-full" v-if="event">
               <div class="flex justify-between w-full border-b border-zinc-400/20 items-center">
                    <p class="text-2xl font-bold uppercase">{{ event?.name }}</p>
                    <p class="text-base font-semibold">Mapa do evento</p>
               </div>

               <div class="flex gap-4">
                    <CardRoot class="h-48">
                        <CardHeader>
                            <p>Total de vagas</p>
                        </CardHeader>
                        <CardValue>
                            {{ 0 }}
                        </CardValue>
                    </CardRoot>

                    <CardRoot class="h-48">
                        <CardValue class="flex gap-3 relative">
                            <p class="font-semibold">Total de inscrições</p>
                            <div class="w-5 h-40 border border-zinc-300 overflow-hidden">
                                <div class="w-5" :style="{height: statistic?.totalParticipants ?? 10+'px'}"></div>
                            </div>
                        </CardValue>
                    </CardRoot>

                    <div class="card flex justify-center">
                        <PChart ref="chart" type="pie" :data="dataGenderDistribuition" :options="dataGenderDistribuitionChartOptions" :plugins="[pluginEmptyDataPlugin]" class="w-full md:w-30rem" />
                    </div>
               </div>
            </div>
        </div>
    </div>
</template>