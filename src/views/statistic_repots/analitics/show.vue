<script>
import EventServices from '@/services/EventServices';
import FinancesServices from '@/services/FinancesServices.js';
import currency from '@/helpers/currency';
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
            statistic_busy: false,
            dataGenderDistribuition: null,
            dataGenderDistribuitionChartOptions: null,
            ageDistribuition: null,
            ageDistribuitionChartOptions: null,
            pluginEmptyDataPlugin: emptyDataPlugin,
            investments: {
                busy: false,
                data: []
            },
        }
    },
    async created(){
        this.getEvent()
        this.getStatistic()
        this.fetchInvestiments()
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

        old_fullname(){
            return `${this.statistic?.oldestParticipantInfo.name} ${this.statistic?.oldestParticipantInfo.nickname}`
        },

        new_fullname(){
            return `${this.statistic?.youngestParticipantInfo.name} ${this.statistic?.youngestParticipantInfo.nickname}`
        },

        totalInvestiments(){
            return this.investments.data.reduce((acc, curr) => acc + curr.amount, 0)
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
            this.statistic_busy = true
            const responde = await EventServices.getStatistic(this.$route.params.id)
            .catch(() => this.$toast.add({severity: 'error', summary: 'Erro', detail: 'Erro ao buscar as estatísticas'}))
            this.statistic = responde.data
            this.statistic_busy = false
        },

        setdataGenderDistribuition() {
            let male = 0;
            let female = 0;

            if(this.statistic?.genderDistribution){
                male = this.statistic.genderDistribution?.male;
                female = this.statistic.genderDistribution?.female;
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

            if(this.statistic?.agesDistribution){
                let objAges = this.statistic.agesDistribution;
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
        },

        toKwanza(value){
            return currency.KWAZA.format(value)
        },

        async fetchInvestiments(){
            try {
                this.investments.busy = true;
                const response = await FinancesServices.findInvestiment(this.$route.params.id);
                this.investments.data = response.data;
            } catch (error) {
                console.error(error);
            } finally {
                this.investments.busy = false;
            }
        },
    },
    watch: {
        statistic() {
            this.updateCharts();
        }
    },
}
</script>

<template>
    <div class="flex px-5 py-7 w-full">
        <div class="flex flex-col gap-10 items-center w-full">
    
            <div class="flex flex-col gap-4 w-full">
               <div class="flex justify-between w-full border-b border-zinc-400/20 items-center">
                    <p class="text-xl font-bold uppercase">
                        <i class="fa fa-spinner animate-spin text-black text-base" v-if="busy" />
                        <span v-else>
                            {{ event?.name }}
                        </span>
                    </p>
                    <p class="text-base font-semibold">Mapa do evento</p>
               </div>

               <div class="flex justify-between gap-7 min-h-[14rem] mb-4">
                    <CardRoot class="h-48">
                        <CardValue class="flex gap-3 relative h-40">
                            <p class="font-semibold">Total de vagas</p>
                            <div class="self-end">
                                <p class="text-xl">
                                    <i class="fa fa-spinner animate-spin text-black text-base" v-if="busy"></i>
                                    <span v-else>{{ event?.vacancies ?? 0 }}</span>
                                </p>
                            </div>
                        </CardValue>
                    </CardRoot>

                    <CardRoot class="h-48">
                        <CardValue class="flex gap-3 relative">
                            <p class="font-semibold">Total de inscrições</p>
                            <div class="self-end">
                                <p class="text-xl">
                                    <i class="fa fa-spinner animate-spin text-black text-base" v-if="statistic_busy"></i>
                                    <span v-else>{{ statistic?.totalParticipants ?? 0 }}</span>
                                </p>
                            </div>
                            <div class="w-5 h-40 border border-zinc-300 overflow-hidden relative">
                                <div class="w-5 bg-zinc-600 absolute bottom-0 left-0" :style="{height: statistic?.totalParticipants*((1/100)*160)+'px' ?? 0+'px'}"></div>
                            </div>
                        </CardValue>
                    </CardRoot>

                    <CardRoot class="h-48">
                        <CardValue>
                            <CardValue class="flex gap-3 relative h-40">
                            <p class="font-semibold">Vagas Restantes</p>
                            <div class="self-end">
                                <p class="text-xl">
                                    <i class="fa fa-spinner animate-spin text-black text-base" v-if="busy || statistic_busy"></i>
                                    <span v-else>{{ (+event?.vacancies) - (+statistic?.totalParticipants) }}</span>
                                </p>
                            </div>
                            </CardValue>
                        </CardValue>
                    </CardRoot>

                    <CardRoot class="h-48">
                        <CardValue>
                            <CardValue class="flex gap-3 relative h-40">
                            <p class="font-semibold">Investimento</p>
                            <div class="self-end">
                                <p class="text-xl">
                                    <i class="fa fa-spinner animate-spin text-black text-base" v-if="investments.busy"></i>
                                    <span v-else>{{ toKwanza(totalInvestiments) }}</span>
                                </p>
                            </div>
                            </CardValue>
                        </CardValue>
                    </CardRoot>
               </div>

               <div>
                    <p>Dados demográficos</p>
               </div>

               <template v-if="statistic_busy">
                    <div class="flex justify-between gap-7">
                        <CardRoot class="cardroot flex justify-center items-center" style="width: 350px;height: 300px;">
                            <i class="fa fa-spinner animate-spin text-black text-base" />
                        </CardRoot>

                        <CardRoot class="cardroot flex justify-center items-center" style="width: 350px;height: 300px;">
                            <i class="fa fa-spinner animate-spin text-black text-base" />
                        </CardRoot>

                        <div class="flex flex-col gap-5">
                            <CardRoot class="h-[86px] flex justify-center items-center w-56">
                                <i class="fa fa-spinner animate-spin text-black text-base" />
                            </CardRoot>

                            <CardRoot class="h-[86px] flex justify-center items-center w-56">
                                <i class="fa fa-spinner animate-spin text-black text-base" />
                            </CardRoot>

                            <CardRoot class="h-[86px] flex justify-center items-center w-56">
                                <i class="fa fa-spinner animate-spin text-black text-base" />
                            </CardRoot>
                        </div>
                    </div>
                </template>

                <div v-else class="flex gap-8 justify-between min-h-[19rem] pb-2 mb-5">
                    <CardRoot class="flex justify-center items-center">
                        <PChart ref="chart" type="pie" :data="dataGenderDistribuition" :options="dataGenderDistribuitionChartOptions" :plugins="[pluginEmptyDataPlugin]" class="w-full md:w-30rem" />
                    </CardRoot>

                    <CardRoot class="flex justify-center items-center">
                        <PChart ref="chart" type="bar" :data="ageDistribuition" :options="ageDistribuitionChartOptions" :plugins="[pluginEmptyDataPlugin]" :canvas-props="{width: 350, height: 300}" />
                    </CardRoot>

                    <div class="flex flex-col gap-5">
                        <CardRoot class="h-28">
                            <CardHeader>
                                <p>Participante Mais velho</p>
                            </CardHeader>
                            <CardValue class="mt-2 text-sm" v-if="statistic?.oldestParticipantInfo">
                                <p><b>Nome:</b> {{ old_fullname }}</p>
                                <p><b>Idade: </b> {{ statistic.oldestParticipant }} anos</p>
                            </CardValue>
                            <CardInformation v-else class="mt-2">
                                <p>Nenhum dado disponível</p>
                            </CardInformation>
                        </CardRoot>

                        <CardRoot class="h-38">
                            <CardHeader>
                                <p>Participante Mais novo</p>
                            </CardHeader>
                            <CardValue class="mt-2 text-sm" v-if="statistic?.oldestParticipantInfo">
                                <p><b>Nome:</b> {{ new_fullname }}</p>
                                <p><b>Idade: </b> {{ statistic?.youngestParticipant }} anos</p>
                            </CardValue>
                            <CardInformation v-else class="mt-2">
                                <p>Nenhum dado disponível</p>
                            </CardInformation>
                        </CardRoot>

                        <CardRoot class="h-38 w-full">
                            <CardValue class="flex gap-3 justify-between relative h-16">
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

               <div>
                    <p>Dados financeiros</p>
               </div>

            </div>
        </div>
    </div>
</template>