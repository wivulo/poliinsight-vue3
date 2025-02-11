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
    name: "ReportEventFinancial",
    components: {
        ISPBLogo, PTable, PTableHeader, TableTrThItem,
        PTableBody, PTableRow, PTableCell
    },
    props: {
        event: {
            type: Object,
            required: true
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
        }
    },
    computed: {
        filtered_finances(){
            let _investiments, _incomes, _expenses = new Array();

            _investiments = this.investiments.map((item) => {
                return {
                    ...item,
                    input: item.amount,
                    output: 0
                }
            });

            _incomes = this.incomes.map((item) => {
                return {
                    ...item,
                    name: item.source,
                    input: item.amount,
                    output: 0
                }
            });

            _expenses = this.expenses.map((item) => {
                return {
                    ...item,
                    name: item.category,
                    input: 0,
                    output: item.amount
                }
            });

            return [..._investiments, ..._incomes, ..._expenses];
        }
    },
    methods: {
        totalFinances(values = new Array()) {
            return values.reduce((acc, income) => acc + income.amount, 0)
        },
        netProfit() {
            return this.diference(this.totalFinances(this.incomes), this.totalFinances(this.expenses));
        },
        diference(a, b){
            return a > b ? a - b : b - a;
        },
        sum(array){
            return array.reduce((acc, curr) => acc + curr.amount, 0);
        },

        toKwanza(value){
            return currency.KWAZA.format(value)
        },
        DDMMMYYYY(date){
            return new Date(date).toLocaleDateString('pt-Ao', {day: '2-digit', month: 'long', year: 'numeric'});
        },
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
                <p>Relatório Financeiro</p>
                <p class="mb-0">
                    <b> {{event.name}}</b>
                </p>
            </div>
        </div>

        <section class="summary my-3">
            <div class="flex gap-5 justify-between w-full mt-2">
                <div class="flex flex-col w-48 h-32 border p-2 shadow-sm shadow-black/30">
                    <p><b>Receita Total</b></p>
                    <div class="w-full flex justify-end grow items-end">
                        {{toKwanza(totalFinances(incomes))}}
                    </div>
                </div>

                <div class="flex flex-col w-48 h-32 border p-2 shadow-sm shadow-black/30">
                    <p><b>Despesa Total</b></p>
                    <div class="w-full flex justify-end grow items-end">
                        {{toKwanza(totalFinances(expenses))}}
                    </div>
                </div>

                <div class="flex flex-col w-48 h-32 border p-2 shadow-sm shadow-black/30">
                    <p><b>Lucro Líquido</b></p>
                    <div class="w-full flex justify-end grow items-end">
                        {{toKwanza(netProfit())}}
                    </div>
                </div>
            </div>
        </section>

        <section class="summary">
            <div class="mb-3" v-if="filtered_finances">
                <p><b> Resumo Financeiro</b></p>
                <PTable>
                    <PTableHeader>
                        <TableTrThItem>Nome</TableTrThItem>
                        <TableTrThItem>Descrição</TableTrThItem>
                        <TableTrThItem>Entrada</TableTrThItem>
                        <TableTrThItem>Saída</TableTrThItem>
                    </PTableHeader>
                    <PTableBody v-if="filtered_finances.length">
                        <PTableRow v-for="finance in filtered_finances">
                            <PTableCell>{{finance.name}}</PTableCell>
                            <PTableCell>{{finance.description}}</PTableCell>
                            <PTableCell>{{finance.input === 0 ? ' --- ' : toKwanza(finance.input)}}</PTableCell>
                            <PTableCell>{{finance.output === 0 ? ' --- ' :  toKwanza(finance.output)}} </PTableCell>
                        </PTableRow>
                    </PTableBody>
                    <tfoot>
                        <PTableRow>
                            <PTableCell><b>Total</b></PTableCell>
                            <PTableCell></PTableCell>
                            <PTableCell>
                                {{toKwanza(sum(filtered_finances.filter(finance => finance.input)))}}
                            </PTableCell>
                            <PTableCell>
                                {{toKwanza(sum(filtered_finances.filter(finance => finance.output)))}}
                            </PTableCell>
                        </PTableRow>
                    </tfoot>
                </PTable>
            </div>
        </section>
    </div>
</template>