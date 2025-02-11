<script>
import currency from '@/helpers/currency';
import ISPBLogo from './ISPBLogo.vue';
import PTable from '@/components/UI/Table/PTable.vue';
import PTableHeader from '@/components/UI/Table/PTableHeader.vue';
import TableTrThItem from '@/components/UI/Table/TableTrThItem.vue';
import PTableBody from '@/components/UI/Table/PTableBody.vue';
import PTableRow from '@/components/UI/Table/PTableRow.vue';
import PTableCell from '@/components/UI/Table/PTableCell.vue';

export default {
    name: "ReportEventOverviewPreview",
    // props: ['event', 'event', 'registrations' ,'incomes', 'expenses', 'investiments', 'tickets'],
    props: {
        event: {
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
        ISPBLogo, PTable, PTableHeader, TableTrThItem,
        PTableBody, PTableRow, PTableCell
    },
    methods: {
        DDMMMYYYY(date) {
            return new Date(date).toLocaleDateString('pt-Ao', { day: '2-digit', month: 'long', year: 'numeric' });
        },
        diference(a, b) {
            return a - b;
        },
        sum(array) {
            return array.reduce((acc, curr) => acc + curr.amount, 0);
        },
        totalFinances(finances) {
            return finances.reduce((acc, curr) => acc + curr.amount, 0);
        },

        toKwanza(value) {
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
                <p>Instituto Superior Politécnico de Benguela</p>
                <p>Departamento de {{ event.department.name ?? 'Engenharia' }}</p>
                <p>Relatório Geral do Evento</p>
            </div>
        </div>

        <div>
            <p class="text-lg">{{ event.name }}</p>
            <div class="flex items-center gap-1">
                <p><strong>Data:</strong> {{ event.startDate }}</p>
                <span>-</span>
                <p>{{ event.endDate }}</p>
            </div>
            <p><strong>Local:</strong> {{ event.location }}</p>
            <p class="mb-2"><strong>Departamento:</strong> {{ event.department?.name }}</p>
        </div>

        <div class="mb-3 w-full">
            <h4 class="text-lg">Estatísticas Gerais</h4>
            <PTable>
                <PTableHeader>
                    <TableTrThItem>Descrição</TableTrThItem>
                    <TableTrThItem>Valor</TableTrThItem>
                </PTableHeader>
                <PTableBody>
                    <PTableRow>
                        <PTableCell>Total de vagas</PTableCell>
                        <PTableCell>{{ event.vacancies }}</PTableCell>
                    </PTableRow>
                    <PTableRow>
                        <PTableCell>Total de Participantes</PTableCell>
                        <PTableCell>{{ event.totalParticipants }}</PTableCell>
                    </PTableRow>
                    <PTableRow>
                        <PTableCell>Vagas Restantes</PTableCell>
                        <PTableCell>{{ diference(event.vacancies, event.totalParticipants) }}</PTableCell>
                    </PTableRow>
                    <PTableRow v-if="investiments">
                        <PTableCell>Investimento</PTableCell>
                        <PTableCell>{{ toKwanza(sum(investiments)) }}</PTableCell>
                    </PTableRow>
                    <PTableRow>
                        <PTableCell>Participantes do gênero Masculino</PTableCell>
                        <PTableCell v-if="event.genderDistribution">{{ event.genderDistribution["Masculino"] }}
                        </PTableCell>
                        <PTableCell v-else>0</PTableCell>
                    </PTableRow>
                    <PTableRow>
                        <PTableCell>Participantes do gênero Feminino</PTableCell>
                        <PTableCell v-if="event.genderDistribution">
                            {{ event.genderDistribution["Feminino"] }}
                        </PTableCell>
                        <PTableCell v-else>0</PTableCell>
                    </PTableRow>
                    <PTableRow>
                        <PTableCell>Idade do participante mais velho</PTableCell>
                        <PTableCell>{{ event.oldestParticipant }} anos</PTableCell>
                    </PTableRow>
                    <PTableRow>
                        <PTableCell>Idade do participante mais novo</PTableCell>
                        <PTableCell>{{ event.youngestParticipant }} anos</PTableCell>
                    </PTableRow>
                    <PTableRow>
                        <PTableCell>Idade mais frequente</PTableCell>
                        <PTableCell>{{ event.averageAge }} anos</PTableCell>
                    </PTableRow>
                </PTableBody>
            </PTable>
        </div>

        <div class="mb-3" v-if="registrations">
            <h4 class="text-lg">Participantes inscritos:</h4>
            <PTable>
                <PTableHeader>
                        <TableTrThItem>Nome</TableTrThItem>
                        <template v-if="event.EventConfiguration[0].registrationType === 'Grupo'">
                            <TableTrThItem>Membros</TableTrThItem>
                        </template>

                        <template v-else>
                            <TableTrThItem>Email</TableTrThItem>
                            <TableTrThItem>Contacto</TableTrThItem>
                        </template>
                    </PTableHeader>
                <PTableBody>
                    <PTableRow v-for="registration in registrations" :key="registration.id" v-if="registrations?.length">
                        <template v-if="registration.user">
                            <PTableCell>{{ registration.user?.name }}</PTableCell>
                            <PTableCell>{{ registration.user?.email }}</PTableCell>
                            <PTableCell>{{ registration.user?.phone }}</PTableCell>
                        </template>

                        <template v-if="registration.participant">
                            <PTableCell>{{ registration.participant?.name }}</PTableCell>
                            <PTableCell>{{ registration.participant?.email }}</PTableCell>
                            <PTableCell>{{ registration.participant?.phone }}</PTableCell>
                        </template>

                        <template v-if="registration.team">
                            <PTableCell>{{ registration.team?.name }}</PTableCell>
                            <PTableCell>{{ registration.team?.participants.length ?? 0 }}</PTableCell>
                        </template>
                    </PTableRow>
                    <PTableRow v-else>
                        <PTableCell colspan="3" class="text-center">Nenhum participante inscrito</PTableCell>
                    </PTableRow>
                </PTableBody>
            </PTable>
        </div>

        <div class="mb-3" v-if="tickets">
            <h4 class="text-lg">Ingressos</h4>
            <PTable>
                <PTableHeader>
                        <TableTrThItem>Nome</TableTrThItem>
                        <TableTrThItem>Preço</TableTrThItem>
                        <TableTrThItem>Quantidade</TableTrThItem>
                    </PTableHeader>
                <PTableBody>
                    <PTableRow v-for="ticket in tickets" :key="ticket?.id" v-if="tickets.length">
                        <PTableCell>{{ ticket?.name }}</PTableCell>
                        <PTableCell>{{ toKwanza(ticket?.price) }}</PTableCell>
                        <PTableCell>{{ ticket?.quantity }}</PTableCell>
                    </PTableRow>
                    <PTableRow v-else>
                        <PTableCell colspan="3" class="text-center">Nenhum ingresso cadastrado</PTableCell>
                    </PTableRow>
                </PTableBody>
            </PTable>
        </div>

        <div class="mb-3" v-if="investiments">
            <h4 class="text-lg">Investimentos</h4>
            <PTable>
                <PTableHeader>
                        <TableTrThItem>Nome</TableTrThItem>
                        <TableTrThItem>Descrição</TableTrThItem>
                        <TableTrThItem>Montante</TableTrThItem>
                </PTableHeader>
                <PTableBody>
                    <PTableRow v-for="investiment in investiments" :key="investiment?.id" v-if="investiments.length">
                        <PTableCell>{{ investiment?.name }}</PTableCell>
                        <PTableCell>{{ investiment?.description }}</PTableCell>
                        <PTableCell>{{ toKwanza(investiment?.amount) }}</PTableCell>
                    </PTableRow>
                    <PTableRow v-else>
                        <PTableCell colspan="3" class="text-center">Nenhum investimento cadastrado</PTableCell>
                    </PTableRow>
                </PTableBody>
                <tfoot>
                    <PTableRow>
                        <PTableCell><strong>Total</strong></PTableCell>
                        <PTableCell></PTableCell>
                        <PTableCell>{{ toKwanza(totalFinances(investiments)) }}</PTableCell>
                    </PTableRow>
                </tfoot>
            </PTable>
        </div>

        <div v-if="incomes">
            <h4 class="text-lg">Receitas</h4>
            <PTable>
                <PTableHeader>
                        <TableTrThItem>Fonte</TableTrThItem>
                        <TableTrThItem>Descrição</TableTrThItem>
                        <TableTrThItem>Montante</TableTrThItem>
                    </PTableHeader>
                <PTableBody>
                    <PTableRow v-for="income in incomes" :key="income.id" v-if="incomes.length">
                        <PTableCell>{{ income?.source }}</PTableCell>
                        <PTableCell>{{ income?.description }}</PTableCell>
                        <PTableCell>{{ toKwanza(income?.amount) }}</PTableCell>
                    </PTableRow>
                    <PTableRow v-else>
                        <PTableCell colspan="3" class="text-center">Nenhuma receita cadastrada</PTableCell>
                    </PTableRow>
                </PTableBody>
                <tfoot>
                    <PTableRow>
                        <PTableCell><strong>Total</strong></PTableCell>
                        <PTableCell></PTableCell>
                        <PTableCell>{{ toKwanza(totalFinances(incomes)) }}</PTableCell>
                    </PTableRow>
                </tfoot>
            </PTable>
        </div>

        <div v-if="expenses">
            <h4 class="text-lg">Despesas</h4>
            <PTable>
                <PTableHeader>
                        <TableTrThItem>Categoria</TableTrThItem>
                        <TableTrThItem>Descrição</TableTrThItem>
                        <TableTrThItem>Montante</TableTrThItem>
                    </PTableHeader>
                <PTableBody>
                    <PTableRow v-for="expense in expenses" :key="expense.id" v-if="expenses.length">
                        <PTableCell>{{ expense?.category }}</PTableCell>
                        <PTableCell>{{ expense?.description }}</PTableCell>
                        <PTableCell>{{ toKwanza(expense?.amount) }}</PTableCell>
                    </PTableRow>
                    <PTableRow v-else>
                        <PTableCell colspan="3" class="text-center">Nenhuma despesa cadastrada</PTableCell>
                    </PTableRow>
                </PTableBody>
                <tfoot>
                    <PTableRow>
                        <PTableCell><strong>Total</strong></PTableCell>
                        <PTableCell></PTableCell>
                        <PTableCell>{{ toKwanza(totalFinances(expenses)) }}</PTableCell>
                    </PTableRow>
                </tfoot>
            </PTable>
        </div>

    </div>
</template>
