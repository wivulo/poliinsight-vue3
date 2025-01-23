<script>
import currency from '@/helpers/currency';
import ISPBLogo from './ISPBLogo.vue';

export default {
    name: "ReportEventOverviewPreview",
    // props: ['event', 'statistic', 'registrations' ,'incomes', 'expenses', 'investiments', 'tickets'],
    props: {
        event: {
            type: Object,
            required: true
        },
        statistic: {
            type: Object,
            required: true
        },
        registrations: {
            type: Array,
            required: false,
            default: () => []
        },
        incomes: {
            type: Array,
            required: false,
            default: () => []
        },
        expenses: {
            type: Array,
            required: false,
            default: () => []
        },
        investiments: {
            type: Array,
            required: false,
            default: () => []
        },
        tickets: {
            type: Array,
            required: false,
            default: () => []
        }
    },
    components: {
        ISPBLogo
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
        totalFinances(finances){
            return finances.reduce((acc, curr) => acc + curr.amount, 0);
        },
        
        toKwanza(value){
            return currency.KWAZA.format(value)
        }
    }
}
</script>

<template>
    <div class="flex flex-col gap-4 text-sm w-full h-full pt-[85px] pr-[85px] pl-[70px] pb-[70px]">
        <div class="flex flex-col items-center mb-6">
            <ISPBLogo />

            <div class="text-center text-lg">
                <p >Instituto Superior Politécnico de Benguela</p>
                <p>Departamento de {{event.department.name ?? 'Engenharia'}}</p>
                <p>Relatório Geral do Evento</p>
            </div>
        </div>

        <div class="mb-1">
            <p class="text-lg">{{event.name}}</p>
            <p>
                {{event.description}}
            </p>
        </div>

        <div>
            <div class="flex items-center gap-1">
                <p><strong>Data:</strong> {{DDMMMYYYY(event.startDate)}}</p>
                <span>-</span>
                <p>{{DDMMMYYYY(event.endDate)}}</p>
            </div>
            <p><strong>Local:</strong> {{event.location}}</p>
            <p class="mb-2"><strong>Departamento:</strong> {{event.department?.name}}</p>
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
            <tr v-if="investiments">
                <td>Investimento</td>
                <td>{{toKwanza(sum(investiments))}}</td>
            </tr>
            <tr>
                <td>Participantes do gênero Masculino</td>
                <td v-if="statistic.genderDistribution">{{statistic.genderDistribution["Masculino"]}}</td>
                <td v-else>0</td>
            </tr>
            <tr>
                <td>Participantes do gênero Feminino</td>
                <td v-if="statistic.genderDistribution">{{statistic.genderDistribution["Feminino"]}}</td>
                <td v-else>0</td>
            </tr>
            <tr>
                <td>Idade do participante mais velho</td>
                <td>{{statistic.oldestParticipant}} anos</td>
            </tr>
            <tr>
                <td>Idade do participante mais novo</td>
                <td>{{statistic.youngestParticipant}} anos</td>
            </tr>
            <tr>
                <td>Idade mais frequente</td>
                <td>{{statistic.averageAge}} anos</td>
            </tr>
            </tbody>
        </table>
        </div>

        <div class="mb-3" v-if="registrations">
            <h4>Participantes inscritos:</h4>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Contacto</th>
                    </tr>
                </thead>
                <tbody v-if="registrations?.length">
                    <tr v-for="registration in registrations" :key="registration.id">
                        <td>{{registration.participant?.name}}</td>
                        <td>{{registration.participant?.email}}</td>
                        <td>{{registration?.participant.phone}}</td>
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
                <tbody v-if="tickets.length">
                    <tr v-for="ticket in tickets">
                        <td>{{ticket.name}}</td>
                        <td>{{toKwanza(ticket.price)}}</td>
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

        <div class="mb-3" v-if="investiments">
            <h4 class="font-semibold">Investimentos</h4>
            <table>
                <thead>
                <tr>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Montante</th>
                </tr>
                </thead>
                <tbody v-if="investiments.length">
                    <tr v-for="investiment in investiments">
                        <td>{{investiment.name}}</td>
                        <td>{{investiment.description}}</td>
                        <td>{{toKwanza(investiment.amount)}}</td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="3" class="text-center">Nenhum investimento cadastrado</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td><strong>Total</strong></td>
                        <td></td>
                        <td>{{toKwanza(totalFinances(investiments))}}</td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <div v-if="incomes">
            <h4 class="font-semibold">Receitas</h4>
            <table>
                <thead>
                <tr>
                    <th>Fonte</th>
                    <th>Descrição</th>
                    <th>Montante</th>
                </tr>
                </thead>
                <tbody v-if="incomes.length">
                    <tr v-for="income in incomes" :key="income.id">
                        <td>{{income?.source}}</td>
                        <td>{{income?.description}}</td>
                        <td>{{toKwanza(income?.amount)}}</td>
                    </tr>
                </tbody>

                <tbody v-else>
                    <tr>
                        <td colspan="3" class="text-center">Nenhuma receita cadastrada</td>
                    </tr>
                </tbody>

                <tfoot>
                    <tr>
                        <td><strong>Total</strong></td>
                        <td></td>
                        <td>{{toKwanza(totalFinances(incomes))}}</td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <div v-if="expenses">
            <h4 class="font-semibold">Despesas</h4>
            <table>
                <thead>
                <tr>
                    <th>Categoria</th>
                    <th>Descrição</th>
                    <th>Montante</th>
                </tr>
                </thead>
                <tbody v-if="expenses.length">
                    <tr v-for="expense in expenses" :key="expense.id">
                        <td>{{expense?.category}}</td>
                        <td>{{expense?.description}}</td>
                        <td>{{toKwanza(expense?.amount)}}</td>
                    </tr>
                </tbody>

                <tbody v-else>
                    <tr>
                        <td colspan="3" class="text-center">Nenhuma despesa cadastrada</td>
                    </tr>
                </tbody>

                <tfoot>
                    <tr>
                        <td><strong>Total</strong></td>
                        <td></td>
                        <td>{{toKwanza(totalFinances(expenses))}}</td>
                    </tr>
                </tfoot>
            </table>
        </div>

    </div>
</template>
