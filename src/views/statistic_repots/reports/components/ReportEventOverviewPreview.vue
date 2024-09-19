<script>
export default {
    name: "ReportEventOverviewPreview",
    props: ['event', 'statistic', 'registrations' ,'finances', 'tickets'],
    data(){
        return {
        }
    },
    methods: {
        DDMMMYYYY(date){
            return new Date(date).toLocaleDateString('pt-Ao', {day: '2-digit', month: 'long', year: 'numeric'});
        },
        diference(a, b){
            return a - b;
        },
        sum(array){
            return array.reduce((acc, curr) => acc + curr.amount, 0);
        },
        totalRevenues(revenues){
            return 0
            // return revenues.reduce((acc, curr) => acc + curr.value, 0);
        },
    }
}
</script>

<template>
    <div class="flex flex-col gap-4 text-sm w-full h-full">
        <div class="flex flex-col items-center mb-6">
            <img src="https://ispbenguela.com/front/img/logo/ispb.svg" width="150" height="150" alt="ispb logo" />
            <p class="text-center text-lg">Instituto Superior Politécnico de Benguela</p>
            <p class="text-center text-lg">Departamento de Engenharia</p>
            <p class="text-center text-lg">Relatório Geral do Evento</p>
        </div>

        <div class="mb-1">
            <p class="text-lg">{{event.name}}</p>
            <p>
                {{event.description}}
            </p>
        </div>

        <div>
            <div class="flex items-center gap-1">
                <p><strong>Data:</strong> {{DDMMMYYYY(event.date)}}</p>
                <span>-</span>
                <p>{{DDMMMYYYY(event.endDate)}}</p>
            </div>
            <p><strong>Local:</strong> {{event.localization}}</p>
            <p class="mb-2"><strong>Departamento:</strong> {{event.departament}}</p>
        </div>

        <div class="mb-3">
        <h4>Estatísticas Gerais</h4>
        <table>
            <thead>
            <tr>
                <th>Descrição</th>
                <th>Valor</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>Total de vagas</td>
                <td>{{event.vacancies}}</td>
            </tr>
            <tr>
                <td>Total de Participantes</td>
                <td>{{statistic.totalParticipants}}</td>
            </tr>
            <tr>
                <td>Vagas Restantes</td>
                <td>{{diference(event.vacancies, statistic.totalParticipants)}}</td>
            </tr>
            <tr>
                <td>Participantes Confirmados</td>
                <td v-if="statistic.confirmedParticipants">
                    {{statistic.confirmedParticipants}}
                </td>
                <td v-else>0</td>
            </tr>
            <tr v-if="finances && finances.investiments">
                <td>Investimento</td>
                <td>{{sum(finances.investiments)}}</td>
            </tr>
            <tr>
                <td>Participantes do gênero Masculino</td>
                <td v-if="statistic.genderDistribution">{{statistic.genderDistribution.male}}</td>
                <td v-else>0</td>
            </tr>
            <tr>
                <td>Participantes do gênero Feminino</td>
                <td v-if="statistic.genderDistribution">{{statistic.genderDistribution.female}}</td>
                <td v-else>0</td>
            </tr>
            <tr>
                <td>Idade do participante mais velho</td>
                <td>{{statistic.oldestParticipant}} anos de idade</td>
            </tr>
            <tr>
                <td>Idade do participante mais novo</td>
                <td>{{statistic.youngestParticipant}} anos de idade</td>
            </tr>
            <tr>
                <td>Idade mais frequente</td>
                <td>{{statistic.averageAge}}</td>
            </tr>
            </tbody>
        </table>
        </div>

        <div class="mb-3" v-if="registrations && registrations.participant">
            <h4>Participantes:</h4>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>data de inscrição</th>
                    </tr>
                </thead>
                <tbody v-if="registrations?.participant">
                    <tr v-for="participant in registrations.participant" :key="participant.id">
                            <td>{{participant?.name}}</td>
                            <td>{{participant?.email}}</td>
                            <!-- <td>{{participant?.registration}}</td> -->
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="3" class="text-center">Nenhum participante inscrito</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="mb-3" v-if="tickets">
            <h4>Ingressos</h4>
            <table>
                <thead>
                <tr>
                    <th>Nome</th>
                    <th>Preço</th>
                    <th>Quantidade</th>
                </tr>
                </thead>
                <tbody v-if="tickets">
                    <tr v-for="ticket in tickets">
                        <td>{{ticket.name}}</td>
                        <td>{{ticket.price}}</td>
                        <td>{{ticket.quantity}}</td>
                    </tr>                
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="3" class="text-center">Nenhum ingresso cadastrado</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="mb-3" v-if="finances && finances.investiments">
            <h4>Investimentos e Custos</h4>
            <table>
                <thead>
                <tr>
                    <th>Nome</th>
                    <th>Montante</th>
                </tr>
                </thead>
                <tbody v-if="finances.investiments">
                    <tr v-for="investiments in finances.investiments">
                        <td>{{investiments.name}}</td>
                        <td>{{investiments.amount}}</td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="2" class="text-center">Nenhum investimento cadastrado</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="finances && finances.incomes">
            <h4>Receitas</h4>
            <table>
                <thead>
                <tr>
                    <th>Fonte</th>
                    <th>Descrição</th>
                    <th>Montante</th>
                </tr>
                </thead>
                <tbody v-if="finances.incomes">
                    <tr v-for="revenue in finances.incomes">
                        <td>{{revenue?.source}}</td>
                        <td>{{revenue?.description}}</td>
                        <td>{{revenue?.amount}}</td>
                    </tr>
                </tbody>

                <tbody v-else>
                    <tr>
                        <td colspan="2" class="text-center">Nenhuma receita cadastrada</td>
                    </tr>
                </tbody>

                <tfoot>
                    <tr>
                        <td><strong>Total</strong></td>
                        <td>{{totalRevenues(finances.incomes)}}</td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <div v-if="finances && finances.expanses">
            <h4>Receitas</h4>
            <table>
                <thead>
                <tr>
                    <th>Fonte</th>
                    <th>Descrição</th>
                    <th>Montante</th>
                </tr>
                </thead>
                <tbody v-if="finances.expanses">
                    <tr v-for="revenue in finances.expanses">
                        <td>{{revenue?.source}}</td>
                        <td>{{revenue?.description}}</td>
                        <td>{{revenue?.amount}}</td>
                    </tr>
                </tbody>

                <tbody v-else>
                    <tr>
                        <td colspan="2" class="text-center">Nenhuma despesa cadastrada</td>
                    </tr>
                </tbody>

                <tfoot>
                    <tr>
                        <td><strong>Total</strong></td>
                        <td>{{totalRevenues(finances.expanses)}}</td>
                    </tr>
                </tfoot>
            </table>
        </div>

    </div>
</template>

<style>
    h1 {
      color: #333;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    table {
      border-bottom: 1px solid #e0e0e0d0;
      border-left: 1px solid #e0e0e0d0;
      border-right: 1px solid #e0e0e0d0;
    }

    th, td {
      padding: 10px;
      text-align: left;
    }

    tbody tr, tbody tr td{
      border-bottom: 1px solid #e0e0e0d0;
    }

    th {
      background-color: rgb(218, 85, 81);
      color: white;
    }

    .flex-2{flex: 2;}
    .flex-3{flex: 3;}
    .flex-4{flex: 4;}
    .flex-5{flex: 5;}
    .flex-6{flex: 6;}
</style>
