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
import CCard from "@/components/PCard/index.js"

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
        },

        fullname(name, nickname = null){
            return `${name} ${nickname ? nickname: ''}`
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
            this.statistic = responde.data
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
                            color: 'rgb(218, 85, 81)',
                            boxWidth: 0,
                            boxHeight: 0
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
                    <p class="text-xl font-bold uppercase">{{ event?.name }}</p>
                    <p class="text-base font-semibold">Mapa do evento</p>
               </div>

               <div class="flex gap-7 min-h-[19rem] mb-5">
                    <CardRoot class="h-48">
                        <CardValue class="flex gap-3 relative h-40">
                            <p class="font-semibold">Total de vagas</p>
                            <div class="self-end">
                                <p class="text-xl">
                                    {{ event?.vacancies ?? 0 }}
                                </p>
                            </div>
                        </CardValue>
                    </CardRoot>

                    <CardRoot class="h-48">
                        <CardValue class="flex gap-3 relative">
                            <p class="font-semibold">Total de inscrições</p>
                            <div class="self-end">
                                <p class="text-xl">
                                    {{ statistic?.totalParticipants ?? 0 }}
                                </p>
                            </div>
                            <div class="w-5 h-40 border border-zinc-300 overflow-hidden relative">
                                <div class="w-5 bg-zinc-600 absolute bottom-0 left-0" :style="{height: statistic?.totalParticipants ?? 0+'px'}"></div>
                            </div>
                        </CardValue>
                    </CardRoot>

                    <CardRoot class="h-48">
                        <CardValue>
                            <CardValue class="flex gap-3 relative h-40">
                            <p class="font-semibold">Vagas Restantes</p>
                            <div class="self-end">
                                <p class="text-xl">
                                    {{ (+event?.vacancies) - (+statistic?.totalParticipants) }}
                                </p>
                            </div>
                            </CardValue>
                        </CardValue>
                    </CardRoot>

                    <div class="card flex justify-center">
                        <PChart ref="chart" type="pie" :data="dataGenderDistribuition" :options="dataGenderDistribuitionChartOptions" :plugins="[pluginEmptyDataPlugin]" class="w-full md:w-30rem" />
                    </div>
               </div>

               <div class="flex gap-16 min-h-[19rem]">
                    <div class="flex flex-col gap-10">
                        <CardRoot class="h-32">
                            <CardHeader>
                                <p>Participante Mais velho</p>
                            </CardHeader>
                            <CardValue class="mt-5 text-sm" v-if="statistic?.oldestParticipantInfo">
                                <p><b>Nome:</b> {{ fullname(statistic?.oldestParticipantInfo?.name, statistic?.oldestParticipantInfo?.nickname) }}</p>
                                <p><b>Idade: </b> {{ statistic?.oldestParticipant }} anos</p>
                            </CardValue>
                            <CardInformation v-else class="mt-5">
                                <p>Nenhum dado disponível</p>
                            </CardInformation>
                        </CardRoot>

                        <CardRoot class="h-32">
                            <CardHeader>
                                <p>Participante Mais novo</p>
                            </CardHeader>
                            <CardValue class="mt-5 text-sm" v-if="statistic?.oldestParticipantInfo">
                                <p><b>Nome:</b> {{ fullname(statistic?.youngestParticipantInfo?.name, statistic?.youngestParticipantInfo?.nickname) }}</p>
                                <p><b>Idade: </b> {{ statistic?.youngestParticipant }} anos</p>
                            </CardValue>
                            <CardInformation v-else class="mt-5">
                                <p>Nenhum dado disponível</p>
                            </CardInformation>
                        </CardRoot>
                    </div>

                    <div class="card flex justify-content-center">
                        <PChart ref="chart" type="bar" :data="ageDistribuition" :options="ageDistribuitionChartOptions" :plugins="[pluginEmptyDataPlugin]" :canvas-props="{width: 500, height: 300}" />
                    </div>

                    <CardRoot class="h-36">
                        <CardValue class="flex gap-3 relative h-28">
                            <p class="font-semibold">Moda</p>
                            <div class="self-end">
                                <p class="text-xl">
                                    {{ statistic?.averageAge ?? 0 }}
                                </p>
                            </div>
                        </CardValue>
                    </CardRoot>
               </div>

            </div>
        </div>
    </div>
</template>